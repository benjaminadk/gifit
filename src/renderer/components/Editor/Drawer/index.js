import React from 'react'
import { Container, Layout } from './styles'

export default function Drawer({ show, shiftUp, thumbHeight, children }) {
  return (
    <Container show={show} shiftUp={shiftUp} thumbHeight={thumbHeight}>
      <Layout>{children}</Layout>
    </Container>
  )
}
