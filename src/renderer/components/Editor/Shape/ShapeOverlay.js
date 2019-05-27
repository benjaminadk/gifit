import React, { useRef, useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import { List, Map } from 'immutable'
import styled from 'styled-components'

export const Container = styled.div.attrs(p => ({}))`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  cursor: crosshair;
`

export const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export const Shape = styled.div.attrs(p => ({
  style: {
    border: `${p.strokeWidth}px solid ${p.strokeColor}`,
    borderRadius: p.shape === 'ellipsis' ? '50%' : 0,
    background: p.fillColor
  }
}))`
  width: 100%;
  height: 100%;
`

const handleStyle = {
  width: '10px',
  height: '10px',
  background: '#FFF',
  border: '1px solid grey'
}

export const resizeHandleStyles = {
  top: {
    ...handleStyle,
    left: '50%',
    cursor: 'n-resize'
  },
  topRight: {
    ...handleStyle,
    right: '-5px',
    top: '-5px'
  },
  right: {
    ...handleStyle,
    top: '50%',
    cursor: 'e-resize'
  },
  bottomRight: {
    ...handleStyle,
    right: '-5px',
    bottom: '-5px'
  },
  bottom: {
    ...handleStyle,
    left: '50%',
    cursor: 'n-resize'
  },
  bottomLeft: {
    ...handleStyle,
    left: '-5px',
    bottom: '-5px'
  },
  left: {
    ...handleStyle,
    top: '50%',
    cursor: 'e-resize'
  },
  topLeft: {
    ...handleStyle,
    left: '-5px',
    top: '-5px'
  }
}

export default function ShapeOverlay({
  show,
  gifData,
  shapeMode,
  shapeType,
  shapeStrokeWidth,
  shapeStrokeColor,
  shapeFillColor
}) {
  const [shapes, setShapes] = useState(List([]))
  const [index, setIndex] = useState(null)
  const [drawing, setDrawing] = useState(false)
  const [startX, setStartX] = useState(null)
  const [startY, setStartY] = useState(null)

  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [x, setX] = useState(null)
  const [y, setY] = useState(null)

  const [lockAspectRatio, setLockAspectRatio] = useState(false)

  const container = useRef(null)
  const inner = useRef(null)

  useEffect(() => {
    if (show && gifData) {
      container.current.style.width = gifData.width + 'px'
      container.current.style.height = gifData.height + 'px'
    }
  }, [show, gifData])

  useEffect(() => {
    if (!shapes.size) return
    const s = shapes.get(index)
    const obj = s.toObject()
    obj.strokeColor = shapeStrokeColor
    setShapes(shapes.set(index, Map(obj)))
  }, [shapeStrokeColor])

  useEffect(() => {
    if (!shapes.size) return
    const s = shapes.get(index)
    const obj = s.toObject()
    obj.fillColor = shapeFillColor
    setShapes(shapes.set(index, Map(obj)))
  }, [shapeFillColor])

  useEffect(() => {
    if (!shapes.size) return
    const s = shapes.get(index)
    const obj = s.toObject()
    obj.strokeWidth = shapeStrokeWidth
    setShapes(shapes.set(index, Map(obj)))
  }, [shapeStrokeWidth])

  useEffect(() => {
    if (shapeMode === 'select') {
      onSwitch()
    }
  }, [onSwitch, shapeMode])

  function onSwitch() {
    if (shapes.size) {
      const s = shapes.get(index)
      const obj = s.toObject()
      setWidth(obj.width)
      setHeight(obj.height)
      setX(obj.x)
      setY(obj.y)
    }
  }

  async function onMouseDown(e) {
    if (shapeMode === 'insert' && e.target === inner.current) {
      const { layerX, layerY } = e.nativeEvent
      const shape = {
        index: shapes.size,
        drawn: false,
        shape: shapeType,
        width: 0,
        height: 0,
        x: layerX,
        y: layerY,
        fillColor: 'transparent',
        strokeColor: shapeStrokeColor,
        strokeWidth: shapeStrokeWidth
      }

      await setIndex(shapes.size)

      setDrawing(true)
      setStartX(layerX)
      setStartY(layerY)
      setShapes(shapes.push(Map(shape)))
    }
  }

  function onMouseMove(e) {
    if (shapeMode === 'insert' && drawing) {
      const { layerX, layerY } = e.nativeEvent
      const w1 = Math.abs(layerX - startX)
      const h1 = Math.abs(layerY - startY)
      const x1 = layerX - startX < 0 ? layerX : startX
      const y1 = layerY - startY < 0 ? layerY : startY

      const s = shapes.get(index)
      const obj = s.toObject()
      obj.width = w1
      obj.height = h1
      obj.x = x1
      obj.y = y1

      setStartX(x1)
      setStartY(y1)
      setShapes(shapes.set(index, Map(obj)))

      setWidth(w1)
      setHeight(h1)
      setX(x1)
      setY(y1)
    }
  }

  function onMouseUp(e) {
    if (shapeMode === 'insert' && drawing) {
      setDrawing(false)
      const s = shapes.get(index)
      const obj = s.toObject()
      obj.drawn = true
      setShapes(shapes.set(index, Map(obj)))
    }
  }

  function onWidthChange(w1) {
    setWidth(w1)
    const s = shapes.get(index)
    const obj = s.toObject()
    obj.width = w1
    setShapes(shapes.set(index, Map(obj)))
  }

  function onHeightChange(h1) {
    setHeight(h1)
    const s = shapes.get(index)
    const obj = s.toObject()
    obj.height = h1
    setShapes(shapes.set(index, Map(obj)))
  }

  function onXChange(x1) {
    setX(x1)
    const s = shapes.get(index)
    const obj = s.toObject()
    obj.x = x1
    setShapes(shapes.set(index, Map(obj)))
  }

  function onYChange(y1) {
    setY(y1)
    const s = shapes.get(index)
    const obj = s.toObject()
    obj.y = y1
    setShapes(shapes.set(index, Map(obj)))
  }

  function onShapeClick(i) {
    if (shapeMode === 'select') {
      setIndex(i)
    }
  }

  if (show) {
    return (
      <Container
        ref={container}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <Inner ref={inner}>
          {shapes.map((el, i) => {
            if (el.get('drawn') && i === index) {
              return (
                <Rnd
                  key={i}
                  style={{
                    zIndex: `${9 + el.get('index')}`,
                    border: '2px dotted lightgrey'
                  }}
                  bounds='parent'
                  size={{ width: width, height: height }}
                  position={{ x: x, y: y }}
                  resizeHandleStyles={resizeHandleStyles}
                  lockAspectRatio={lockAspectRatio}
                  onDrag={(e, d) => {
                    onXChange(d.x)
                    onYChange(d.y)
                  }}
                  onResize={(e, direction, ref, delta, position) => {
                    setLockAspectRatio(e.shiftKey)
                    onWidthChange(ref.offsetWidth)
                    onHeightChange(ref.offsetHeight)
                    onXChange(position.x)
                    onYChange(position.y)
                  }}
                >
                  <Shape
                    shape={el.get('shape')}
                    strokeWidth={el.get('strokeWidth')}
                    strokeColor={el.get('strokeColor')}
                    fillColor={el.get('fillColor')}
                  />
                </Rnd>
              )
            } else {
              if (el.get('width') < 50 || el.get('height') < 50) {
                return null
              }
              return (
                <Rnd
                  key={i}
                  style={{
                    zIndex: `${9 + el.get('index')}`
                  }}
                  bounds='parent'
                  size={{ width: el.get('width'), height: el.get('height') }}
                  position={{ x: el.get('x'), y: el.get('y') }}
                  enableResizing={false}
                  onClick={() => onShapeClick(i)}
                >
                  <Shape
                    shape={el.get('shape')}
                    strokeWidth={el.get('strokeWidth')}
                    strokeColor={el.get('strokeColor')}
                    fillColor={el.get('fillColor')}
                  />
                </Rnd>
              )
            }
          })}
        </Inner>
      </Container>
    )
  } else {
    return null
  }
}
