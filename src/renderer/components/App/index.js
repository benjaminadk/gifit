import React, { useEffect, useReducer, createContext } from 'react'
import { reducer, initialState } from './state'
import dispatchAsync from './dispatchAsync'
import initialize from './initialize'
import Landing from '../Landing'
import Recorder from '../Recorder'
import Webcam from '../Webcam'
import Board from '../Board'
import Editor from '../Editor'
import Scale from '../Scale'
import Options from '../Options'
import config from 'common/config'

const {
  appActions: { INITIALIZE }
} = config

export const AppContext = createContext()

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { loading, windowID, windowTitle, mode } = state

  useEffect(() => {
    dispatchAsync(dispatch).call(null, {
      type: INITIALIZE,
      payload: initialize()
    })
  }, [])

  if (loading) return null

  if (windowID === 1) {
    if (mode === 0) {
      return (
        <AppContext.Provider value={{ state, dispatch }}>
          <Landing />
        </AppContext.Provider>
      )
    } else if (mode === 1) {
      return (
        <AppContext.Provider value={{ state, dispatch }}>
          <Editor />
        </AppContext.Provider>
      )
    } else if (mode === 2) {
      return <div>options</div>
    }
  } else {
    if (windowTitle === 'GifIt - Recorder') {
      return (
        <AppContext.Provider value={{ state, dispatch }}>
          <Recorder />
        </AppContext.Provider>
      )
    } else if (windowTitle === 'GifIt - Webcam') {
      return (
        <AppContext.Provider value={{ state, dispatch }}>
          <Webcam />
        </AppContext.Provider>
      )
    } else if (windowTitle === 'GifIt - Board') {
      return (
        <AppContext.Provider value={{ state, dispatch }}>
          <Board />
        </AppContext.Provider>
      )
    } else if (windowTitle === 'GifIt - Options') {
      return (
        <AppContext.Provider value={{ state, dispatch }}>
          <Options />
        </AppContext.Provider>
      )
    } else if (windowTitle === 'Scale') {
      return (
        <AppContext.Provider value={{ state, dispatch }}>
          <Scale />
        </AppContext.Provider>
      )
    }
  }
}
