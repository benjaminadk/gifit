import React, { useRef, useEffect } from 'react'
import { Container, Wrapper } from './styles'

export default function Modal({ modal, show, children, onClose }) {
  const container = useRef(null)

  // useEffect(() => {
  //   if (show) {
  //     document.body.addEventListener('click', onClickAway)
  //   } else {
  //     document.body.removeEventListener('click', onClickAway)
  //   }

  //   return () => {
  //     document.body.removeEventListener('click', onClickAway)
  //   }
  // }, [show])

  // function onClickAway(e) {
  //   if (e.target === container.current) {
  //     onClose()
  //   }
  // }

  return (
    <Container ref={container} show={show}>
      <Wrapper ref={modal}>{children}</Wrapper>
    </Container>
  )
}
