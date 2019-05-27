import React, { useRef, useEffect, useState } from 'react'
import { remote } from 'electron'
import { Rnd } from 'react-rnd'
import { Container, Inner, Shape, resizeHandleStyles } from './styles'

export default function ShapeOverlay({
  show,
  gifData,
  shapeMode,
  shapeType,
  shapeStrokeWidth,
  shapeStrokeColor,
  shapeFillColor
}) {
  const [shapes, setShapes] = useState([])
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
    async function onDeleteShape() {
      if (shapes.length) {
        const s = shapes.slice()
        s.splice(index, 1)
        // const obj = s[index]
        // obj.show = false
        // s[index] = obj
        await setShapes(s)
        await setIndex(null)
      }
    }

    if (!shapes.length) {
      remote.globalShortcut.unregisterAll('Ctrl+Backspace')
    }
    remote.globalShortcut.unregister('Ctrl+Backspace', onDeleteShape)
    remote.globalShortcut.register('Ctrl+Backspace', onDeleteShape)

    return () => {
      remote.globalShortcut.unregister('Ctrl+Backspace', onDeleteShape)
    }
  }, [shapes, index])

  useEffect(() => {
    if (!shapes.length) return
    const s = shapes.slice()
    const obj = s[index]
    obj.strokeColor = shapeStrokeColor
    s[index] = obj
    setShapes(s)
  }, [shapeStrokeColor])

  useEffect(() => {
    if (!shapes.length) return
    const s = shapes.slice()
    const obj = s[index]
    obj.fillColor = shapeFillColor
    s[index] = obj
    setShapes(s)
  }, [shapeFillColor])

  useEffect(() => {
    if (!shapes.length) return
    const s = shapes.slice()
    const obj = s[index]
    obj.strokeWidth = shapeStrokeWidth
    s[index] = obj
    setShapes(s)
  }, [shapeStrokeWidth])

  useEffect(() => {
    if (shapeMode === 'select') {
      onSwitchIndex()
    }
  }, [shapes.length, index, shapeMode])

  function onSwitchIndex() {
    if (shapes.length && index !== null) {
      const s = shapes.slice()
      const obj = s[index]
      if (!obj) return
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
        index: shapes.length,
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

      await setIndex(shapes.length)

      setDrawing(true)
      setStartX(layerX)
      setStartY(layerY)
      setShapes([...shapes, shape])
    }
  }

  function onMouseMove(e) {
    if (shapeMode === 'insert' && drawing) {
      const { layerX, layerY } = e.nativeEvent
      const w1 = Math.abs(layerX - startX)
      const h1 = Math.abs(layerY - startY)
      const x1 = layerX - startX < 0 ? layerX : startX
      const y1 = layerY - startY < 0 ? layerY : startY

      const s = shapes.slice()
      const obj = s[index]
      obj.width = w1
      obj.height = h1
      obj.x = x1
      obj.y = y1
      s[index] = obj

      setStartX(x1)
      setStartY(y1)
      setShapes(s)

      setWidth(w1)
      setHeight(h1)
      setX(x1)
      setY(y1)
    }
  }

  function onMouseUp(e) {
    if (shapeMode === 'insert' && drawing) {
      setDrawing(false)
      const s = shapes.slice()
      const obj = s[index]
      obj.drawn = true
      s[index] = obj
      setShapes(s)
    }
  }

  function onWidthChange(w1) {
    const s = shapes.slice()
    const obj = s[index]
    obj.width = w1
    s[index] = obj
    setShapes(s)
  }

  function onHeightChange(h1) {
    const s = shapes.slice()
    const obj = s[index]
    obj.height = h1
    s[index] = obj
    setShapes(s)
  }

  function onXChange(x1) {
    const s = shapes.slice()
    const obj = s[index]
    obj.x = x1
    s[index] = obj
    setShapes(s)
  }

  function onYChange(y1) {
    const s = shapes.slice()
    const obj = s[index]
    obj.y = y1
    s[index] = obj
    setShapes(s)
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
            if (el.drawn && i === index) {
              return (
                <Rnd
                  key={i}
                  style={{
                    zIndex: `${9 + el.index}`,
                    border: '2px dotted lightgrey'
                  }}
                  bounds='parent'
                  size={{ width: width, height: height }}
                  position={{ x: x, y: y }}
                  resizeHandleStyles={resizeHandleStyles}
                  lockAspectRatio={lockAspectRatio}
                  onDrag={(e, d) => {
                    setX(d.x)
                    setY(d.y)
                  }}
                  onDragStop={(e, d) => {
                    onXChange(d.x)
                    onYChange(d.y)
                  }}
                  onResize={(e, direction, ref, delta, position) => {
                    setLockAspectRatio(e.shiftKey)
                    setWidth(ref.offsetWidth)
                    setHeight(ref.offsetHeight)
                    setX(position.x)
                    setY(position.y)
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    onWidthChange(ref.offsetWidth)
                    onHeightChange(ref.offsetHeight)
                    onXChange(position.x)
                    onYChange(position.y)
                  }}
                >
                  <Shape
                    shape={el.shape}
                    strokeWidth={el.strokeWidth}
                    strokeColor={el.strokeColor}
                    fillColor={el.fillColor}
                  />
                </Rnd>
              )
            } else {
              if (el.width < 50 || el.height < 50) {
                return null
              }
              return (
                <Rnd
                  key={i}
                  style={{
                    zIndex: `${9 + el.index}`
                  }}
                  bounds='parent'
                  size={{ width: el.width, height: el.height }}
                  position={{ x: el.x, y: el.y }}
                  enableResizing={false}
                  onClick={() => onShapeClick(i)}
                >
                  <Shape
                    shape={el.shape}
                    strokeWidth={el.strokeWidth}
                    strokeColor={el.strokeColor}
                    fillColor={el.fillColor}
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
