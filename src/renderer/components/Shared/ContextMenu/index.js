import React from 'react'
import styled from 'styled-components'

export const Container = styled.div.attrs(p => ({
  style: {
    top: p.top + 'px',
    left: p.left + 'px',
    display: p.show ? 'block' : 'none'
  }
}))`
  position: absolute;
`

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
`

export default function ContextMenu({ position, children, onClose }) {
  return (
    <>
      <Backdrop onClick={onClose} />
      <Container
        show={!!position}
        top={position && position[1]}
        left={position && position[0]}
      >
        {children}
      </Container>
    </>
  )
}
