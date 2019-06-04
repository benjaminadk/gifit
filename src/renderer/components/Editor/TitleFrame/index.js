import React, { useRef } from 'react'
import Svg from '../../Svg'
import ColorSwatch from '../../Shared/ColorSwatch'
import NumberInput from '../../Shared/NumberInput'
import Textarea from '../../Shared/Textarea'
import Select from '../../Shared/Select'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { drawerWidth, styleOptions, verticalOptions, horizontalOptions }
} = config

export default function TitleFrame({
  drawerHeight,
  fontOptions,
  titleText,
  titleDelay,
  titleSize,
  titleFont,
  titleStyle,
  titleColor,
  titleVertical,
  titleHorizontal,
  titleBackground,
  setTitleText,
  setTitleDelay,
  setTitleSize,
  setTitleFont,
  setTitleStyle,
  setTitleColor,
  setTitleVertical,
  setTitleHorizontal,
  setTitleBackground,
  onAccept,
  onCancel
}) {
  const textarea = useRef(null)

  function onTitleTextChange({ target: { value } }) {
    setTitleText(value)
  }

  function onTitleFontSelect(font) {
    setTitleFont(font)
  }

  function onTitleStyleSelect(style) {
    setTitleStyle(style)
  }

  function onTitleVerticalSelect(vertical) {
    setTitleVertical(vertical)
  }

  function onTitleHorizontalSelect(horizontal) {
    setTitleHorizontal(horizontal)
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='title-frame' />
          <div className='text'>Title Frame</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
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
        <Section height={170}>
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
                options={fontOptions}
                onClick={onTitleFontSelect}
              />
            </Property>
            <Property>
              <Label width={60}>Style:</Label>
              <Select
                width={100}
                value={titleStyle}
                options={styleOptions}
                onClick={onTitleStyleSelect}
              />
            </Property>
            <Property>
              <Label width={60}>Size:</Label>
              <NumberInput
                width={60}
                value={titleSize}
                min={10}
                max={200}
                fallback={40}
                setter={setTitleSize}
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
                min={100}
                max={25000}
                fallback={500}
                setter={setTitleDelay}
              />
            </Property>
          </div>
        </Section>
        <Section height={100}>
          <div className='title'>
            <div className='text'>Layout</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={70}>Vertical:</Label>
              <Select
                width={100}
                value={titleVertical}
                options={verticalOptions}
                onClick={onTitleVerticalSelect}
              />
            </Property>
            <Property>
              <Label width={70}>Horizontal:</Label>
              <Select
                width={100}
                value={titleHorizontal}
                options={horizontalOptions}
                onClick={onTitleHorizontalSelect}
              />
            </Property>
          </div>
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
          <Svg name='check' />
          <div className='text'>Apply</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Svg name='cancel' />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}
