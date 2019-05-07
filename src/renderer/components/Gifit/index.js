import React, { useState, useContext } from 'react'
import { remote } from 'electron'
import jimp from 'jimp'
import { CropFree } from 'styled-icons/material/CropFree'
import { Crop } from 'styled-icons/material/Crop'
import { Close } from 'styled-icons/material/Close'
import { Check } from 'styled-icons/material/Check'
import path from 'path'
import { writeFile, mkdir } from 'fs'
import { promisify } from 'util'
import createFolderName from '../../lib/createFolderName'
import { AppContext } from '../App'
import { Container, Toolbar, Option, Rectangle, Confirm } from './styles'
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

  async function onRecordStart(cropped) {
    setMode(2)

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

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = w
    canvas.height = h

    const video = document.createElement('video')
    video.style.cssText = VIDEO_CSS
    video.srcObject = stream
    document.body.appendChild(video)
    video.onloadedmetadata = e => video.play()

    const frames = []
    const times = []
    var t1 = performance.now()
    const captureFrame = setInterval(() => {
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(video, 0, 0, w, h)
      const t2 = performance.now()
      const diff = Math.round(t2 - t1)
      t1 = t2
      times.push(diff)
      const frame = canvas.toDataURL(IMAGE_TYPE)
      frames.push(frame)
    }, Math.round(1000 / frameRate))

    const stopCapture = setTimeout(() => onStopGifit(), MAX_LENGTH)

    remote.globalShortcut.register('Esc', () => onStopGifit())

    const tray = new remote.Tray(RECORDING_ICON)
    tray.on('click', () => onStopGifit())

    async function onStopGifit() {
      clearInterval(captureFrame)
      clearTimeout(stopCapture)
      tray.destroy()
      remote.globalShortcut.unregister('Esc ')
      stream.getTracks().forEach(track => track.stop())

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
        if (cropped) {
          const imageData = frame.replace(IMAGE_REGEX, '')
          const buffer = Buffer.from(imageData, 'base64')
          const image = await jimp.read(buffer)
          const imageCropped = await image.crop(left, top, width, height)
          const croppedData = await imageCropped.getBase64Async(IMAGE_TYPE)
          const base64Data = croppedData.replace(IMAGE_REGEX, '')
          await writeFileAsync(filepath, base64Data, {
            encoding: 'base64'
          })
        } else {
          const base64Data = frame.replace(IMAGE_REGEX, '')
          await writeFileAsync(filepath, base64Data, {
            encoding: 'base64'
          })
        }
      }

      const project = {
        relative: folder,
        width: cropped ? width : w,
        height: cropped ? height : h,
        frameRate,
        frames: data
      }
      await writeFileAsync(
        path.join(folderPath, 'project.json'),
        JSON.stringify(project)
      )

      remote.BrowserWindow.fromId(1).webContents.send(GIFIT_STOP, folder)
      remote.getCurrentWindow().close()
    }
  }

  function onCloseClick() {
    remote.BrowserWindow.fromId(1).webContents.send(GIFIT_CLOSE, null)
    remote.getCurrentWindow().close()
  }

  function onMouseDown(e) {
    if (!done && mode === 1) {
      setDrawing(true)
      setStartX(e.pageX)
      setStartY(e.pageY)
      setTop(e.pageX)
      setLeft(e.pageY)
    }
  }

  function onMouseMove(e) {
    if (!done && drawing) {
      setTop(e.pageY - startY < 0 ? e.pageY : startY)
      setLeft(e.pageX - startX < 0 ? e.pageX : startX)
      setWidth(Math.abs(e.pageX - startX))
      setHeight(Math.abs(e.pageY - startY))
    }
  }

  function onMouseUp(e) {
    if (mode === 1 && drawing) {
      setDone(true)
      setDrawing(false)
    }
  }

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

  function onCancelClick() {
    onRedoClick()
    setMode(0)
  }

  return (
    <Container
      transparent={mode !== 0}
      crosshair={mode === 1 && !done}
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
      <Rectangle
        show={mode === 1}
        top={top}
        left={left}
        width={width}
        height={height}
      />
      <Confirm
        show={mode === 1 && done}
        top={top + height + 5}
        left={left + width / 2 - 50}
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
    </Container>
  )
}
