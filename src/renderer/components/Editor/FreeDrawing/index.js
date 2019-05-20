import React from 'react'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { PenFancy } from 'styled-icons/fa-solid/PenFancy'
import { PenNib } from 'styled-icons/fa-solid/PenNib'
import { Eraser } from 'styled-icons/boxicons-solid/Eraser'
import { Square } from 'styled-icons/fa-regular/Square'
import { Circle } from 'styled-icons/boxicons-regular/Circle'
import Choice from '../../Shared/Choice'
import NumberInput from '../../Shared/NumberInput'
import ColorSwatch from '../../Shared/ColorSwatch'
import Checkbox from '../../Shared/Checkbox'
import { Header, Main, Section, ChoiceRow, Property, Label, Footer, Button } from '../Drawer/styles'

export default function FreeDrawing({
  drawerHeight,
  drawType,
  drawPenWidth,
  drawPenHeight,
  drawPenColor,
  drawHighlight,
  drawShape,
  drawEraserWidth,
  drawEraserHeight,
  setDrawType,
  setDrawPenWidth,
  setDrawPenHeight,
  setDrawPenColor,
  setDrawHighlight,
  setDrawShape,
  setDrawEraserWidth,
  setDrawEraserHeight,
  onAccept,
  onCancel
}) {
  function onDrawDimensionChange({ target: { value } }, type, dimension) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 100) {
        newValue = 100
      } else {
        newValue = value
      }
    } else {
      newValue = 1
    }
    if (type === 'pen') {
      if (dimension === 'width') {
        setDrawPenWidth(newValue)
      } else if (dimension === 'height') {
        setDrawPenHeight(newValue)
      }
    } else if (type === 'eraser') {
      if (dimension === 'width') {
        setDrawEraserWidth(newValue)
      } else if (dimension === 'height') {
        setDrawEraserHeight(newValue)
      }
    }
  }

  function onDrawDimensionArrowClick(type, dimension, inc) {
    var currentValue
    var newValue
    var setter

    if (type === 'pen') {
      if (dimension === 'width') {
        currentValue = drawPenWidth
        setter = setDrawPenWidth
      } else if (dimension === 'height') {
        currentValue = drawPenHeight
        setter = setDrawPenHeight
      }
    } else if (type === 'eraser') {
      if (dimension === 'width') {
        currentValue = drawEraserWidth
        setter = setDrawEraserWidth
      } else if (dimension === 'height') {
        currentValue = drawEraserHeight
        setter = setDrawEraserHeight
      }
    }
    if (inc) {
      if (currentValue < 100) {
        newValue = currentValue + 1
      } else {
        newValue = 100
      }
    } else {
      if (currentValue > 1) {
        newValue = currentValue - 1
      } else {
        newValue = 1
      }
    }
    setter(newValue)
  }

  return (
    <>
      <Header>
        <div className='left'>
          <PenFancy />
          <div className='text'>Free Drawing</div>
        </div>
        <div className='right'>
          <Close onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={60}>
          <div className='title'>
            <div className='text'>Mode</div>
            <div className='divider' />
          </div>
          <div>
            <ChoiceRow>
              <Choice
                selected={drawType === 'pen'}
                icon={<PenNib />}
                label='Pen'
                onClick={() => setDrawType('pen')}
              />
              <Choice
                selected={drawType === 'eraser'}
                icon={<Eraser />}
                label='Eraser'
                onClick={() => setDrawType('eraser')}
              />
            </ChoiceRow>
          </div>
        </Section>
        {drawType === 'pen' ? (
          <>
            <Section height={200}>
              <div className='title'>
                <div className='text'>Pen</div>
                <div className='divider' />
              </div>
              <div>
                <Property>
                  <Label width={70}>Width:</Label>
                  <NumberInput
                    width={80}
                    value={drawPenWidth}
                    onChange={e => onDrawDimensionChange(e, 'pen', 'width')}
                    onArrowUpClick={() => onDrawDimensionArrowClick('pen', 'width', true)}
                    onArrowDownClick={() => onDrawDimensionArrowClick('pen', 'width', false)}
                  />
                </Property>
                <Property>
                  <Label width={70}>Height:</Label>
                  <NumberInput
                    width={80}
                    value={drawPenHeight}
                    onChange={e => onDrawDimensionChange(e, 'pen', 'height')}
                    onArrowUpClick={() => onDrawDimensionArrowClick('pen', 'height', true)}
                    onArrowDownClick={() => onDrawDimensionArrowClick('pen', 'height', false)}
                  />
                </Property>
                <Property>
                  <Label width={70}>Color:</Label>
                  <ColorSwatch width={100} color={drawPenColor} onChange={setDrawPenColor} />
                </Property>
                <Property>
                  <Label width={70}>Tip:</Label>
                  <ChoiceRow>
                    <Choice
                      selected={drawShape === 'rectangle'}
                      icon={<Square />}
                      label='Rectangle'
                      onClick={() => setDrawShape('rectangle')}
                    />
                    <Choice
                      selected={drawShape === 'ellipsis'}
                      icon={<Circle />}
                      label='Ellipsis'
                      onClick={() => setDrawShape('ellipsis')}
                    />
                  </ChoiceRow>
                </Property>
                <Property>
                  <Label width={70}>Other:</Label>
                  <Checkbox
                    style={{ marginTop: '10px' }}
                    primary='Highlighter.'
                    value={drawHighlight}
                    onClick={() => setDrawHighlight(!drawHighlight)}
                  />
                </Property>
              </div>
            </Section>
          </>
        ) : (
          <>
            <Section height={200}>
              <div className='title'>
                <div className='text'>Eraser</div>
                <div className='divider' />
              </div>
              <div>
                <Property>
                  <Label width={70}>Width:</Label>
                  <NumberInput
                    width={80}
                    value={drawEraserWidth}
                    onChange={e => onDrawDimensionChange(e, 'eraser', 'width')}
                    onArrowUpClick={() => onDrawDimensionArrowClick('eraser', 'width', true)}
                    onArrowDownClick={() => onDrawDimensionArrowClick('eraser', 'width', false)}
                  />
                </Property>
                <Property>
                  <Label width={70}>Height:</Label>
                  <NumberInput
                    width={80}
                    value={drawEraserHeight}
                    onChange={e => onDrawDimensionChange(e, 'eraser', 'height')}
                    onArrowUpClick={() => onDrawDimensionArrowClick('eraser', 'height', true)}
                    onArrowDownClick={() => onDrawDimensionArrowClick('eraser', 'height', false)}
                  />
                </Property>
              </div>
            </Section>
          </>
        )}
      </Main>
      <Footer>
        <Button width={115} onClick={onAccept}>
          <Check />
          <div className='text'>Accept</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Close />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}
