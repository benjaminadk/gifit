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

export default function Alpha({ alphaY, hue, offsetTop, setAlpha, setAlphaY }) {
  const bar = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    paint(canvas, hue)
  }, [hue])

  useEffect(() => {
    function computePosition(e) {
      return Math.max(
        handleOffsetY * -1,
        Math.min(e.clientY - offsetTop + 137, squareSize - handleOffsetY)
      )
    }

    function computeAlpha(y) {
      return Math.abs(Math.round((y + handleOffsetY) / (squareSize * 0.01)) - 100) / 100
    }

    const onMouseMove = throttle(e => {
      const y = computePosition(e)
      setAlphaY(y)
      setAlpha(computeAlpha(y))
    }, delay)

    function onMouseUp(e) {
      const y = computePosition(e)
      setAlphaY(y)
      setAlpha(computeAlpha(y))
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
  }, [offsetTop])

  return (
    <Bar ref={bar}>
      <Handle top={alphaY}>
        <TriangleRight />
        <TriangleLeft />
      </Handle>
      <Canvas ref={canvas} />
    </Bar>
  )
}
