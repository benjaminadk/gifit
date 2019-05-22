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
import SelectOverlay from './SelectOverlay'
import { Container, Toolbar, Option, Rectangle, Confirm, Countdown } from './styles'
import { RECORDINGS_DIRECTORY, RECORDING_ICON } from 'common/filepaths'
import config from 'common/config'

const {
  ipcActions: { RECORDER_CLOSE, RECORDER_STOP },
  constants: { VIDEO_CSS, IMAGE_TYPE, IMAGE_REGEX, MAX_LENGTH }
} = config

const mkdirAsync = promisify(mkdir)
const writeFileAsync = promisify(writeFile)

export default function Recorder() {
  const { state, dispatch } = useContext(AppContext)
  const { options, sources } = state

  const showCursor = options.get('showCursor')
  const useCountdown = options.get('useCountdown')
  const countdownTime = options.get('countdownTime')
  const frameRate = options.get('frameRate')
  const sourceIndex = options.get('sourceIndex')

  const source = sources[sourceIndex]
  const { width: screenWidth, height: screenHeight } = source.display.bounds

  const [mode, setMode] = useState(0)
  const [done, setDone] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [selectWidth, setSelectWidth] = useState(0)
  const [selectHeight, setSelectHeight] = useState(0)
  const [selectX, setSelectX] = useState(0)
  const [selectY, setSelectY] = useState(0)
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

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: screenWidth,
          maxWidth: screenWidth,
          minHeight: screenHeight,
          maxHeight: screenHeight
        }
      }
    })
    // create full screen size canvas
    const canvas1 = document.createElement('canvas')
    const ctx1 = canvas1.getContext('2d')
    canvas1.width = screenWidth
    canvas1.height = screenHeight
    // create selection size canvas
    const canvas2 = document.createElement('canvas')
    const ctx2 = canvas2.getContext('2d')
    canvas2.width = selectWidth
    canvas2.height = selectHeight
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
      ctx1.clearRect(0, 0, screenWidth, screenHeight)
      ctx1.drawImage(video, 0, 0, screenWidth, screenHeight)
      // if cropped redraw selection on second canvas
      if (cropped) {
        ctx2.clearRect(0, 0, selectWidth, selectHeight)
        ctx2.drawImage(
          canvas1,
          selectX,
          selectY,
          selectWidth,
          selectHeight,
          0,
          0,
          selectWidth,
          selectHeight
        )
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
      stream.getTracks().forEach(el => el.stop())
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
        width: cropped ? selectWidth : screenWidth,
        height: cropped ? selectHeight : screenHeight,
        frameRate,
        frames: data
      }
      await writeFileAsync(path.join(folderPath, 'project.json'), JSON.stringify(project))
      // send message to main process and close window
      remote.BrowserWindow.fromId(1).webContents.send(RECORDER_STOP, folder)
      remote.getCurrentWindow().close()
    }
  }
  // exit out without recording
  function onCloseClick() {
    remote.BrowserWindow.fromId(1).webContents.send(RECORDER_CLOSE, null)
    remote.getCurrentWindow().close()
  }
  // start selection drawing
  function onMouseDown(e) {
    if (!done && mode === 1) {
      setDrawing(true)
      setSelectX(e.pageX)
      setSelectY(e.pageY)
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
      setSelectY(e.pageY - selectY < 0 ? e.pageY : selectY)
      setSelectX(e.pageX - selectX < 0 ? e.pageX : selectX)
      setSelectWidth(Math.abs(e.pageX - selectX))
      setSelectHeight(Math.abs(e.pageY - selectY))
    }
  }
  // reset state
  function onRedoClick() {
    setDone(false)
    setDrawing(false)
    setSelectWidth(0)
    setSelectHeight(0)
    setSelectX(0)
    setSelectY(0)
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
      <SelectOverlay
        show={mode === 1}
        showHandles={mode === 1 && done}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        selectWidth={selectWidth}
        selectHeight={selectHeight}
        selectX={selectX}
        selectY={selectY}
        setSelectWidth={setSelectWidth}
        setSelectHeight={setSelectHeight}
        setSelectX={setSelectX}
        setSelectY={setSelectY}
      />
      <Confirm
        show={mode === 1 && done}
        top={selectHeight + selectY + 5}
        left={selectWidth + selectX / 2 - 50}
      >
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
