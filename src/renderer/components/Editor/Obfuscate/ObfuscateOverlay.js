import React, { useState, useRef } from 'react'
import { Rnd } from 'react-rnd'
import { Container, Inner, Dimensions } from './styles'

const handleStyle = {
  width: 10,
  height: 10,
  background: '#FFF',
  border: '1px solid grey'
}

export default function ObfuscateOverlay({
  show,
  gifData,
  obfuscatePixels,
  obfuscateWidth,
  obfuscateHeight,
  obfuscateX,
  obfuscateY,
  setObfuscateWidth,
  setObfuscateHeight,
  setObfuscateX,
  setObfuscateY
}) {
  const [drawing, setDrawing] = useState(false)
  const [startX, setStartX] = useState(null)
  const [startY, setStartY] = useState(null)

  const inner = useRef(null)

  function onMouseDown(e) {
    if (e.target === inner.current) {
      const { layerX, layerY } = e.nativeEvent

      setDrawing(true)
      setStartX(layerX)
      setStartY(layerY)

      setObfuscateWidth(0)
      setObfuscateHeight(0)
      setObfuscateX(layerX)
      setObfuscateY(layerY)
    }
  }

  function onMouseMove(e) {
    if (drawing) {
      const { layerX, layerY } = e.nativeEvent
      const w = Math.abs(layerX - startX)
      const h = Math.abs(layerY - startY)
      const x = layerX - startX < 0 ? layerX : startX
      const y = layerY - startY < 0 ? layerY : startY

      setStartX(x)
      setStartY(y)

      setObfuscateWidth(w)
      setObfuscateHeight(h)
      setObfuscateX(x)
      setObfuscateY(y)
    }
  }

  function onMouseUp(e) {
    setDrawing(false)
  }

  if (show) {
    return (
      <Container
        width={gifData.width}
        height={gifData.height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <Inner ref={inner}>
          {obfuscateWidth && obfuscateHeight ? (
            <Rnd
              style={{
                zIndex: 9,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                border: '2px dashed lightgrey',
                background: 'rgba(255, 255, 255, .25)'
              }}
              bounds='parent'
              size={{ width: obfuscateWidth, height: obfuscateHeight }}
              position={{ x: obfuscateX, y: obfuscateY }}
              resizeGrid={[obfuscatePixels, obfuscatePixels]}
              onDrag={(e, d) => {
                setObfuscateX(d.x)
                setObfuscateY(d.y)
              }}
              onResize={(e, direction, ref, delta, position) => {
                setObfuscateWidth(ref.offsetWidth)
                setObfuscateHeight(ref.offsetHeight)
                setObfuscateX(position.x)
                setObfuscateY(position.y)
              }}
              // enableSizing={drawing ? false : true}
              resizeHandleStyles={{
                top: {
                  ...handleStyle,
                  visibility: !drawing ? 'visible' : 'hidden',
                  left: '50%',
                  cursor: 'n-resize'
                },
                topRight: {
                  ...handleStyle,
                  visibility: !drawing ? 'visible' : 'hidden',
                  right: '-5px',
                  top: '-5px'
                },
                right: {
                  ...handleStyle,
                  visibility: !drawing ? 'visible' : 'hidden',
                  top: '50%',
                  cursor: 'e-resize'
                },
                bottomRight: {
                  ...handleStyle,
                  visibility: !drawing ? 'visible' : 'hidden',
                  right: '-5px',
                  bottom: '-5px'
                },
                bottom: {
                  ...handleStyle,
                  visibility: !drawing ? 'visible' : 'hidden',
                  left: '50%',
                  cursor: 'n-resize'
                },
                bottomLeft: {
                  ...handleStyle,
                  visibility: !drawing ? 'visible' : 'hidden',
                  left: '-5px',
                  bottom: '-5px'
                },
                left: {
                  ...handleStyle,
                  visibility: !drawing ? 'visible' : 'hidden',
                  top: '50%',
                  cursor: 'e-resize'
                },
                topLeft: {
                  ...handleStyle,
                  visibility: !drawing ? 'visible' : 'hidden',
                  left: '-5px',
                  top: '-5px'
                }
              }}
            >
              <Dimensions show={obfuscateWidth > 100 && obfuscateHeight > 100}>
                {obfuscateWidth} x {obfuscateHeight}
              </Dimensions>
            </Rnd>
          ) : null}
        </Inner>
      </Container>
    )
  } else {
    return null
  }
}
