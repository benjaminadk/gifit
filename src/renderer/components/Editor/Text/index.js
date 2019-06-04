import React, { useRef } from 'react'
import Svg from '../../Svg'
import ColorSwatch from '../../Shared/ColorSwatch'
import NumberInput from '../../Shared/NumberInput'
import Textarea from '../../Shared/Textarea'
import Select from '../../Shared/Select'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { drawerWidth, styleOptions }
} = config

export default function Text({
  drawerHeight,
  gifData,
  fontOptions,
  textText,
  textFont,
  textStyle,
  textSize,
  textColor,
  textX,
  textY,
  setTextText,
  setTextFont,
  setTextStyle,
  setTextSize,
  setTextColor,
  textWidth,
  textHeight,
  setTextX,
  setTextY,
  onAccept,
  onCancel
}) {
  const textarea = useRef(null)

  function onTextTextChange({ target: { value } }) {
    setTextText(value)
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='text' />
          <div className='text'>Free Text</div>
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
              value={textText}
              onChange={onTextTextChange}
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
                value={textFont}
                options={fontOptions}
                onClick={setTextFont}
              />
            </Property>
            <Property>
              <Label width={60}>Style:</Label>
              <Select width={100} value={textStyle} options={styleOptions} onClick={setTextStyle} />
            </Property>
            <Property>
              <Label width={60}>Size:</Label>
              <NumberInput
                width={60}
                value={textSize}
                min={10}
                max={200}
                fallback={40}
                setter={setTextSize}
              />
            </Property>
            <Property>
              <Label width={60}>Color:</Label>
              <ColorSwatch width={100} color={textColor} onChange={setTextColor} />
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
              <Label width={70}>Top:</Label>
              <NumberInput
                width={100}
                value={textY}
                max={gifData.height - textHeight}
                min={0}
                fallback={0}
                setter={setTextY}
              />
            </Property>
            <Property>
              <Label width={70}>Left:</Label>
              <NumberInput
                width={100}
                value={textX}
                max={gifData.width - textWidth}
                min={0}
                fallback={0}
                setter={setTextX}
              />
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
