import React, { useRef } from 'react'
import styled from 'styled-components'
import { TriangleLeft } from 'styled-icons/octicons/TriangleLeft'
import { TriangleRight } from 'styled-icons/octicons/TriangleRight'
import { TriangleUp } from 'styled-icons/octicons/TriangleUp'
import { TriangleDown } from 'styled-icons/octicons/TriangleDown'
import { BorderOuter } from 'styled-icons/material/BorderOuter'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import NumberInput from '../../Shared/NumberInput'
import { Header, Main, Section, Footer, Button } from '../Drawer/styles'

export const Property = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

export const Label = styled.div`
  width: ${p => p.width}px;
  font-size: 1.2rem;
  margin-left: 10px;
`

export const ColorSwatch = styled.div`
  width: ${p => p.width}px;
  height: 25px;
  background: ${p => p.color};
  outline: ${p => p.theme.border};
  cursor: pointer;
  &:hover {
    outline: 1px solid ${p => p.theme.primary};
  }
  input[type='color'] {
    display: none;
  }
`

export const ColorInputs = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 35px);
  .end {
    display: grid;
    align-items: center;
    margin-left: 30px;
  }
  .middle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }
`

export const ColorInput = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
  }
  .spacer {
    margin-right: 5px;
  }
`

export default function Border({
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
  const picker = useRef(null)

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
      <Main>
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
                onClick={() => picker.current.click()}
              >
                <input
                  ref={picker}
                  type='color'
                  onChange={e => setBorderColor(e.target.value)}
                />
              </ColorSwatch>
            </Property>
            <Property>
              <Label width={60}>Thickness:</Label>
              <ColorInputs>
                <div className='end'>
                  <ColorInput>
                    <TriangleUp className='spacer' />
                    <NumberInput
                      width={61}
                      value={borderTop}
                      onChange={e => onChange(e, 'top')}
                      onBlur={e => onBlur(e, 'top')}
                      onArrowUpClick={() => onArrowClick(true, 'top')}
                      onArrowDownClick={() => onArrowClick(false, 'top')}
                    />
                  </ColorInput>
                </div>
                <div className='middle'>
                  <ColorInput>
                    <TriangleLeft />
                    <NumberInput
                      width={61}
                      value={borderLeft}
                      onChange={e => onChange(e, 'left')}
                      onBlur={e => onBlur(e, 'left')}
                      onArrowUpClick={() => onArrowClick(true, 'left')}
                      onArrowDownClick={() => onArrowClick(false, 'left')}
                    />
                  </ColorInput>
                  <ColorInput>
                    <NumberInput
                      width={61}
                      value={borderRight}
                      onChange={e => onChange(e, 'right')}
                      onBlur={e => onBlur(e, 'right')}
                      onArrowUpClick={() => onArrowClick(true, 'right')}
                      onArrowDownClick={() => onArrowClick(false, 'right')}
                    />
                    <TriangleRight />
                  </ColorInput>
                </div>
                <div className='end'>
                  <ColorInput>
                    <TriangleDown className='spacer' />
                    <NumberInput
                      width={61}
                      value={borderBottom}
                      onChange={e => onChange(e, 'bottom')}
                      onBlur={e => onBlur(e, 'bottom')}
                      onArrowUpClick={() => onArrowClick(true, 'bottom')}
                      onArrowDownClick={() => onArrowClick(false, 'bottom')}
                    />
                  </ColorInput>
                </div>
              </ColorInputs>
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
