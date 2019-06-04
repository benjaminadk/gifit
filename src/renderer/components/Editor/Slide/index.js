import React from 'react'
import NumberInput from '../../Shared/NumberInput'
import RangeInput from '../../Shared/RangeInput'
import Svg from '../../Svg'
import { Header, Main, Section, Property, Label, Info, Footer, Button } from '../Drawer/styles'

export default function Slide({
  drawerHeight,
  slideLength,
  slideDelay,
  setSlideLength,
  setSlideDelay,
  onAccept,
  onCancel
}) {
  function onSlideLengthChange(values) {
    setSlideLength(values[0])
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='slide' />
          <div className='text'>Slide Transition</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={100}>
          <div className='title'>
            <div className='text'>Transition Length</div>
            <div className='divider' />
          </div>
          <div>
            <RangeInput
              domain={[1, 20]}
              values={[slideLength]}
              tickCount={20}
              onChange={onSlideLengthChange}
            />
          </div>
        </Section>
        <Section height={100}>
          <div className='title'>
            <div className='text'>Transition Delay</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={70}>Delay:</Label>
              <NumberInput
                width={100}
                value={slideDelay}
                max={25000}
                min={10}
                fallback={100}
                setter={setSlideDelay}
              />
            </Property>
            <Info>
              <Svg name='info' />
              <div className='text'>
                The transition will be applied between the selected frame and the next one.
              </div>
            </Info>
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
