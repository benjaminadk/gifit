import React from 'react'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import {
  Header,
  Main,
  Section,
  Info,
  Property,
  Label,
  PostLabel,
  Footer,
  Button
} from '../Drawer/styles'

export default function Scale({ drawerHeight, scalePercent, setScalePercent, onAccept, onCancel }) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='clock-scale' />
          <div className='text'>Scale</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Scale Value</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={70}>Scale value:</Label>
              <NumberInput
                width={80}
                value={scalePercent}
                max={1000}
                min={1}
                fallback={100}
                setter={setScalePercent}
              />
              <PostLabel>%</PostLabel>
            </Property>
            <Info>
              <Svg name='info' />
              <div className='text'>
                Scale the duration (delay) of each selected frame by the percent value. You can
                scale each frames duration by selecting a value between 1% and 1000%, but the final
                duration of each frame will be restricted to between 10ms and 25000ms.
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
