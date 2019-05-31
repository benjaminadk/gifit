import React, { useEffect, useContext } from 'react'
import { remote } from 'electron'
import { AppContext } from '../App'
import initializeRecorder from '../Recorder/initializeRecorder'
import initializeWebcam from '../Webcam/initializeWebcam'
import initializeBoard from '../Board/initializeBoard'
import initializeOptions from '../Options/initializeOptions'
import Svg from '../Svg'
import { Container, Action } from './styles'
import config from 'common/config'

const {
  mainWindow,
  appActions: { SET_APP_MODE, SET_OPTIONS_OPEN }
} = config

export default function Landing() {
  const { state, dispatch } = useContext(AppContext)
  const { optionsOpen } = state

  useEffect(() => {
    const [width, height] = remote.getCurrentWindow().getSize()
    if (width !== mainWindow.width || height !== mainWindow.height) {
      remote.getCurrentWindow().setSize(mainWindow.width, mainWindow.height)
      remote.getCurrentWindow().center()
    }
  }, [])

  function onOptionsClick() {
    if (!optionsOpen) {
      dispatch({ type: SET_OPTIONS_OPEN, payload: true })
      initializeOptions(remote.getCurrentWindow(), dispatch)
    }
  }

  function onRecordingClick() {
    initializeRecorder(state, dispatch)
  }

  function onWebcamClick() {
    initializeWebcam(state, dispatch)
  }

  function onBoardClick() {
    initializeBoard(state,dispatch)
  }

  function onEditorClick() {
    dispatch({ type: SET_APP_MODE, payload: 1 })
  }

  return (
    <Container>
      <div className='top'>
        <div className='title'>GifIt</div>
        <div className='options' onClick={onOptionsClick}>
          <Svg name='settings' />
          <div>Options</div>
        </div>
      </div>
      <div className='bottom'>
        <Action onClick={onRecordingClick}>
          <Svg name='record-new' />
          <div>Recorder</div>
        </Action>
        <Action onClick={onWebcamClick}>
          <Svg name='camera-new' />
          <div>Webcam</div>
        </Action>
        <Action onClick={onBoardClick}>
          <Svg name='board-new' />
          <div>Board</div>
        </Action>
        <Action onClick={onEditorClick}>
          <Svg name='editor' />
          <div>Editor</div>
        </Action>
      </div>
    </Container>
  )
}
