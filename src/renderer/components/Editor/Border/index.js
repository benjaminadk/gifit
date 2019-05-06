import React from 'react'
import styled from 'styled-components'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { BorderOuter } from 'styled-icons/material/BorderOuter'
import NumberInput from '../../Shared/NumberInput'

export const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 40px 1fr 50px;
`

export const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr;
  .left {
    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
    }
    .text {
      font-size: 1.2rem;
    }
  }
  .right {
    display: grid;
    justify-items: flex-end;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
    }
  }
`

export const Main = styled.main`
  padding-top: 5px;
`

export const Section = styled.div`
  height: ${p => p.height}px;
  display: grid;
  grid-template-rows: 20px 1fr;
  .title {
    display: flex;
    .text {
      font-size: 1.2rem;
      margin-left: 3px;
      margin-right: 3px;
    }
    .divider {
      width: 100%;
      height: 1px;
      background: ${p => p.theme.grey[2]};
      margin-top: 7px;
    }
  }
`

export const Footer = styled.footer`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
`

export const Button = styled.div`
  width: ${p => p.width}px;
  height: 40px;
  display: grid;
  grid-template-columns: 30px 1fr;
  justify-items: center;
  align-items: center;
  border: ${p => p.theme.border};
  svg {
    width: 25px;
    height: 25px;
  }
  .text {
    font-size: 1.2rem;
  }
`

export default function Border({ borderLeft, setBorderLeft, onClose }) {
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
    var currentValue = dimension === 'left' ? borderLeft : 0
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
      default:
        throw Error()
    }
  }

  return (
    <Container>
      <Header>
        <div className='left'>
          <BorderOuter />
          <div className='text'>Border</div>
        </div>
        <div className='right'>
          <Close onClick={onClose} />
        </div>
      </Header>
      <Main>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Appearance</div>
            <div className='divider' />
          </div>
          <div>
            <NumberInput
              width={61}
              value={borderLeft}
              onChange={e => onChange(e, 'left')}
              onBlur={e => onBlur(e, 'left')}
              onArrowUpClick={() => onArrowClick(true, 'left')}
              onArrowDownClick={() => onArrowClick(false, 'left')}
            />
          </div>
        </Section>
      </Main>
      <Footer>
        <Button width={115}>
          <Check />
          <div className='text'>Accept</div>
        </Button>
        <Button width={115} onClick={onClose}>
          <Close />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </Container>
  )
}
