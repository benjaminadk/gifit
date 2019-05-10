import React, { useRef } from 'react'
import { Title } from 'styled-icons/material/Title'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import ColorSwatch from '../../Shared/ColorSwatch'
import NumberInput from '../../Shared/NumberInput'
import Textarea from '../../Shared/Textarea'
import {
  Header,
  Main,
  Section,
  Property,
  Label,
  Footer,
  Button
} from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { drawerWidth }
} = config

export default function TitleFrame({
  drawerHeight,
  titleText,
  titleDelay,
  titleBackground,
  setTitleText,
  setTitleDelay,
  setTitleBackground,
  onAccept,
  onCancel
}) {
  const textarea = useRef(null)

  function onTitleTextChange({ target: { value } }) {
    setTitleText(value)
  }

  function onTitleDelayChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 10000) {
        newValue = 10000
      } else if (Number(value) < 10) {
        newValue = 10
      } else {
        newValue = value
      }
    } else {
      newValue = 500
    }
    setTitleDelay(newValue)
  }

  function onTitleDelayBlur({ target: { value } }) {
    if ((value = '')) {
      setTitleDelay(500)
    }
  }

  function onTitleDelayArrowClick(inc) {
    var currentValue = titleDelay
    var newValue
    if (inc) {
      if (currentValue < 10000) {
        newValue = currentValue + 1
      } else {
        newValue = 10000
      }
    } else {
      if (currentValue > 10) {
        newValue = currentValue - 1
      } else {
        newValue = 10
      }
    }
    setTitleDelay(newValue)
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Title />
          <div className='text'>Title Frame</div>
        </div>
        <div className='right'>
          <Close onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={50}>
          <div className='title'>
            <div className='text'>Text</div>
            <div className='divider' />
          </div>
          <div>
            <Textarea
              textarea={textarea}
              width={drawerWidth - 50}
              value={titleText}
              onChange={onTitleTextChange}
            />
          </div>
        </Section>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Font</div>
            <div className='divider' />
          </div>
          <div>select font</div>
        </Section>
        <Section height={50}>
          <div className='title'>
            <div className='text'>Delay</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={60}>Delay:</Label>
              <NumberInput
                width={80}
                value={titleDelay}
                onChange={onTitleDelayChange}
                onBlur={onTitleDelayBlur}
                onArrowUpClick={() => onTitleDelayArrowClick(true)}
                onArrowDownClick={() => onTitleDelayArrowClick(false)}
              />
            </Property>
          </div>
        </Section>
        <Section height={100}>
          <div className='title'>
            <div className='text'>Layout</div>
            <div className='divider' />
          </div>
          <div>input</div>
        </Section>
        <Section height={50}>
          <div className='title'>
            <div className='text'>Background</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={60}>Color:</Label>
              <ColorSwatch
                width={100}
                color={titleBackground}
                onChange={setTitleBackground}
              />
            </Property>
          </div>
        </Section>
      </Main>
      <Footer>
        <Button width={115} onClick={onAccept}>
          <Check />
          <div className='text'>Apply</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Close />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}
