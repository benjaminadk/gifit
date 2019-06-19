import React, { useState, useContext, useRef, useEffect } from 'react'
import { remote, ipcRenderer } from 'electron'
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
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  ipcActions: { RECORDER_CLOSE, RECORDER_STOP },
  constants: { VIDEO_CSS, IMAGE_TYPE, IMAGE_REGEX, MAX_LENGTH },
  recorder: { zoomSize, controlsWidth, controlsHeight }
} = config

const mkdirAsync = promisify(mkdir)
const writeFileAsync = promisify(writeFile)

const recordingIcon = path.join(
  __static,
  process.platform === 'win32' ? 'video-recording.ico' : 'video-recording.icns'
)
const pausedIcon = path.join(
  __static,
  process.platform === 'win32' ? 'video-paused.ico' : 'video-paused.icns'
)

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
  const [time, setTime] = useState(countdownTime)
  const [timeLimit, setTimeLimit] = useState(MAX_LENGTH)

  const [frames, setFrames] = useState(List([]))
  const [times, setTimes] = useState(List([]))
  // const [xCursors, setXCursors] = useState(List([]))
  // const [yCursors, setYCursors] = useState(List([]))
  const [cursors, setCursors] = useState(List([]))
  const [keys, setKeys] = useState(List([]))

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

  const canvas1 = useRef(null)
  const ctx1 = useRef(null)
  const canvas2 = useRef(null)
  const ctx2 = useRef(null)
  const video = useRef(null)
  const captureInterval = useRef(null)
  const timeout = useRef(null)
  const tray = useRef(null)
  const t1 = useRef(null)
  const mouse = useRef(null)
  const keyboard = useRef(null)

  const zoomCanvas1 = useRef(null)
  const zoomCanvas2 = useRef(null)
  const zoomCanvas3 = useRef(null)
  const zoomCanvas4 = useRef(null)
  const zoomCtx1 = useRef(null)
  const zoomCtx2 = useRef(null)
  const zoomCtx3 = useRef(null)

  useEffect(() => {
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

    captureStream()

    return () => {
      stream && stream.getTracks().forEach(el => el.stop())
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

  useEffect(() => {
    if ([4, 5].includes(mode)) {
      ipcRenderer.send('record', { isRecording: true, id: remote.getCurrentWindow().id })
      ipcRenderer.on('mouse-watch', (e, data) => {
        mouse.current = data
      })
      ipcRenderer.on('key-watch', (e, data) => {
        keyboard.current = data
      })
    } else if (mode === 6) {
      ipcRenderer.send('record', { isRecording: false, id: null })
      ipcRenderer.removeAllListeners('mouse-watch')
      ipcRenderer.removeAllListeners('key-watch')
    }

    return () => {
      ipcRenderer.send('record', { isRecording: false, id: null })
      ipcRenderer.removeAllListeners('mouse-watch')
      ipcRenderer.removeAllListeners('key-watch')
    }
  }, [mode])

  useEffect(() => {
    if (tray.current) {
      tray.current.removeAllListeners('click')
      tray.current.on('click', onRecordStop)
    }
    remote.globalShortcut.unregisterAll('Esc')
    return () => {
      remote.globalShortcut.unregisterAll('Esc')
    }
  }, [onRecordStop])

  useEffect(() => {
    if (timeLimit === 0) {
      onRecordStop()
    }
  }, [timeLimit])

  // initialize desktop stream
  async function captureStream() {
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
    zoomCanvas1.current = document.createElement('canvas')
    zoomCanvas2.current = document.createElement('canvas')
    zoomCtx1.current = zoomCanvas1.current.getContext('2d')
    zoomCtx2.current = zoomCanvas2.current.getContext('2d')
    zoomCanvas1.current.width = screenWidth
    zoomCanvas1.current.height = screenHeight
    const zoomVideo = document.createElement('video')
    zoomVideo.style.cssText = VIDEO_CSS
    // triggers zoom overlay config
    zoomVideo.onloadedmetadata = async () => {
      zoomVideo.play()
      // pause .5s before taking snapshot
      await new Promise(resolve => {
        setTimeout(() => resolve(), 500)
      })
      // draw desktop to full screen canvas
      zoomCtx1.current.drawImage(zoomVideo, 0, 0, screenWidth, screenHeight)
      zoomVideo.remove()
    }

    zoomVideo.srcObject = desktopStream
    document.body.appendChild(zoomVideo)
    setStream(desktopStream)
  }

  // start recording frames
  async function onRecordStart() {
    if (mode !== 2) {
      return
    }

    setMode(3)

    // if useCountdown is true display it then record
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
    // wait an additional .5s to not capture blank frames
    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 500)
    })

    tray.current = new remote.Tray(recordingIcon)
    remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true })

    // create full screen canvas
    canvas1.current = document.createElement('canvas')
    ctx1.current = canvas1.current.getContext('2d')
    canvas1.current.width = screenWidth
    canvas1.current.height = screenHeight
    // create second canvas for cropped selections
    canvas2.current = document.createElement('canvas')
    ctx2.current = canvas2.current.getContext('2d')
    canvas2.current.width = selectWidth
    canvas2.current.height = selectHeight
    // create video element to play stream
    video.current = document.createElement('video')
    video.current.style.cssText = VIDEO_CSS
    video.current.srcObject = stream
    document.body.appendChild(video.current)
    video.current.onloadedmetadata = e => video.current.play()
    // set time and start
    t1.current = performance.now()
    // run captureFrame at desired frame rate per second
    captureInterval.current = setInterval(() => onCaptureFrame(), Math.round(1000 / frameRate))
    // impose a time limit on recording
    timeout.current = setInterval(() => {
      setTimeLimit(cur => cur - 1000)
    }, 1000)
  }

  // function to capture a single frame
  // setter use function version since fresh values are needed inside of setInterval
  function onCaptureFrame() {
    // calculate time elapsed since last frame and update time
    const t2 = performance.now()
    setTimes(cur => cur.push(Math.round(t2 - t1.current)))
    t1.current = t2
    // get cursor and keyboard input
    setCursors(cur => cur.push(mouse.current))
    setKeys(cur => cur.push(keyboard.current))
    var frame
    // draw full screen image
    ctx1.current.drawImage(video.current, 0, 0, screenWidth, screenHeight)
    // if captureType==='crop' redraw selection on second canvas
    if (captureType === 'crop') {
      ctx2.current.drawImage(
        canvas1.current,
        selectX,
        selectY,
        selectWidth,
        selectHeight,
        0,
        0,
        selectWidth,
        selectHeight
      )
      // get dataURL from canvas
      frame = canvas2.current.toDataURL(IMAGE_TYPE)
    } else {
      frame = canvas1.current.toDataURL(IMAGE_TYPE)
    }
    // add frame to frames state
    setFrames(cur => cur.push(frame))
  }

  function onProcessKeyboard(e) {
    const obj = { code: e.keycode, raw: e.rawcode }
    const arr = []
    arr.push(e.ctrlKey ? 1 : 0)
    arr.push(e.altKey ? 1 : 0)
    arr.push(e.shiftKey ? 1 : 0)
    arr.push(e.metaKey ? 1 : 0)
    obj.mod = arr
    return obj
  }

  // stop recording and process frames into project
  async function onRecordStop() {
    // if not recording return
    if ([1, 2, 3].includes(mode)) {
      return
    }

    // clean up
    ipcRenderer.send('record', { isRecording: false, id: null })
    clearInterval(captureInterval.current)
    clearInterval(timeout.current)
    tray.current && tray.current.destroy()
    remote.globalShortcut.unregisterAll('Esc')

    await new Promise(resolve => {
      setTimeout(resolve, 500)
    })

    // create a new directory for project
    const folder = createFolderName()
    const folderPath = path.join(RECORDINGS_DIRECTORY, folder)
    await mkdirAsync(folderPath)
    const clipboardPath = path.join(folderPath, 'Clipboard')
    await mkdirAsync(clipboardPath)
    const data = []
    // loop over frames and create data and image file
    for (const [i, frame] of frames.toArray().entries()) {
      const filepath = path.join(folderPath, `${i}.png`)
      data.push({
        path: filepath,
        time: times.get(i),
        cursorX: cursors.get(i) ? cursors.get(i)['x'] : false,
        cursorY: cursors.get(i) ? cursors.get(i)['y'] : false,
        clicked: cursors.get(i) ? true : false,
        keys: keys.get(i) ? onProcessKeyboard(keys.get(i)) : false
      })
      const base64Data = frame.replace(IMAGE_REGEX, '')
      await writeFileAsync(filepath, base64Data, {
        encoding: 'base64'
      })
    }
    // create a project object and save as json file
    const project = {
      relative: folder,
      date: new Date().getTime(),
      width: captureType === 'crop' ? selectWidth : screenWidth,
      height: captureType === 'crop' ? selectHeight : screenHeight,
      frames: data
    }
    await writeFileAsync(path.join(folderPath, 'project.json'), JSON.stringify(project))
    // close recorder and set folder to state so editor can open it
    remote.BrowserWindow.fromId(1).webContents.send(RECORDER_STOP, folder)
    remote.getCurrentWindow().close()
  }

  // pause recorder
  function onRecordPause() {
    setMode(6)
    clearInterval(captureInterval.current)
    clearInterval(timeout.current)
    tray.current.setImage(pausedIcon)
  }

  // resume recording from being paused
  function onRecordResume() {
    setMode(captureType === 'crop' ? 4 : 5)
    t1.current = performance.now()
    captureInterval.current = setInterval(() => onCaptureFrame(), Math.round(1000 / frameRate))
    tray.current.setImage(recordingIcon)
    timeout.current = setInterval(() => {
      setTimeLimit(cur => cur - 1000)
    }, 1000)
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
    captureStream()
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

  function onControlsEnter() {
    if ([4, 5, 6].includes(mode)) {
      remote.getCurrentWindow().setIgnoreMouseEvents(false)
    }
  }

  function onControlsLeave() {
    if ([4, 5, 6].includes(mode)) {
      remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true })
    }
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
        count={frames.size}
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
        onControlsEnter={onControlsEnter}
        onControlsLeave={onControlsLeave}
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
