import React, { useRef, useEffect, useState } from 'react'
import { remote } from 'electron'
import drawBrush from '../../lib/drawBrush'
import Svg from '../Svg'
import NumberInput from '../Shared/NumberInput'
import ColorSwatch from '../Shared/ColorSwatch/generic'
import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div`
  display: grid;
  grid-template-rows: 30px 1fr 30px;
  padding-left: 2px;
  padding-right: 2px;
  overflow: hidden;
`

export const Top = styled.div`
  display: grid;
  grid-template-columns: 30px 30px 70px 70px 70px 30px 30px 1fr;
  align-items: center;
  justify-items: center;
`

export const Action = styled.div`
  width: 90%;
  height: 90%;
  display: grid;
  align-items: center;
  justify-items: center;
  background: ${p => (p.selected ? lighten(0.4, p.theme.primary) : 'transparent')};
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    width: 20px;
    height: 20px;
  }
`

export const Main = styled.div`
  justify-self: center;
  position: relative;
  border: ${p => p.theme.border};
`

export const Canvas1 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`

export const Canvas2 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`

export const Canvas3 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  cursor: none;
`

export const Bottom = styled.div``

export default function Board() {
  const [canvasWidth, setCanvasWidth] = useState(500)
  const [canvasHeight, setCanvasHeight] = useState(350)
  const [drawing, setDrawing] = useState(false)
  const [drawType, setDrawType] = useState('pen')
  const [penColor, setPenColor] = useState('#FFFF00')
  const [penWidth, setPenWidth] = useState(10)
  const [penHeight, setPenHeight] = useState(10)
  const [penShape, setPenShape] = useState('rectangle')

  const main = useRef(null)
  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const canvas3 = useRef(null)

  useEffect(() => {
    main.current.style.width = canvasWidth + 'px'
    main.current.style.height = canvasHeight + 'px'
    canvas1.current.width = canvasWidth
    canvas1.current.height = canvasHeight
    canvas2.current.width = canvasWidth
    canvas2.current.height = canvasHeight
    canvas3.current.width = canvasWidth
    canvas3.current.height = canvasHeight
    remote.getCurrentWindow().setContentSize(canvasWidth + 4, canvasHeight + 80)
  }, [canvasWidth, canvasHeight])

  function onMouseMove(e) {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY

    if (drawType === 'pen') {
      drawBrush(canvas3.current, x, y, penShape, penColor, penWidth, penHeight)
    }
  }

  return (
    <Container>
      <Top>
        <Action selected={drawType === 'pen'} onClick={() => setDrawType('pen')}>
          <Svg name='pen' />
        </Action>
        <Action selected={drawType === 'eraser'} onClick={() => setDrawType('eraser')}>
          <Svg name='eraser' />
        </Action>
        <ColorSwatch width={60} color={penColor} onChange={setPenColor} />
        <NumberInput
          width={60}
          value={penWidth}
          min={1}
          max={100}
          fallback={10}
          setter={setPenWidth}
        />
        <NumberInput
          width={60}
          value={penHeight}
          min={1}
          max={100}
          fallback={10}
          setter={setPenHeight}
        />
        <Action selected={penShape === 'rectangle'} onClick={() => setPenShape('rectangle')}>
          <Svg name='rectangle' />
        </Action>
        <Action selected={penShape === 'ellipsis'} onClick={() => setPenShape('ellipsis')}>
          <Svg name='shape' />
        </Action>
        <div />
      </Top>
      <Main ref={main}>
        <Canvas1 ref={canvas1} />
        <Canvas2 ref={canvas2} />
        <Canvas3 ref={canvas3} onMouseMove={onMouseMove} />
      </Main>
      <Bottom>d</Bottom>
    </Container>
  )
}
