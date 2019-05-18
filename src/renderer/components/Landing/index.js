import React, { useEffect, useContext } from 'react'
import { remote } from 'electron'
import { Settings } from 'styled-icons/material/Settings'
import { MediaRecord } from 'styled-icons/typicons/MediaRecord'
import { Camera } from 'styled-icons/fa-solid/Camera'
import { Image as ImageIcon } from 'styled-icons/material/Image'
import { AppContext } from '../App'
import initializeRecorder from '../Recorder/initializeRecorder'
import initializeWebcam from '../Webcam/initializeWebcam'
import initializeOptions from '../Options/initializeOptions'
import { Container, Action } from './styles'
import config from 'common/config'

const {
  mainWindow,
  appActions: { SET_APP_MODE }
} = config

export default function Landing() {
  const { state, dispatch } = useContext(AppContext)

  useEffect(() => {
    const [width, height] = remote.getCurrentWindow().getSize()
    if (width !== mainWindow.width || height !== mainWindow.height) {
      remote.getCurrentWindow().setSize(mainWindow.width, mainWindow.height)
      remote.getCurrentWindow().center()
    }
  }, [])

  function onOptionsClick() {
    initializeOptions(remote.getCurrentWindow(), dispatch)
  }

  function onRecordingClick() {
    initializeRecorder(state, dispatch)
  }

  function onWebcamClick() {
    initializeWebcam(state, dispatch)
  }

  function onEditorClick() {
    dispatch({ type: SET_APP_MODE, payload: 1 })
  }

  return (
    <Container>
      <div className='top'>
        <div className='title'>GifIt</div>
        <div className='options' onClick={onOptionsClick}>
          <Settings />
          <div>Options</div>
        </div>
      </div>
      <div className='bottom'>
        <Action onClick={onRecordingClick}>
          <MediaRecord />
          <div>Recorder</div>
        </Action>
        <Action onClick={onWebcamClick}>
          <Camera />
          <div>Webcam</div>
        </Action>
        <Action>
          <ImageIcon />
          <div>Board</div>
        </Action>
        <Action onClick={onEditorClick}>
          <ImageIcon />
          <div>Editor</div>
        </Action>
      </div>
    </Container>
  )
}
