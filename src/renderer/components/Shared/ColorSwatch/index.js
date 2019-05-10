import React, { useRef } from 'react'
import { Container } from './styles'

export default function ColorSwatch({ width, color, onChange }) {
  const picker = useRef(null)

  return (
    <Container
      width={width}
      color={color}
      onClick={() => picker.current.click()}
    >
      <input
        ref={picker}
        type='color'
        onChange={e => onChange(e.target.value)}
      />
    </Container>
  )
}
