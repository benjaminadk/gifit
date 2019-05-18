import React, { useEffect, useState } from 'react'
import { remote, ipcRenderer } from 'electron'
import { Check } from 'styled-icons/material/Check'
import Button from '../Shared/Button'
import { Container } from './styles'
import config from 'common/config'

const {
  ipcActions: { WEBCAM_SCALE }
} = config

export default function Scale() {
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    function initialize(e, value) {
      setScale(value)
    }
    ipcRenderer.once(WEBCAM_SCALE, initialize)

    return () => {
      ipcRenderer.removeListener(WEBCAM_SCALE, initialize)
    }
  }, [])

  function onChange({ target: { value } }) {
    ipcRenderer.send(WEBCAM_SCALE, value)
    setScale(value)
  }

  function onClose() {
    remote.getCurrentWindow().close()
  }

  return (
    <Container>
      <div className='title'>
        <div className='text'>Scale {scale}</div>
        <div className='divider' />
      </div>
      <div className='content'>
        <input type='range' min={0.4} max={1.5} step={0.01} value={scale} onChange={onChange} />
        <Button width={100} onClick={onClose}>
          <Check />
          <div className='text'>Close</div>
        </Button>
      </div>
    </Container>
  )
}
