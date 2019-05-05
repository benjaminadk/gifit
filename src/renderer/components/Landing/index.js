import React, { useContext } from 'react'
import { AppContext } from '../App'
import initializeGifit from '../Gifit/initializeGifit'

export default function Landing() {
  const { state, dispatch } = useContext(AppContext)

  return (
    <div>
      <button onClick={() => initializeGifit(state, dispatch)}>gifit</button>
    </div>
  )
}
