import React from 'react'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import {
  Header,
  Main,
  Section,
  Property,
  Label,
  PostLabel,
  Info,
  Footer,
  Button
} from '../Drawer/styles'

export default function IncreaseDecrease({
  drawerHeight,
  incDecValue,
  setIncDecValue,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='clock-increase' />
          <div className='text'>Increase or Decrease</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Increase/Decrease Value</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={60}>Value -+:</Label>
              <NumberInput
                width={80}
                value={incDecValue}
                min={-10000}
                max={10000}
                fallback={0}
                setter={setIncDecValue}
              />
              <PostLabel>ms</PostLabel>
            </Property>
            <Info>
              <Svg name='info' />
              <div className='text'>
                This value will increase/decrease the duration (delay) of each selected frame. You
                can decrement/increment by selecting a value between -10000ms and 10000ms, but the
                final duration of each frame will be restricted to between 10ms and 25000ms.
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
