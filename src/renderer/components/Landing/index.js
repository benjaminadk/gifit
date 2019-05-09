import React, { useContext } from 'react'
import { AppContext } from '../App'
import initializeGifit from '../Gifit/initializeGifit'
import config from 'common/config'

const {
  appActions: { SET_APP_MODE }
} = config

export default function Landing() {
  const { state, dispatch } = useContext(AppContext)

  function onRecordingClick() {
    initializeGifit(state, dispatch)
  }

  function onEditorClick() {
    dispatch({ type: SET_APP_MODE, payload: 1 })
  }

  return (
    <div>
      <button onClick={onRecordingClick}>Recording</button>
      <button onClick={onEditorClick}>Editor</button>
    </div>
  )
}
