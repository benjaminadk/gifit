import React from 'react'
import { TriangleLeft } from 'styled-icons/octicons/TriangleLeft'
import { TriangleRight } from 'styled-icons/octicons/TriangleRight'
import { TriangleUp } from 'styled-icons/octicons/TriangleUp'
import { TriangleDown } from 'styled-icons/octicons/TriangleDown'
import { BorderOuter } from 'styled-icons/material/BorderOuter'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import NumberInput from '../../Shared/NumberInput'
import ColorSwatch from '../../Shared/ColorSwatch'
import {
  Header,
  Main,
  Section,
  Property,
  Label,
  Footer,
  Button
} from '../Drawer/styles'
import { BorderInputs, BorderInput } from './styles'

export default function Border({
  drawerHeight,
  borderLeft,
  borderRight,
  borderTop,
  borderBottom,
  borderColor,
  setBorderLeft,
  setBorderRight,
  setBorderTop,
  setBorderBottom,
  setBorderColor,
  onAccept,
  onCancel
}) {
  function onChange({ target: { value } }, dimension) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 10) {
        newValue = 10
      } else {
        newValue = value
      }
    } else {
      newValue = 0
    }
    switch (dimension) {
      case 'left':
        return setBorderLeft(newValue)
      case 'right':
        return setBorderRight(newValue)
      case 'top':
        return setBorderTop(newValue)
      case 'bottom':
        return setBorderBottom(newValue)
      default:
        throw Error()
    }
  }

  function onBlur({ target: { value } }, dimension) {
    if (value === '') {
      switch (dimension) {
        case 'left':
          return setBorderLeft(0)
        case 'right':
          return setBorderRight(0)
        case 'top':
          return setBorderTop(0)
        case 'bottom':
          return setBorderBottom(0)
        default:
          throw Error()
      }
    }
  }

  function onArrowClick(inc, dimension) {
    var currentValue
    switch (dimension) {
      case 'left':
        currentValue = borderLeft
        break
      case 'right':
        currentValue = borderRight
        break
      case 'top':
        currentValue = borderTop
        break
      case 'bottom':
        currentValue = borderBottom
        break
      default:
        throw Error()
    }
    var newValue
    if (inc) {
      if (currentValue < 10) {
        newValue = currentValue + 1
      } else {
        newValue = 10
      }
    } else {
      if (currentValue > 0) {
        newValue = currentValue - 1
      } else {
        newValue = 0
      }
    }
    switch (dimension) {
      case 'left':
        return setBorderLeft(newValue)
      case 'right':
        return setBorderRight(newValue)
      case 'top':
        return setBorderTop(newValue)
      case 'bottom':
        return setBorderBottom(newValue)
      default:
        throw Error()
    }
  }

  return (
    <>
      <Header>
        <div className='left'>
          <BorderOuter />
          <div className='text'>Border</div>
        </div>
        <div className='right'>
          <Close onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Appearance</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={60}>Color:</Label>
              <ColorSwatch
                width={160}
                color={borderColor}
                onChange={setBorderColor}
              />
            </Property>
            <Property>
              <Label width={60}>Thickness:</Label>
              <BorderInputs>
                <div className='end'>
                  <BorderInput>
                    <TriangleUp className='spacer' />
                    <NumberInput
                      width={61}
                      value={borderTop}
                      onChange={e => onChange(e, 'top')}
                      onBlur={e => onBlur(e, 'top')}
                      onArrowUpClick={() => onArrowClick(true, 'top')}
                      onArrowDownClick={() => onArrowClick(false, 'top')}
                    />
                  </BorderInput>
                </div>
                <div className='middle'>
                  <BorderInput>
                    <TriangleLeft />
                    <NumberInput
                      width={61}
                      value={borderLeft}
                      onChange={e => onChange(e, 'left')}
                      onBlur={e => onBlur(e, 'left')}
                      onArrowUpClick={() => onArrowClick(true, 'left')}
                      onArrowDownClick={() => onArrowClick(false, 'left')}
                    />
                  </BorderInput>
                  <BorderInput>
                    <NumberInput
                      width={61}
                      value={borderRight}
                      onChange={e => onChange(e, 'right')}
                      onBlur={e => onBlur(e, 'right')}
                      onArrowUpClick={() => onArrowClick(true, 'right')}
                      onArrowDownClick={() => onArrowClick(false, 'right')}
                    />
                    <TriangleRight />
                  </BorderInput>
                </div>
                <div className='end'>
                  <BorderInput>
                    <TriangleDown className='spacer' />
                    <NumberInput
                      width={61}
                      value={borderBottom}
                      onChange={e => onChange(e, 'bottom')}
                      onBlur={e => onBlur(e, 'bottom')}
                      onArrowUpClick={() => onArrowClick(true, 'bottom')}
                      onArrowDownClick={() => onArrowClick(false, 'bottom')}
                    />
                  </BorderInput>
                </div>
              </BorderInputs>
            </Property>
          </div>
        </Section>
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
