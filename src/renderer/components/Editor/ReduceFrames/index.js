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

export default function ReduceFrames({
  drawerHeight,
  reduceFactor,
  reduceCount,
  setReduceFactor,
  setReduceCount,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='delete' />
          <div className='text'>Reduce Frame Count</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Reduce Framerate</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={100}>Factor:</Label>
              <NumberInput
                width={80}
                value={reduceFactor}
                min={1}
                max={20}
                fallback={1}
                setter={setReduceFactor}
              />
            </Property>
            <Property>
              <Label width={100}>Remove Count:</Label>
              <NumberInput
                width={80}
                value={reduceCount}
                min={1}
                max={20}
                fallback={1}
                setter={setReduceCount}
              />
            </Property>
            <Info>
              <Svg name='info' />
              <div className='text'>
                It will remove {reduceCount} frame(s) after every {reduceFactor} frame(s), without
                counting the removed ones. Framerate will be adjusted.
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
