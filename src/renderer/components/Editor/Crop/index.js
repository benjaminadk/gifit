import React, { useRef, useEffect } from 'react'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { Crop as CropIcon } from 'styled-icons/material/Crop'
import NumberInput from '../../Shared/NumberInput'
import { Preview } from './styles'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'

export default function Crop({
  drawerHeight,
  gifData,
  imagePath,
  cropWidth,
  cropHeight,
  cropX,
  cropY,
  setCropWidth,
  setCropHeight,
  setCropX,
  setCropY,
  onAccept,
  onCancel
}) {
  const canvas = useRef(null)

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    const ratio = cropWidth / cropHeight
    const inverse = cropHeight / cropWidth
    var width, height

    if (cropWidth > cropHeight) {
      width = 180
      height = width * inverse
    } else {
      height = 180
      width = height * ratio
    }

    canvas.current.width = width
    canvas.current.height = height

    const image = new Image()
    image.onload = () => {
      ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height)
    }
    image.src = imagePath
  }, [imagePath, cropWidth, cropHeight, cropX, cropY])

  return (
    <>
      <Header>
        <div className='left'>
          <CropIcon />
          <div className='text'>Crop</div>
        </div>
        <div className='right'>
          <Close onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={240}>
          <div className='title'>
            <div className='text'>Preview</div>
            <div className='divider' />
          </div>
          <div>
            <Preview>
              <canvas ref={canvas} />
              <div className='text'>
                {cropWidth} x {cropHeight}
              </div>
            </Preview>
          </div>
        </Section>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Points</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={70}>Width:</Label>
              <NumberInput
                width={100}
                value={cropWidth}
                max={gifData.width}
                min={100}
                fallback={gifData.width}
                setter={setCropWidth}
              />
            </Property>
            <Property>
              <Label width={70}>Height:</Label>
              <NumberInput
                width={100}
                value={cropHeight}
                max={gifData.height}
                min={100}
                fallback={gifData.height}
                setter={setCropHeight}
              />
            </Property>
            <Property>
              <Label width={70}>X:</Label>
              <NumberInput
                width={100}
                value={cropX}
                max={gifData.width - 100}
                min={0}
                fallback={0}
                setter={setCropX}
              />
            </Property>
            <Property>
              <Label width={70}>Y:</Label>
              <NumberInput
                width={100}
                value={cropY}
                max={gifData.height - 100}
                min={0}
                fallback={0}
                setter={setCropY}
              />
            </Property>
          </div>
        </Section>
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
