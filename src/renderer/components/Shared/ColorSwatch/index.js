import React, { useState } from 'react'
import ColorPicker from '../ColorPicker'
import { Container } from './styles'

export default function ColorSwatch({ width, color, onChange }) {
  const [show, setShow] = useState(false)

  return (
    <>
      <Container width={width} color={color} onClick={() => setShow(true)}>
        <div className='inner' />
      </Container>
      <ColorPicker
        show={show}
        initialColor={color}
        onChange={onChange}
        onClose={() => setShow(false)}
      />
    </>
  )
}
