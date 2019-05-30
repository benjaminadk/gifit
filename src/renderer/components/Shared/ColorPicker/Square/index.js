import React, { useRef, useEffect } from 'react'
import throttle from 'lodash.throttle'
import convertRGBtoHSL from '../../../../lib/convertRGBtoHSL'
import { Container, Canvas, Cross } from './styles'
import paint from './paint'
import config from 'common/config'

const {
  picker: { squareSize, crossOffset, delay }
} = config

export default function Square({ hue, squareXY, setSquare, offsetTop, offsetLeft, setSquareXY }) {
  const square = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    paint(canvas, hue)
  }, [hue])

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')

    function computePosition(e) {
      const x = Math.max(
        crossOffset * -1,
        Math.min(e.clientX - offsetLeft + 237, squareSize - crossOffset)
      )
      const y = Math.max(
        crossOffset * -1,
        Math.min(e.clientY - offsetTop + 137, squareSize - crossOffset)
      )
      return [x, y]
    }

    function changeColor(e) {
      const [x, y] = computePosition(e)
      const x1 = Math.min(x + crossOffset, squareSize - 1)
      const y1 = Math.min(y + crossOffset, squareSize - 1)
      const [r, g, b] = ctx.getImageData(x1, y1, 1, 1).data
      const [h, s, l] = convertRGBtoHSL([r, g, b])
      setSquare([s, l])
      setSquareXY([x, y])
    }

    const onMouseMove = throttle(e => {
      changeColor(e)
    }, delay)

    function onMouseUp(e) {
      changeColor(e)
      document.body.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseup', onMouseUp)
    }

    function onMouseDown(e) {
      document.body.addEventListener('mousemove', onMouseMove)
      document.body.addEventListener('mouseup', onMouseUp)
    }

    canvas.current.addEventListener('mousedown', onMouseDown)

    return () => {
      canvas.current.removeEventListener('mousedown', onMouseDown)
    }
  }, [offsetTop, offsetLeft])

  return (
    <Container ref={square}>
      <Cross top={squareXY[1]} left={squareXY[0]} />
      <Canvas ref={canvas} />
    </Container>
  )
}
