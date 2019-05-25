import React, { useEffect, useState, useRef, useContext } from 'react'
import { remote } from 'electron'
import { List } from 'immutable'
import path from 'path'
import { writeFile, mkdir } from 'fs'
import { promisify } from 'util'
import createFolderName from '../../lib/createFolderName'
import initializeScale from '../Scale/initializeScale'
import { AppContext } from '../App'
import Svg from '../Svg'
import FrameRate from '../Shared/FrameRate'
import { Container, Video, Controls, Action } from './styles'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  ipcActions: { WEBCAM_CLOSE, WEBCAM_STOP },
  constants: { IMAGE_TYPE, IMAGE_REGEX, MAX_LENGTH }
} = config

const mkdirAsync = promisify(mkdir)
const writeFileAsync = promisify(writeFile)

export default function Webcam() {
  const { state, dispatch } = useContext(AppContext)
  const { options, videoInputs } = state

  const videoInputIndex = options.get('videoInputIndex')
  const frameRate = options.get('frameRate')

  const videoInput = videoInputs[videoInputIndex]

  const [mode, setMode] = useState(0)
  const [scale, setScale] = useState(0.5)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [count, setCount] = useState(0)
  const [frames, setFrames] = useState(List([]))
  const [times, setTimes] = useState(List([]))

  const video = useRef(null)
  const canvas = useRef(null)
  const ctx = useRef(null)
  const t1 = useRef(null)
  const captureInterval = useRef(null)

  useEffect(() => {
    async function initialize() {
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: {
            exact: videoInput.deviceId
          }
        }
      })

      video.current.srcObject = webcamStream
      video.current.onloadedmetadata = () => {
        const w = Math.ceil(video.current.videoWidth * scale)
        const h = Math.ceil(video.current.videoHeight * scale)
        video.current.width = w
        video.current.height = h
        setWidth(w)
        setHeight(h)
        remote.getCurrentWindow().show()
        remote.getCurrentWindow().setSize(w + 16, h + 40)
        remote.getCurrentWindow().center()
      }
    }

    initialize()

    return () => {
      webcamStream.current.getTracks().forEach(el => el.stop())
    }
  }, [])

  useEffect(() => {
    const w = Math.ceil(video.current.videoWidth * scale)
    const h = Math.ceil(video.current.videoHeight * scale)
    video.current.width = w
    video.current.height = h
    setWidth(w)
    setHeight(h)
    remote.getCurrentWindow().setSize(w + 16, h + 40)
  }, [scale])

  function onShowScale() {
    initializeScale(scale, setScale)
  }

  async function onRecordStart() {
    if (mode === 1) {
      return
    }

    setMode(1)

    canvas.current = document.createElement('canvas')
    ctx.current = canvas.current.getContext('2d')
    canvas.current.width = width
    canvas.current.height = height
    ctx.current.scale(scale, scale)
    t1.current = performance.now()

    captureInterval.current = setInterval(() => onCaptureFrame(), Math.round(1000 / frameRate))
  }

  function onCaptureFrame() {
    setCount(cur => cur + 1)

    ctx.current.clearRect(0, 0, width, height)
    ctx.current.drawImage(video.current, 0, 0)
    const frame = canvas.current.toDataURL(IMAGE_TYPE)
    setFrames(cur => cur.push(frame))

    const t2 = performance.now()
    const diff = Math.round(t2 - t1.current)
    t1.current = t2
    setTimes(cur => cur.push(diff))
  }

  async function onRecordStop() {
    if (mode === 0) {
      return
    }

    clearInterval(captureInterval.current)

    const folder = createFolderName()
    const folderPath = path.join(RECORDINGS_DIRECTORY, folder)
    await mkdirAsync(folderPath)
    const data = []

    for (const [i, frame] of frames.toArray().entries()) {
      const filepath = path.join(folderPath, `${i}.png`)
      data.push({
        path: filepath,
        time: times.get(i)
      })
      const base64Data = frame.replace(IMAGE_REGEX, '')
      await writeFileAsync(filepath, base64Data, {
        encoding: 'base64'
      })
    }

    const project = {
      relative: folder,
      date: new Date().getTime(),
      width,
      height,
      frameRate,
      frames: data
    }
    await writeFileAsync(path.join(folderPath, 'project.json'), JSON.stringify(project))
    remote.BrowserWindow.fromId(1).webContents.send(WEBCAM_STOP, folder)
    remote.getCurrentWindow().close()
  }

  function onCloseClick() {
    remote.BrowserWindow.fromId(1).webContents.send(WEBCAM_CLOSE, null)
    remote.getCurrentWindow().close()
  }

  return (
    <Container width={width} height={height}>
      <Video ref={video} autoPlay={true} />
      <Controls width={width}>
        <div className='count'>{mode !== 0 ? count : ''}</div>
        <div className='action' onClick={onShowScale}>
          <Svg name='scale' />
        </div>
        <div className='action'>
          <Svg name='refresh' />
        </div>
        <FrameRate />
        <Action onClick={onRecordStart}>
          <div className='icon'>
            <Svg name='record' />
          </div>
          <div className='text'>Record</div>
        </Action>
        <Action onClick={onRecordStop}>
          <div className='icon'>
            <Svg name='stop' />
          </div>
          <div className='text'>Stop</div>
        </Action>
      </Controls>
    </Container>
  )
}
