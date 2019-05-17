import React from 'react'
import { Container, Layout } from './styles'

export default function Drawer({ show, thumbHeight, children }) {
  return (
    <Container show={show} thumbHeight={thumbHeight}>
      <Layout>{children}</Layout>
    </Container>
  )
}
