import React from 'react'
import { Container, Layout } from './styles'

export default function Drawer({ show, children }) {
  return (
    <Container show={show}>
      <Layout>{children}</Layout>
    </Container>
  )
}
