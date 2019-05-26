import React, { useEffect, useState } from 'react'
import { LockOutline } from 'styled-icons/material/LockOutline'
import { LockOpen } from 'styled-icons/material/LockOpen'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import Checkbox from '../../Shared/Checkbox'
import { Dimension, LockRatio } from './styles'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'

export default function Resize({ drawerHeight, gifData, onAccept, onCancel }) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [ratio, setRatio] = useState(0)
  const [inverse, setInverse] = useState(0)
  const [keepRatio, setKeepRatio] = useState(true)

  useEffect(() => {
    if (gifData) {
      const ratio = gifData.width / gifData.height
      const inverse = gifData.height / gifData.width
      setRatio(ratio)
      setInverse(inverse)
      setWidth(gifData.width)
      setHeight(gifData.height)
    }
  }, [gifData])

  function onWidthChange(x) {
    if (keepRatio) {
      setHeight(Math.round(x * inverse))
    }
    setWidth(x)
  }

  function onHeightChange(x) {
    if (keepRatio) {
      setWidth(Math.round(x * ratio))
    }
    setHeight(x)
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='scale' />
          <div className='text'>Resize</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={50}>
          <div className='title'>
            <div className='text'>Current Properties</div>
            <div className='divider' />
          </div>
          <div>
            <Dimension>
              {gifData.width} x {gifData.height}
            </Dimension>
          </div>
        </Section>
        <Section height={100}>
          <div className='title'>
            <div className='text'>New Properties</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={70}>Width:</Label>
              <NumberInput
                width={100}
                value={width}
                max={2000}
                min={100}
                fallback={gifData.width}
                setter={onWidthChange}
              />
            </Property>
            <Property>
              <Label width={70}>Height:</Label>
              <NumberInput
                width={100}
                value={height}
                max={2000}
                min={100}
                fallback={gifData.height}
                setter={onHeightChange}
              />
            </Property>
            <Checkbox
              value={keepRatio}
              primary='Keep the aspect ratio.'
              onClick={() => setKeepRatio(!keepRatio)}
            />
            <LockRatio>{keepRatio ? <LockOutline /> : <LockOpen />}</LockRatio>
          </div>
        </Section>
      </Main>
      <Footer>
        <Button width={115} onClick={() => onAccept(width, height)}>
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
