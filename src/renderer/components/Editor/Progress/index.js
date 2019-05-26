import React from 'react'
import { TextFields } from 'styled-icons/material/TextFields'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import ColorSwatch from '../../Shared/ColorSwatch'
import Select from '../../Shared/Select'
import Choice from '../../Shared/Choice'
import { Header, Main, Section, ChoiceRow, Property, Label, Footer, Button } from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { styleOptions, verticalOptions, horizontalOptions, orientationOptions, precisionOptions }
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
  progressPrecision,
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
  setProgressPrecision,
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

  function onProgressSizeChange({ target: { value } }) {
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
    setProgressSize(Number(newValue))
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='progress' />
          <div className='text'>Progress</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={60}>
          <div className='title'>
            <div className='text'>Type</div>
            <div className='divider' />
          </div>
          <div>
            <ChoiceRow>
              <Choice
                selected={progressType === 'bar'}
                icon={<Svg name='progress' />}
                label='Bar'
                onClick={() => setProgressType('bar')}
              />
              <Choice
                selected={progressType === 'text'}
                icon={<TextFields />}
                label='Text'
                onClick={() => setProgressType('text')}
              />
            </ChoiceRow>
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
                    min={1}
                    max={30}
                    fallback={30}
                    setter={setProgressThickness}
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
            <Section height={170}>
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
                  <NumberInput
                    width={80}
                    value={progressSize}
                    min={10}
                    max={200}
                    fallback={40}
                    setter={setProgressSize}
                  />
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
                <Property>
                  <Label width={70}>Precision:</Label>
                  <Select
                    width={100}
                    value={progressPrecision}
                    options={precisionOptions}
                    onClick={setProgressPrecision}
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
