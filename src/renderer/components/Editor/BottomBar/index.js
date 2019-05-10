import React from 'react'
import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 20px;
  background: ${p => p.theme.grey[1]};
  border-top: 2px solid #fff;
`

export default function BottomBar() {
  return <Container>bottom</Container>
}
