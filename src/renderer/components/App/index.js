import React, { useEffect, useReducer, createContext } from 'react'
import { reducer, initialState } from './state'
import dispatchAsync from './dispatchAsync'
import initialize from './initialize'
import Landing from '../Landing'
import Editor from '../Editor'
import Gifit from '../Gifit'
import config from 'common/config'

const {
  appActions: { INITIALIZE }
} = config

export const AppContext = createContext()

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { loading, windowID, mode } = state

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
    return (
      <AppContext.Provider value={{ state, dispatch }}>
        <Gifit />
      </AppContext.Provider>
    )
  }
}
