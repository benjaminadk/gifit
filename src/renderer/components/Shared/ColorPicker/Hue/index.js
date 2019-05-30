import React, { useRef, useEffect } from 'react'
import throttle from 'lodash.throttle'
import { Container, Canvas, Handle } from '../styles'
import paint from './paint'
import config from 'common/config'

const {
  picker: { squareSize, handleOffsetY, delay }
} = config

export default function Hue({ hueY, setHueY, setHue }) {
  const container = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    paint(canvas)
  }, [])

  useEffect(() => {
    const element = container.current
    const offsetTop = element.offsetTop

    function computePosition(e) {
      const p = Math.max(
        handleOffsetY * -1,
        Math.min(e.offsetY - offsetTop, squareSize - handleOffsetY)
      )

      return p
    }

    function computeHue(y) {
      return Math.round((y + handleOffsetY) * (360 / squareSize))
    }

    const onMouseMove = throttle(e => {
      const y = computePosition(e)
      const hue = computeHue(y)
      setHueY(y)
      setHue(hue)
    }, delay)

    function onMouseUp(e) {
      const y = computePosition(e)
      const hue = computeHue(y)
      setHueY(y)
      setHue(hue)
      document.body.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseup', onMouseUp)
    }

    function onMouseDown(e) {
      document.body.addEventListener('mousemove', onMouseMove)
      document.body.addEventListener('mouseup', onMouseUp)
    }

    element.addEventListener('mousedown', onMouseDown)

    return () => {
      element.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <Container ref={container}>
      <Handle top={hueY} />
      <Canvas ref={canvas} />
    </Container>
  )
}
