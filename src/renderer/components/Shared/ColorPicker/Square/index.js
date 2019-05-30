import React, { useRef, useEffect } from 'react'
import throttle from 'lodash.throttle'
import { Container, Canvas, Cross } from './styles'
import paint from './paint'
import config from 'common/config'

const {
  picker: { squareSize, crossOffset, delay }
} = config

export default function Square({ hue, squareXY }) {
  const container = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    paint(canvas, hue)
  }, [hue])

  return (
    <Container ref={container}>
      <Cross top={squareXY[1]} left={squareXY[0]} />
      <Canvas ref={canvas} />
    </Container>
  )
}
