import React, { useRef } from 'react'
import { Container, Wrapper } from './styles'

export default function Modal({ modal, show, children }) {
  const container = useRef(null)

  return (
    <Container ref={container} show={show}>
      <Wrapper ref={modal}>{children}</Wrapper>
    </Container>
  )
}
