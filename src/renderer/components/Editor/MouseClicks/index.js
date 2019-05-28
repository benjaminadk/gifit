import React from 'react'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import ColorSwatch from '../../Shared/ColorSwatch'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'

export default function MouseClicks({
  drawerHeight,
  clicksColor,
  clicksWidth,
  clicksHeight,
  setClicksColor,
  setClicksWidth,
  setClicksHeight,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='cursor' />
          <div className='text'>Mouse Clicks</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Appearance</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={60}>Color:</Label>
              <ColorSwatch width={100} color={clicksColor + '80'} onChange={setClicksColor} />
            </Property>
            <Property>
              <Label width={60}>Width:</Label>
              <NumberInput
                width={80}
                value={clicksWidth}
                min={1}
                max={200}
                fallback={20}
                setter={setClicksWidth}
              />
            </Property>
            <Property>
              <Label width={60}>Height:</Label>
              <NumberInput
                width={80}
                value={clicksHeight}
                min={1}
                max={200}
                fallback={20}
                setter={setClicksHeight}
              />
            </Property>
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
