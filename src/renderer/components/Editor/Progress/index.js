import React from 'react'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { RemoveFromQueue } from 'styled-icons/material/RemoveFromQueue'
import { TextFields } from 'styled-icons/material/TextFields'
import NumberInput from '../../Shared/NumberInput'
import ColorSwatch from '../../Shared/ColorSwatch'
import Select from '../../Shared/Select'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'
import { Choices, Choice } from './styles'
import config from 'common/config'

const {
  editor: { styleOptions, verticalOptions, horizontalOptions, orientationOptions }
} = config

export default function Progress({
  drawerHeight,
  fontOptions,
  progressType,
  progressBackground,
  progressThickness,
  progressVertical,
  progressHorizontal,
  progressOrientation,
  progressColor,
  progressSize,
  progressFont,
  progressStyle,
  setProgressType,
  setProgressBackground,
  setProgressThickness,
  setProgressVertical,
  setProgressHorizontal,
  setProgressOrientation,
  setProgressColor,
  setProgressSize,
  setProgressFont,
  setProgressStyle,
  onAccept,
  onCancel
}) {
  function onProgressThicknessChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 30) {
        newValue = 30
      } else {
        newValue = value
      }
    } else {
      newValue = 1
    }
    setProgressThickness(newValue)
  }

  function onProgressThicknessBlur({ target: { value } }) {
    if (!value) {
      setProgressThickness(1)
    }
  }

  function onProgressThicknessArrowClick(inc) {
    var newValue
    const currentValue = progressThickness
    if (inc) {
      if (currentValue < 30) {
        newValue = currentValue + 1
      } else {
        newValue = currentValue
      }
    } else {
      if (currentValue > 1) {
        newValue = currentValue - 1
      } else {
        newValue = currentValue
      }
    }
    setProgressThickness(newValue)
  }

  return (
    <>
      <Header>
        <div className='left'>
          <RemoveFromQueue />
          <div className='text'>Progress</div>
        </div>
        <div className='right'>
          <Close onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={60}>
          <div className='title'>
            <div className='text'>Type</div>
            <div className='divider' />
          </div>
          <div>
            <Choices>
              <Choice selected={progressType === 'bar'} onClick={() => setProgressType('bar')}>
                <RemoveFromQueue />
                <div>Bar</div>
              </Choice>
              <Choice selected={progressType === 'text'} onClick={() => setProgressType('text')}>
                <TextFields />
                <div>Text</div>
              </Choice>
            </Choices>
          </div>
        </Section>
        {progressType === 'bar' ? (
          <>
            <Section height={90}>
              <div className='title'>
                <div className='text'>Appearance</div>
                <div className='divider' />
              </div>
              <div>
                <Property>
                  <Label width={70}>Color:</Label>
                  <ColorSwatch
                    width={100}
                    color={progressBackground}
                    onChange={setProgressBackground}
                  />
                </Property>
                <Property>
                  <Label width={70}>Thickness:</Label>
                  <NumberInput
                    width={60}
                    value={progressThickness}
                    onChange={onProgressThicknessChange}
                    onBlur={onProgressThicknessBlur}
                    onArrowUpClick={() => onProgressThicknessArrowClick(true)}
                    onArrowDownClick={() => onProgressThicknessArrowClick(false)}
                  />
                </Property>
              </div>
            </Section>
            <Section height={200}>
              <div className='title'>
                <div className='text'>Layout</div>
                <div className='divider' />
              </div>
              <div>
                <Property>
                  <Label width={70}>Vertical:</Label>
                  <Select
                    width={100}
                    value={progressVertical}
                    options={verticalOptions}
                    onClick={setProgressVertical}
                  />
                </Property>
                <Property>
                  <Label width={70}>Horizontal:</Label>
                  <Select
                    width={100}
                    value={progressHorizontal}
                    options={horizontalOptions}
                    onClick={setProgressHorizontal}
                  />
                </Property>
                <Property>
                  <Label width={70}>Orientation:</Label>
                  <Select
                    width={100}
                    value={progressOrientation}
                    options={orientationOptions}
                    onClick={setProgressOrientation}
                  />
                </Property>
              </div>
            </Section>
          </>
        ) : (
          <>
            <Section height={200}>
              <div className='title'>
                <div className='text'>Font</div>
                <div className='divider' />
              </div>
              <div>
                <Property>
                  <Label width={70}>Family:</Label>
                  <Select
                    width={200}
                    type='family'
                    value={progressFont}
                    options={fontOptions}
                    onClick={setProgressFont}
                  />
                </Property>
                <Property>
                  <Label width={70}>Style:</Label>
                  <Select
                    width={100}
                    value={progressStyle}
                    options={styleOptions}
                    onClick={setProgressStyle}
                  />
                </Property>
                <Property>
                  <Label width={70}>Size:</Label>
                  <NumberInput width={80} value={progressSize} />
                </Property>
                <Property>
                  <Label width={70}>Color:</Label>
                  <ColorSwatch width={100} color={progressColor} onChange={setProgressColor} />
                </Property>
              </div>
            </Section>
            <Section height={100}>
              <div className='title'>
                <div className='text'>Appearance:</div>
                <div className='divider' />
              </div>
              <div>
                <Property>
                  <Label width={70}>Color:</Label>
                  <ColorSwatch
                    width={100}
                    color={progressBackground}
                    onChange={setProgressBackground}
                  />
                </Property>
              </div>
            </Section>
            <Section height={100}>
              <div className='title'>
                <div className='text'>Layout:</div>
                <div className='divider' />
              </div>
              <div>
                <Property>
                  <Label width={70}>Vertical:</Label>
                  <Select
                    width={100}
                    value={progressVertical}
                    options={verticalOptions}
                    onClick={setProgressVertical}
                  />
                </Property>
                <Property>
                  <Label width={70}>Horizontal:</Label>
                  <Select
                    width={100}
                    value={progressHorizontal}
                    options={horizontalOptions}
                    onClick={setProgressHorizontal}
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
