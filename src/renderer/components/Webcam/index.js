import React, { useEffect, useState, useRef, useContext } from 'react'
import { remote } from 'electron'
import styled from 'styled-components'
import { AppContext } from '../App'
import config from 'common/config'

const {
  ipcActions: { WEBCAM_CLOSE, WEBCAM_STOP },
  constants: { VIDEO_CSS, IMAGE_TYPE, IMAGE_REGEX, MAX_LENGTH }
} = config

export const Container = styled.div.attrs(p => ({}))`
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr 50px;
`

export const Video = styled.video.attrs(p => ({
  width: p.width,
  height: p.height
}))`
  object-fit: contain;
`

export default function Webcam() {
  const { state, dispatch } = useContext(AppContext)
  const { options, videoInputs, sources } = state

  const videoInputIndex = options.get('videoInputIndex')
  const sourceIndex = options.get('sourceIndex')

  const videoInput = videoInputs[videoInputIndex]
  const source = sources[sourceIndex]

  const [scale, setScale] = useState(0.5)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const video = useRef(null)

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

      video.current.srcObject = stream
      video.current.onloadedmetadata = () => {
        const w = Math.floor(video.current.videoWidth * scale)
        const h = Math.floor(video.current.videoHeight * scale)
        setWidth(w)
        setHeight(h)
        remote.getCurrentWindow().setSize(w + 10, h + 100)
        remove.getCurrentWindow().center()
      }
    }

    initialize()
  }, [])

  useEffect(() => {
    const w = Math.floor(video.current.videoWidth * scale)
    const h = Math.floor(video.current.videoHeight * scale)
    setWidth(w)
    setHeight(h)
    remote.getCurrentWindow().setSize(w + 10, h + 100)
  }, [scale])

  function onScaleChange({ target: { value } }) {
    setScale(value)
  }

  function onCloseClick() {
    remote.BrowserWindow.fromId(1).webContents.send(WEBCAM_CLOSE, null)
    remote.getCurrentWindow().close()
  }

  return (
    <Container width={width} height={height + 50}>
      <Video ref={video} width={width} height={height} autoPlay={true} />
      <div>
        <input
          type='range'
          min={0.25}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={onScaleChange}
        />
        <button onClick={onCloseClick}>Close</button>
      </div>
    </Container>
  )
}
