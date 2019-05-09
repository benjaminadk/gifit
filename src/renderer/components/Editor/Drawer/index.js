import React from 'react'
import { Container, Layout } from './styles'

export default function Drawer({ width = 300, show, children }) {
  return (
    <Container show={show} width={width}>
      <Layout>{children}</Layout>
    </Container>
  )
}
