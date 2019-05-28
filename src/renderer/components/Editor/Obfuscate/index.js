import React from 'react'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import Checkbox from '../../Shared/Checkbox'
import { Header, Main, Section, Property, Label, Info, Footer, Button } from '../Drawer/styles'

export default function Obfuscate({
  drawerHeight,
  obfuscatePixels,
  obfuscateAverage,
  setObfuscatePixels,
  setObfuscateAverage,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='obfuscate' />
          <div className='text'>Obfuscate</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section>
          <div className='title'>
            <div className='text'>Obfuscation options</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={70}>Pixel size:</Label>
              <NumberInput
                width={80}
                value={obfuscatePixels}
                min={2}
                max={50}
                fallback={10}
                setter={setObfuscatePixels}
              />
            </Property>
            <Checkbox
              value={obfuscateAverage}
              primary='Calculate the average of each pixelated block.'
              onClick={() => setObfuscateAverage(!obfuscateAverage)}
            />
            <Info>
              <Svg name='info' />
              <div className='text'>
                Use the selection tool to select the rectangle that should be pixelated.
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
