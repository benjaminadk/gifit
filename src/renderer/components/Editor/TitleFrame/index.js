import React, { useRef, useEffect, useState } from 'react'
import SystemFonts from 'system-font-families'
import { Title } from 'styled-icons/material/Title'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import ColorSwatch from '../../Shared/ColorSwatch'
import NumberInput from '../../Shared/NumberInput'
import Textarea from '../../Shared/Textarea'
import Select from '../../Shared/Select'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { drawerWidth, titleStyles }
} = config

export default function TitleFrame({
  drawerHeight,
  titleText,
  titleDelay,
  titleSize,
  titleFont,
  titleStyle,
  titleColor,
  titleBackground,
  setTitleText,
  setTitleDelay,
  setTitleSize,
  setTitleFont,
  setTitleStyle,
  setTitleColor,
  setTitleBackground,
  onAccept,
  onCancel
}) {
  const [fontFamilies, setFontFamilies] = useState([])

  const textarea = useRef(null)

  useEffect(() => {
    const systemFonts = new SystemFonts()
    systemFonts.getFonts().then(res => setFontFamilies(res))
  }, [])

  function onTitleTextChange({ target: { value } }) {
    setTitleText(value)
  }

  function onTitleFontSelect(font) {
    setTitleFont(font)
  }

  function onTitleStyleSelect(style) {
    setTitleStyle(style)
  }

  function onTitleSizeChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 200) {
        newValue = 200
      } else {
        newValue = value
      }
    } else {
      newValue = 40
    }
    setTitleSize(newValue)
  }

  function onTitleSizeBlur({ target: { value } }) {
    var newValue
    if (Number(value) < 10) {
      newValue = 10
    } else {
      newValue = value
    }
    setTitleSize(newValue)
  }

  function onTitleDelayChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 10000) {
        newValue = 10000
      } else {
        newValue = value
      }
    } else {
      newValue = 500
    }
    setTitleDelay(newValue)
  }

  function onTitleDelayBlur({ target: { value } }) {
    var newValue
    if (Number(value) < 100) {
      newValue = 100
    } else {
      newValue = value
    }
    setTitleDelay(newValue)
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
      if (currentValue > 100) {
        newValue = currentValue - 1
      } else {
        newValue = 100
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
        <Section height={40 + (textarea.current ? textarea.current.clientHeight : 23)}>
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
          <div>
            <Property>
              <Label width={60}>Family:</Label>
              <Select
                width={200}
                type='family'
                value={titleFont}
                options={fontFamilies}
                onClick={onTitleFontSelect}
              />
            </Property>
            <Property>
              <Label width={60}>Style:</Label>
              <Select
                width={100}
                type='style'
                value={titleStyle}
                options={titleStyles}
                onClick={onTitleStyleSelect}
              />
            </Property>
            <Property>
              <Label width={60}>Size:</Label>
              <NumberInput
                width={60}
                value={titleSize}
                onChange={onTitleSizeChange}
                onBlur={onTitleSizeBlur}
              />
            </Property>
            <Property>
              <Label width={60}>Color:</Label>
              <ColorSwatch width={100} color={titleColor} onChange={setTitleColor} />
            </Property>
          </div>
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
              <ColorSwatch width={100} color={titleBackground} onChange={setTitleBackground} />
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
