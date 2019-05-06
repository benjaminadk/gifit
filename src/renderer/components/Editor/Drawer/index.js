import React from 'react'
import { Container } from './styles'

export default function Drawer(props) {
  return (
    <Container show={props.show} width={props.width}>
      {props.children}
    </Container>
  )
}
