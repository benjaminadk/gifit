import React, { useEffect, useState, useRef, useContext } from 'react'
import { remote } from 'electron'
import { Shrink } from 'styled-icons/icomoon/Shrink'
import { MediaRecord } from 'styled-icons/typicons/MediaRecord'
import { Stop } from 'styled-icons/material/Stop'
import path from 'path'
import { writeFile, mkdir } from 'fs'
import { promisify } from 'util'
import createFolderName from '../../lib/createFolderName'
import { Container, Video, Controls, Action } from './styles'
import { AppContext } from '../App'
import initializeScale from '../Scale/initializeScale'
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

  const [scale, setScale] = useState(0.5)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [recording, setRecording] = useState(false)

  const videoStream = useRef(null)
  const video = useRef(null)
  const stop = useRef(null)

  useEffect(() => {
    async function initialize() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: {
            exact: videoInput.deviceId
          }
        }
      })
      videoStream.current = stream
      video.current.srcObject = stream
      video.current.onloadedmetadata = () => {
        const w = Math.floor(video.current.videoWidth * scale)
        const h = Math.floor(video.current.videoHeight * scale)
        setWidth(w)
        setHeight(h)
        remote.getCurrentWindow().show()
        remote.getCurrentWindow().setSize(w, h + 100)
        remote.getCurrentWindow().center()
      }
    }

    initialize()
  }, [])

  useEffect(() => {
    const w = Math.floor(video.current.videoWidth * scale)
    const h = Math.floor(video.current.videoHeight * scale)
    setWidth(w)
    setHeight(h)
    remote.getCurrentWindow().setSize(w, h + 100)
  }, [scale])

  function onShowScale() {
    initializeScale(scale, setScale)
  }

  async function onRecordClick() {
    if (recording) {
      return
    }

    setRecording(true)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    ctx.scale(scale, scale)
    const frames = []
    const times = []
    var t1 = performance.now()

    const captureFrame = setInterval(() => {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(video.current, 0, 0)
      const frame = canvas.toDataURL(IMAGE_TYPE)
      frames.push(frame)

      const t2 = performance.now()
      const diff = Math.round(t2 - t1)
      t1 = t2
      times.push(diff)
    }, Math.round(1000 / frameRate))

    stop.current.addEventListener('click', () => onStopClick())

    async function onStopClick() {
      setRecording(false)
      clearInterval(captureFrame)
      videoStream.current.getTracks().forEach(el => el.stop())

      const folder = createFolderName()
      const folderPath = path.join(RECORDINGS_DIRECTORY, folder)
      await mkdirAsync(folderPath)
      const data = []

      for (const [i, frame] of frames.entries()) {
        const filepath = path.join(folderPath, `${i}.png`)
        data.push({
          path: filepath,
          time: times[i]
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
  }

  function onCloseClick() {
    remote.BrowserWindow.fromId(1).webContents.send(WEBCAM_CLOSE, null)
    remote.getCurrentWindow().close()
  }

  return (
    <Container width={width} height={height + 50}>
      <Video ref={video} width={width} height={height} autoPlay={true} />
      <Controls>
        <div />
        <Shrink size={20} onClick={onShowScale} />
        <button onClick={onCloseClick}>x</button>
        <Action onClick={onRecordClick}>
          <MediaRecord color={recording ? 'red' : 'black'} />
          <div className='text'>Record</div>
        </Action>
        <Action ref={stop}>
          <Stop />
          <div className='text'>Stop</div>
        </Action>
      </Controls>
    </Container>
  )
}
