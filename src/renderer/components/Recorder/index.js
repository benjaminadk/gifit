import React, { useState, useContext, useRef, useEffect } from 'react'
import { remote } from 'electron'
import { List } from 'immutable'
import path from 'path'
import { writeFile, mkdir } from 'fs'
import { promisify } from 'util'
import createFolderName from '../../lib/createFolderName'
import { AppContext } from '../App'
import Controls from './Controls'
import SelectOverlay from './SelectOverlay'
import Svg from '../Svg'
import { Container, Confirm, Option, Outline, ZoomOverlay } from './styles'
import { RECORDINGS_DIRECTORY, RECORDING_ICON, PAUSED_ICON } from 'common/filepaths'
import config from 'common/config'

const {
  ipcActions: { RECORDER_CLOSE, RECORDER_STOP },
  constants: { VIDEO_CSS, IMAGE_TYPE, IMAGE_REGEX, MAX_LENGTH },
  recorder: { zoomSize, controlsWidth, controlsHeight }
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

  // modes 0=initial 1=selection 2=confirmation 3=countdown 4=record crop 5=record full 6=paused
  const [mode, setMode] = useState(0)
  const [stream, setStream] = useState(null)
  const [captureType, setCaptureType] = useState('screen')
  const [count, setCount] = useState(0)

  const [frames, setFrames] = useState(List([]))
  const [times, setTimes] = useState(List([]))
  const [xCursors, setXCursors] = useState(List([]))
  const [yCursors, setYCursors] = useState(List([]))
  const canvas1ID = useRef(null)
  const ctx1ID = useRef(null)
  const canvas2ID = useRef(null)
  const ctx2ID = useRef(null)
  const videoID = useRef(null)
  const captureID = useRef(null)
  const limitID = useRef(null)
  const trayID = useRef(null)
  const t1 = useRef(null)

  const [controlsX, setControlsX] = useState(screenWidth / 2)
  const [controlsY, setControlsY] = useState(screenHeight / 2)

  const [done, setDone] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [selectWidth, setSelectWidth] = useState(0)
  const [selectHeight, setSelectHeight] = useState(0)
  const [selectX, setSelectX] = useState(0)
  const [selectY, setSelectY] = useState(0)

  const [zoomX, setZoomX] = useState(0)
  const [zoomY, setZoomY] = useState(0)

  const [time, setTime] = useState(countdownTime)

  const zoomCanvas1 = useRef(null)
  const zoomCanvas2 = useRef(null)
  const zoomCanvas3 = useRef(null)
  const zoomCanvas4 = useRef(null)
  const zoomCtx1 = useRef(null)
  const zoomCtx2 = useRef(null)
  const zoomCtx3 = useRef(null)

  useEffect(() => {
    async function initialize() {
      // capture desktop stream
      const desktopStream = await navigator.mediaDevices.getUserMedia({
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
      // create helper elements
      const canvas1 = document.createElement('canvas')
      const canvas2 = document.createElement('canvas')
      const ctx1 = canvas1.getContext('2d')
      const ctx2 = canvas2.getContext('2d')
      canvas1.width = screenWidth
      canvas1.height = screenHeight
      const video = document.createElement('video')
      video.style.cssText = VIDEO_CSS
      // triggers zoom overlay config
      video.onloadedmetadata = async () => {
        video.play()
        // pause .5s before taking snapshot
        await new Promise(resolve => {
          setTimeout(() => resolve(), 500)
        })
        // draw desktop to full screen canvas
        ctx1.drawImage(video, 0, 0, screenWidth, screenHeight)
        zoomCanvas1.current = canvas1
        zoomCtx1.current = ctx1
        // intermediate canvas to help with zoom effect
        zoomCanvas2.current = canvas2
        zoomCtx2.current = ctx2
        // actual zoom overlay magnified 10x
        zoomCtx3.current = zoomCanvas3.current.getContext('2d')
        zoomCtx3.current.scale(10, 10)
        zoomCtx3.current.imageSmoothingEnabled = false
        // draw green crosshair on zoom canvas
        const zoomCtx4 = zoomCanvas4.current.getContext('2d')
        zoomCtx4.strokeStyle = '#00FF0080'
        zoomCtx4.beginPath()
        zoomCtx4.moveTo(zoomSize / 2, 0)
        zoomCtx4.lineTo(zoomSize / 2, zoomSize)
        zoomCtx4.moveTo(0, zoomSize / 2)
        zoomCtx4.lineTo(zoomSize, zoomSize / 2)
        zoomCtx4.stroke()
        video.remove()
      }

      video.srcObject = desktopStream
      document.body.appendChild(video)
      setStream(desktopStream)
    }
    initialize()

    return () => {
      desktopStream.getTracks().forEach(el => el.stop())
    }
  }, [])
  // when cursor position changes redraw zoom overlay
  useEffect(() => {
    if (mode === 1 && zoomCanvas3.current) {
      const x = zoomX - zoomSize / 20
      const y = zoomY - zoomSize / 20
      const imageData = zoomCtx1.current.getImageData(x, y, zoomSize / 10, zoomSize / 10)
      zoomCtx2.current.putImageData(imageData, 0, 0)
      zoomCtx3.current.drawImage(zoomCanvas2.current, 0, 0)
    }
  }, [mode, zoomX, zoomY])

  async function onRecordStart() {
    if (mode !== 2) {
      return
    }

    setMode(3)

    await new Promise(resolve => {
      if (useCountdown) {
        const countdown = setInterval(() => {
          setTime(x => x - 1)
        }, 1000)
        setTimeout(() => {
          clearInterval(countdown)
          setMode(captureType === 'crop' ? 4 : 5)
          resolve()
        }, countdownTime * 1000)
      } else {
        setMode(captureType === 'crop' ? 4 : 5)
        resolve()
      }
    })

    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 500)
    })

    const canvas1 = document.createElement('canvas')
    const ctx1 = canvas1.getContext('2d')
    canvas1.width = screenWidth
    canvas1.height = screenHeight
    canvas1ID.current = canvas1
    ctx1ID.current = ctx1

    const canvas2 = document.createElement('canvas')
    const ctx2 = canvas2.getContext('2d')
    canvas2.width = selectWidth
    canvas2.height = selectHeight
    canvas2ID.current = canvas2
    ctx2ID.current = ctx2

    const video = document.createElement('video')
    video.style.cssText = VIDEO_CSS
    video.srcObject = stream
    document.body.appendChild(video)
    video.onloadedmetadata = e => video.play()
    videoID.current = video

    t1.current = performance.now()

    captureID.current = setInterval(() => onCaptureFrame(), Math.round(1000 / frameRate))

    var tray = new remote.Tray(RECORDING_ICON)
    tray.on('click', () => onRecordStop())
    trayID.current = tray

    remote.globalShortcut.register('Esc', () => onRecordStop())
  }

  function onCaptureFrame() {
    setCount(cur => cur + 1)
    var frame
    // draw full screen image
    ctx1ID.current.clearRect(0, 0, screenWidth, screenHeight)
    ctx1ID.current.drawImage(videoID.current, 0, 0, screenWidth, screenHeight)
    // if captureType==='crop' redraw selection on second canvas
    if (captureType === 'crop') {
      ctx2ID.current.clearRect(0, 0, selectWidth, selectHeight)
      ctx2ID.current.drawImage(
        canvas1ID.current,
        selectX,
        selectY,
        selectWidth,
        selectHeight,
        0,
        0,
        selectWidth,
        selectHeight
      )
      frame = canvas2ID.current.toDataURL(IMAGE_TYPE)
    } else {
      frame = canvas1ID.current.toDataURL(IMAGE_TYPE)
    }
    setFrames(cur => cur.push(frame))

    const t2 = performance.now()
    const diff = Math.round(t2 - t1.current)
    t1.current = t2
    setTimes(cur => cur.push(diff))

    const { x, y } = remote.screen.getCursorScreenPoint()
    setXCursors(cur => cur.push(x))
    setYCursors(cur => cur.push(y))
  }

  async function onRecordStop() {
    if (![4, 5].includes(mode)) {
      return
    }

    clearInterval(captureID.current)
    trayID.current.destroy()

    const folder = createFolderName()
    const folderPath = path.join(RECORDINGS_DIRECTORY, folder)
    await mkdirAsync(folderPath)
    const data = []

    for (const [i, frame] of frames.toArray().entries()) {
      const filepath = path.join(folderPath, `${i}.png`)
      data.push({
        path: filepath,
        time: times.get(i),
        cursorX: xCursors.get(i),
        cursorY: yCursors.get(i)
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
      width: captureType === 'crop' ? selectWidth : screenWidth,
      height: captureType === 'crop' ? selectHeight : screenHeight,
      frameRate,
      frames: data
    }
    await writeFileAsync(path.join(folderPath, 'project.json'), JSON.stringify(project))
    // send message to main process and close window
    remote.BrowserWindow.fromId(1).webContents.send(RECORDER_STOP, folder)
    remote.getCurrentWindow().close()
  }

  function onRecordPause() {
    setMode(6)
    clearInterval(captureID.current)
    trayID.current.setImage(PAUSED_ICON)
  }

  function onRecordResume() {
    setMode(captureType === 'crop' ? 4 : 5)
    t1.current = performance.now()
    captureID.current = setInterval(() => onCaptureFrame(), Math.round(1000 / frameRate))
    trayID.current.setImage(RECORDING_ICON)
  }

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
    if ([0, 1].includes(mode)) {
      setZoomX(e.pageX)
      setZoomY(e.pageY)
    }

    if (!done && drawing) {
      setSelectY(e.pageY - selectY < 0 ? e.pageY : selectY)
      setSelectX(e.pageX - selectX < 0 ? e.pageX : selectX)
      setSelectWidth(Math.abs(e.pageX - selectX))
      setSelectHeight(Math.abs(e.pageY - selectY))
    }
  }
  // accpet selection
  function onAcceptClick() {
    setControlsX(selectX + selectWidth / 2 - controlsWidth / 2)
    setControlsY(selectY + selectHeight + 10)
    setMode(2)
  }
  // reset selection state
  function onRetryClick() {
    setDone(false)
    setDrawing(false)
    setSelectWidth(0)
    setSelectHeight(0)
    setSelectX(0)
    setSelectY(0)
  }
  // cancel selection mode
  function onCancelClick() {
    onRetryClick()
    setMode(0)
  }

  return (
    <Container
      crosshair={mode === 1 && !done}
      noCursor={mode === 4 && !showCursor}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <Controls
        mode={mode}
        time={time}
        count={count}
        captureType={captureType}
        controlsX={controlsX}
        controlsY={controlsY}
        setCaptureType={setCaptureType}
        setControlsX={setControlsX}
        setControlsY={setControlsY}
        setMode={setMode}
        onRecordStart={onRecordStart}
        onRecordStop={onRecordStop}
        onRecordPause={onRecordPause}
        onRecordResume={onRecordResume}
        onCloseClick={onCloseClick}
      />
      <ZoomOverlay
        show={mode === 1 && !drawing && !done}
        top={zoomY < zoomSize + 40 ? zoomY + 40 : zoomY - zoomSize - 40}
        left={zoomX > screenWidth - zoomSize - 40 ? zoomX - zoomSize - 40 : zoomX + 40}
      >
        <div className='wrapper'>
          <canvas ref={zoomCanvas3} className='canvas1' width={zoomSize} height={zoomSize} />
          <canvas ref={zoomCanvas4} className='canvas2' width={zoomSize} height={zoomSize} />
        </div>
        <div className='text'>
          X: {zoomX} {'\u25c7'} Y: {zoomY}
        </div>
      </ZoomOverlay>
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
        left={selectWidth / 2 + selectX - 112.5}
      >
        <Option onClick={onCancelClick}>
          <Svg name='cancel' />
          <div className='text'>Cancel</div>
        </Option>
        <Option onClick={onRetryClick}>
          <Svg name='refresh' />
          <div className='text'>Retry</div>
        </Option>
        <Option onClick={onAcceptClick}>
          <Svg name='check' />
          <div className='text'>Accept</div>
        </Option>
      </Confirm>
      <Outline
        show={[2, 3].includes(mode)}
        top={captureType === 'screen' ? 2 : selectY}
        left={captureType === 'screen' ? 2 : selectX}
        width={captureType === 'screen' ? screenWidth - 4 : selectWidth}
        height={captureType === 'screen' ? screenHeight - 34 : selectHeight}
      />
    </Container>
  )
}
