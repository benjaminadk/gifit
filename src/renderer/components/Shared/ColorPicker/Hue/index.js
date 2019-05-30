import React, { useRef, useEffect } from 'react'
import throttle from 'lodash.throttle'
import { TriangleLeft } from 'styled-icons/octicons/TriangleLeft'
import { TriangleRight } from 'styled-icons/octicons/TriangleRight'
import { Bar, Canvas, Handle } from '../styles'
import paint from './paint'
import config from 'common/config'

const {
  picker: { squareSize, handleOffsetY, delay }
} = config

export default function Hue({ hueY, setHueY, setHue }) {
  const bar = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    paint(canvas)
  }, [])

  useEffect(() => {
    const offsetTop = bar.current.offsetTop

    function computePosition(e) {
      return Math.max(
        handleOffsetY * -1,
        Math.min(e.offsetY - offsetTop, squareSize - handleOffsetY)
      )
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

    bar.current.addEventListener('mousedown', onMouseDown)

    return () => {
      bar.current.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <Bar ref={bar}>
      <Handle top={hueY}>
        <TriangleRight />
        <TriangleLeft />
      </Handle>
      <Canvas ref={canvas} />
    </Bar>
  )
}
