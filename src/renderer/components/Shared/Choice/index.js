import React from 'react'
import { Container } from './styles'

export default function Choice({ selected, icon, label, onClick }) {
  return (
    <Container selected={selected} onClick={onClick}>
      {icon}
      <div>{label}</div>
    </Container>
  )
}
