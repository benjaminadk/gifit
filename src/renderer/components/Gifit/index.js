import React, { useState, useContext, useRef } from 'react'
import { remote } from 'electron'
import { CropFree } from 'styled-icons/material/CropFree'
import { Crop } from 'styled-icons/material/Crop'
import { Close } from 'styled-icons/material/Close'
import { Check } from 'styled-icons/material/Check'
import path from 'path'
import { writeFile, mkdir } from 'fs'
import { promisify } from 'util'
import createFolderName from '../../lib/createFolderName'
import { AppContext } from '../App'
import { Container, Toolbar, Option, Rectangle, Confirm, Countdown } from './styles'
import { RECORDINGS_DIRECTORY, RECORDING_ICON } from 'common/filepaths'
import config from 'common/config'

const {
  ipcActions: { GIFIT_CLOSE, GIFIT_STOP },
  constants: { VIDEO_CSS, IMAGE_TYPE, IMAGE_REGEX, MAX_LENGTH }
} = config

const mkdirAsync = promisify(mkdir)
const writeFileAsync = promisify(writeFile)

export default function Gifit() {
  const { state, dispatch } = useContext(AppContext)
  const { options, sources } = state

  const showCursor = options.get('showCursor')
  const useCountdown = options.get('useCountdown')
  const countdownTime = options.get('countdownTime')
  const frameRate = options.get('frameRate')
  const sourceIndex = options.get('sourceIndex')
  const source = sources[sourceIndex]

  const [mode, setMode] = useState(0)

  const [done, setDone] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [startX, setStartX] = useState(null)
  const [startY, setStartY] = useState(null)
  const [top, setTop] = useState(null)
  const [left, setLeft] = useState(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const [time, setTime] = useState(countdownTime)

  const clicked = useRef(false)

  async function onRecordStart(cropped) {
    setMode(2)
    // if useCountdown display countdown in ui
    await new Promise(resolve => {
      if (useCountdown) {
        const countdown = setInterval(() => {
          setTime(x => x - 1)
        }, 1000)
        setTimeout(() => {
          clearInterval(countdown)
          setMode(3)
          resolve()
        }, countdownTime * 1000)
      } else {
        setMode(3)
        resolve()
      }
    })
    // if showCursor forward all mouse events through transparent window
    if (showCursor) {
      remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true })
    }
    // capture full screen stream
    const { width: w, height: h } = source.display.bounds
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: w,
          maxWidth: w,
          minHeight: h,
          maxHeight: h
        }
      }
    })
    // create full screen size canvas
    const canvas1 = document.createElement('canvas')
    const ctx1 = canvas1.getContext('2d')
    canvas1.width = w
    canvas1.height = h
    // create selection size canvas
    const canvas2 = document.createElement('canvas')
    const ctx2 = canvas2.getContext('2d')
    canvas2.width = width
    canvas2.height = height
    // create video element to play stream on
    const video = document.createElement('video')
    video.style.cssText = VIDEO_CSS
    video.srcObject = stream
    document.body.appendChild(video)
    video.onloadedmetadata = e => video.play()
    // create data structures for frame, time and mouse data
    const frames = []
    const times = []
    const xPos = []
    const yPos = []
    const isClicked = []
    // record time and recording start
    var t1 = performance.now()
    // capture individual frames at configured frame rate per second
    const captureFrame = setInterval(() => {
      var frame
      // draw full screen image
      ctx1.clearRect(0, 0, w, h)
      ctx1.drawImage(video, 0, 0, w, h)
      // if cropped redraw selection on second canvas
      if (cropped) {
        ctx2.clearRect(0, 0, width, height)
        ctx2.drawImage(canvas1, startX, startY, width, height, 0, 0, width, height)
        // get raw data from canvas2
        frame = canvas2.toDataURL(IMAGE_TYPE)
      } else {
        // or get raw data from full screen canvas
        frame = canvas1.toDataURL(IMAGE_TYPE)
      }
      frames.push(frame)
      // calculate elapsed time between frames
      const t2 = performance.now()
      const diff = Math.round(t2 - t1)
      t1 = t2
      times.push(diff)
      // get x and y coordinates of mouse
      const { x, y } = remote.screen.getCursorScreenPoint()
      xPos.push(x)
      yPos.push(y)
      isClicked.push(clicked.current)
    }, Math.round(1000 / frameRate))
    // automatically stop recording after max recording length
    const stopCapture = setTimeout(() => onStopGifit(), MAX_LENGTH)
    // register escape key as a way to stop recording
    remote.globalShortcut.register('Esc', () => onStopGifit())
    // create tray icon that can also be used to stop recording
    const tray = new remote.Tray(RECORDING_ICON)
    tray.on('click', () => onStopGifit())
    // called to stop recording
    async function onStopGifit() {
      // clean up
      clearInterval(captureFrame)
      clearTimeout(stopCapture)
      tray.destroy()
      remote.globalShortcut.unregister('Esc')
      stream.getTracks().forEach(track => track.stop())
      // create directory for project
      const folder = createFolderName()
      const folderPath = path.join(RECORDINGS_DIRECTORY, folder)
      await mkdirAsync(folderPath)
      const data = []
      // create data object for each frame
      // save each frame as a png file
      for (const [i, frame] of frames.entries()) {
        const filepath = path.join(folderPath, `${i}.png`)
        data.push({
          path: filepath,
          time: times[i],
          cursorX: xPos[i],
          cursorY: yPos[i],
          clicked: isClicked[i]
        })
        const base64Data = frame.replace(IMAGE_REGEX, '')
        await writeFileAsync(filepath, base64Data, {
          encoding: 'base64'
        })
      }
      // create project.json file with all relevant data
      const project = {
        relative: folder,
        date: new Date().getTime(),
        width: cropped ? width : w,
        height: cropped ? height : h,
        frameRate,
        frames: data
      }
      await writeFileAsync(path.join(folderPath, 'project.json'), JSON.stringify(project))
      // send message to main process and close window
      remote.BrowserWindow.fromId(1).webContents.send(GIFIT_STOP, folder)
      remote.getCurrentWindow().close()
    }
  }
  // exit out without recording
  function onCloseClick() {
    remote.BrowserWindow.fromId(1).webContents.send(GIFIT_CLOSE, null)
    remote.getCurrentWindow().close()
  }
  // start selection drawing
  function onMouseDown(e) {
    if (!done && mode === 1) {
      setDrawing(true)
      setStartX(e.pageX)
      setStartY(e.pageY)
      setTop(e.pageX)
      setLeft(e.pageY)
    }
  }
  // end selection drawing
  function onMouseUp(e) {
    if (mode === 1 && drawing) {
      setDone(true)
      setDrawing(false)
    }
  }
  // selection drawing
  function onMouseMove(e) {
    if (!done && drawing) {
      setTop(e.pageY - startY < 0 ? e.pageY : startY)
      setLeft(e.pageX - startX < 0 ? e.pageX : startX)
      setWidth(Math.abs(e.pageX - startX))
      setHeight(Math.abs(e.pageY - startY))
    }
  }
  // reset state
  function onRedoClick() {
    setDone(false)
    setDrawing(false)
    setStartX(null)
    setStartY(null)
    setTop(null)
    setLeft(null)
    setWidth(0)
    setHeight(0)
  }
  // cancel selection
  function onCancelClick() {
    onRedoClick()
    setMode(0)
  }

  return (
    <Container
      transparent={[1, 3].includes(mode)}
      crosshair={mode === 1 && !done}
      noCursor={mode === 3 && !showCursor}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <Toolbar show={mode === 0}>
        <Option onClick={() => onRecordStart(false)}>
          <CropFree />
        </Option>
        <Option onClick={() => setMode(1)}>
          <Crop />
        </Option>
        <Option onClick={onCloseClick}>
          <Close />
        </Option>
      </Toolbar>
      <Rectangle show={mode === 1} top={top} left={left} width={width} height={height} />
      <Confirm show={mode === 1 && done} top={top + height + 5} left={left + width / 2 - 50}>
        <Option onClick={() => onRecordStart(true)}>
          <Check />
        </Option>
        <Option onClick={onRedoClick}>
          <Crop />
        </Option>
        <Option onClick={onCancelClick}>
          <Close />
        </Option>
      </Confirm>
      <Countdown show={mode === 2 && useCountdown}>Start recording in {time} seconds...</Countdown>
    </Container>
  )
}
