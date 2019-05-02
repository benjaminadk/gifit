import React, { useEffect, useReducer, createContext } from 'react'
import { reducer, initialState } from './state'
import dispatchAsync from './dispatchAsync'
import initialize from './initialize'
import config from 'common/config'

const {
  appActions: { INITIALIZE }
} = config

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatchAsync(dispatch).call(null, {
      type: INITIALIZE,
      payload: initialize()
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
