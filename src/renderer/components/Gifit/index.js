import React, { useState, useContext } from 'react'
import { remote } from 'electron'
import styled, { keyframes } from 'styled-components'
import { CropFree } from 'styled-icons/material/CropFree'
import { Crop } from 'styled-icons/material/Crop'
import { Close } from 'styled-icons/material/Close'
import path from 'path'
import { writeFile, mkdir } from 'fs'
import { promisify } from 'util'
import createFolderName from '../../lib/createFolderName'
import { AppContext } from '../App'
import { RECORDINGS_DIRECTORY, RECORDING_ICON } from 'common/filepaths'
import config from 'common/config'

const {
  ipcActions: { GIFIT_CLOSE, GIFIT_STOP },
  constants: { VIDEO_CSS, IMAGE_TYPE, IMAGE_REGEX, MAX_LENGTH }
} = config

const mkdirAsync = promisify(mkdir)
const writeFileAsync = promisify(writeFile)

const slideDown = keyframes`
  from {
    transform: translateY(-50px);
  }
  to {
    transform: translate(0px);
  }
`

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-items: center;
  align-items: flex-start;
  background: ${p => (p.transparent ? 'transparent' : 'rgba(0, 0, 0, 0.25)')};
`

export const Toolbar = styled.div`
  width: 150px;
  height: 50px;
  display: ${p => (p.show ? 'grid' : 'none')};
  grid-template-columns: repeat(3, 50px);
  transform: translateY(-50px);
  animation: ${slideDown} 1s linear 0.5s forwards;
`

export const Option = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  background: ${p => p.theme.grey[0]};
  color: ${p => p.theme.black};
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    background: ${p => p.theme.grey[4]};
  }
  svg {
    width: 20px;
    height: 20px;
  }
`

export default function Gifit() {
  const { state, dispatch } = useContext(AppContext)
  const { options, sources } = state
  const frameRate = options.get('frameRate')
  const sourceIndex = options.get('sourceIndex')
  const source = sources[sourceIndex]

  const [mode, setMode] = useState(0)

  async function onFullscreenClick() {
    setMode(1)

    const { width, height } = source.display.bounds
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height
        }
      }
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    const video = document.createElement('video')
    video.style.cssText = VIDEO_CSS
    video.srcObject = stream
    document.body.appendChild(video)
    video.onloadedmetadata = e => video.play()

    const frames = []
    const times = []
    var t1 = performance.now()
    const captureFrame = setInterval(() => {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(video, 0, 0, width, height)
      const t2 = performance.now()
      const diff = Math.round(t2 - t1)
      t1 = t2
      times.push(diff)
      const frame = canvas.toDataURL(IMAGE_TYPE)
      frames.push(frame)
    }, Math.round(1000 / frameRate))

    const stopCapture = setTimeout(onStopGifit, MAX_LENGTH)

    const tray = new remote.Tray(RECORDING_ICON)
    tray.on('click', () => {
      clearTimeout(stopCapture)
      onStopGifit()
    })

    async function onStopGifit() {
      clearInterval(captureFrame)
      stream.getTracks().forEach(track => track.stop())

      const folder = createFolderName()
      const folderPath = path.join(RECORDINGS_DIRECTORY, folder)
      await mkdirAsync(folderPath)
      const data = []

      for (const [i, frame] of frames.entries()) {
        const filepath = path.join(folderPath, `${i}.png`)
        data.push({ path: filepath, time: times[i] })
        const base64Data = frame.replace(IMAGE_REGEX, '')
        await writeFileAsync(filepath, base64Data, { encoding: 'base64' })
      }

      const project = {
        relative: folder,
        width,
        height,
        frameRate,
        frames: data
      }
      await writeFileAsync(
        path.join(folderPath, 'project.json'),
        JSON.stringify(project)
      )

      remote.BrowserWindow.fromId(1).webContents.send(GIFIT_STOP, folder)
      remote.getCurrentWindow().close()
      tray.destroy()
    }
  }

  function onCloseClick() {
    remote.BrowserWindow.fromId(1).webContents.send(GIFIT_CLOSE, null)
    remote.getCurrentWindow().close()
  }

  return (
    <Container transparent={mode !== 0}>
      <Toolbar show={mode === 0}>
        <Option onClick={onFullscreenClick}>
          <CropFree />
        </Option>
        <Option>
          <Crop />
        </Option>
        <Option onClick={onCloseClick}>
          <Close />
        </Option>
      </Toolbar>
    </Container>
  )
}
