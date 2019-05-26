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

export default function Override({ drawerHeight, overrideMS, setOverrideMS, onAccept, onCancel }) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='clock-override' />
          <div className='text'>Override</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>New Value</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={60}>Delay:</Label>
              <NumberInput
                width={80}
                value={overrideMS}
                min={10}
                max={25000}
                fallback={100}
                setter={setOverrideMS}
              />
              <PostLabel>ms</PostLabel>
            </Property>
            <Info>
              <Svg name='info' />
              <div className='text'>
                This is the new value will replace the duration (delay) of all selected frames. The
                value can be from 10ms to 25000ms.
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
