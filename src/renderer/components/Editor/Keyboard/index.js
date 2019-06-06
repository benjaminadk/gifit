import React from 'react'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import Select from '../../Shared/Select'
import ColorSwatch from '../../Shared/ColorSwatch'
import Checkbox from '../../Shared/Checkbox'
import { KeyStrokes } from './styles'
import { Header, Main, Section, Property, Label, PostLabel, Footer, Button } from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { styleOptions, horizontalOptions, verticalOptions }
} = config

export default function Keyboard({
  drawerHeight,
  fontOptions,
  keyboardExtend,
  keyboardExtendTime,
  keyboardFont,
  keyboardColor,
  keyboardSize,
  keyboardStyle,
  keyboardBackground,
  keyboardHorizontal,
  keyboardVertical,
  setKeyboardExtend,
  setKeyboardExtendTime,
  setKeyboardFont,
  setKeyboardColor,
  setKeyboardSize,
  setKeyboardStyle,
  setKeyboardBackground,
  setKeyboardHorizontal,
  setKeyboardVertical,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='keyboard' />
          <div className='text'>Key Strokes</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Keys</div>
            <div className='divider' />
          </div>
          <div>
            <KeyStrokes>
              <div className='button'>
                <Svg name='pen' />
                <div className='text'>Edit your key strokes</div>
              </div>
            </KeyStrokes>
            <Checkbox
              value={keyboardExtend}
              primary='Extend the exhibition of key strokes'
              style={{ paddingLeft: '5px' }}
              onClick={() => setKeyboardExtend(!keyboardExtend)}
            />
            {keyboardExtend && (
              <Property>
                <Label width={40}>&nbsp;&nbsp;&nbsp;&nbsp;By:</Label>
                <NumberInput
                  width={80}
                  value={keyboardExtendTime}
                  max={1000}
                  min={10}
                  fallback={500}
                  setter={setKeyboardExtendTime}
                />
                <PostLabel>ms</PostLabel>
              </Property>
            )}
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
                value={keyboardFont}
                options={fontOptions}
                onClick={setKeyboardFont}
              />
            </Property>
            <Property>
              <Label width={60}>Style:</Label>
              <Select
                width={100}
                value={keyboardStyle}
                options={styleOptions}
                onClick={setKeyboardStyle}
              />
            </Property>
            <Property>
              <Label width={60}>Size:</Label>
              <NumberInput
                width={60}
                value={keyboardSize}
                min={10}
                max={200}
                fallback={40}
                setter={setKeyboardSize}
              />
            </Property>
            <Property>
              <Label width={60}>Color:</Label>
              <ColorSwatch width={100} color={keyboardColor} onChange={setKeyboardColor} />
            </Property>
            <Section height={200}>
              <div className='title'>
                <div className='text'>Layout</div>
                <div className='divider' />
              </div>
              <div>
                <Property>
                  <Label width={70}>Background:</Label>
                  <ColorSwatch
                    width={100}
                    color={keyboardBackground}
                    onChange={setKeyboardBackground}
                  />
                </Property>
                <Property>
                  <Label width={70}>Vertical:</Label>
                  <Select
                    width={100}
                    value={keyboardVertical}
                    options={verticalOptions}
                    onClick={setKeyboardVertical}
                  />
                </Property>
                <Property>
                  <Label width={70}>Horizontal:</Label>
                  <Select
                    width={100}
                    value={keyboardHorizontal}
                    options={horizontalOptions}
                    onClick={setKeyboardHorizontal}
                  />
                </Property>
              </div>
            </Section>
          </div>
        </Section>
      </Main>
      <Footer>
        <Button width={115} onClick={onAccept}>
          <Svg name='check' />
          <div className='text'>Accept</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Svg name='cancel' />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}
