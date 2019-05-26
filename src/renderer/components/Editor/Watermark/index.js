import React from 'react'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'
import { Filename, FileInput, Percent } from './styles'

export default function Watermark({
  drawerHeight,
  watermarkPath,
  watermarkOpacity,
  watermarkScale,
  watermarkRealWidth,
  watermarkRealHeight,
  setWatermarkOpacity,
  setWatermarkScale,
  setWatermarkWidth,
  setWatermarkHeight,
  onWatermarkFileClick,
  onAccept,
  onCancel
}) {
  function onWatermarkOpacityChange(x) {
    setWatermarkOpacity(x / 100)
  }

  function onWatermarkScaleChange(x) {
    setWatermarkScale(x / 100)
    setWatermarkWidth(watermarkRealWidth * watermarkScale)
    setWatermarkHeight(watermarkRealHeight * watermarkScale)
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='title-frame' />
          <div className='text'>Watermark</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Image</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={30}>File:</Label>
              <Filename>{watermarkPath || 'No Image Selected'}</Filename>
            </Property>
            <FileInput>
              <div className='button' onClick={onWatermarkFileClick}>
                <Svg name='image' />
                <div className='text'>Select</div>
              </div>
            </FileInput>
            <Property>
              <Label width={60}>Opacity:</Label>
              <NumberInput
                width={80}
                value={Math.round(watermarkOpacity * 100)}
                max={100}
                min={1}
                fallback={70}
                setter={onWatermarkOpacityChange}
              />
              <Percent>%</Percent>
            </Property>
            <Property>
              <Label width={60}>Scale:</Label>
              <NumberInput
                width={80}
                value={Math.round(watermarkScale * 100)}
                max={200}
                min={1}
                fallback={100}
                setter={onWatermarkScaleChange}
              />
              <Percent>%</Percent>
            </Property>
          </div>
        </Section>
      </Main>
      <Footer>
        <Button width={115} onClick={onAccept}>
          <Svg name='check' />
          <div className='text'>Apply</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Svg name='cancel' />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}
