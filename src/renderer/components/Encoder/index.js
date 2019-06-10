import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import config from 'common/config'
import styled from 'styled-components'

export const Container = styled.div``

const {
  ipcActions: { ENCODER_READY, ENCODER_DATA }
} = config

export default function Encoder() {
  useEffect(() => {
    ipcRenderer.send(ENCODER_READY, true)

    function onEncoderData(e, encoderData) {
      console.log(encoderData)
    }

    ipcRenderer.on(ENCODER_DATA, onEncoderData)

    return () => {
      ipcRenderer.removeListener(ENCODER_DATA, onEncoderData)
    }
  }, [])

  return <Container>encoder</Container>
}
