import React from 'react'
import { TriangleLeft } from 'styled-icons/octicons/TriangleLeft'
import { TriangleRight } from 'styled-icons/octicons/TriangleRight'
import { TriangleUp } from 'styled-icons/octicons/TriangleUp'
import { TriangleDown } from 'styled-icons/octicons/TriangleDown'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import ColorSwatch from '../../Shared/ColorSwatch'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'
import { BorderInputs, BorderInput } from './styles'

export default function Border({
  drawerHeight,
  borderLeft,
  borderRight,
  borderTop,
  borderBottom,
  borderColor,
  setBorderLeft,
  setBorderRight,
  setBorderTop,
  setBorderBottom,
  setBorderColor,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='border' />
          <div className='text'>Border</div>
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
              <ColorSwatch width={160} color={borderColor} onChange={setBorderColor} />
            </Property>
            <Property>
              <Label width={60}>Thickness:</Label>
              <BorderInputs>
                <div className='end'>
                  <BorderInput>
                    <TriangleUp className='spacer' />
                    <NumberInput
                      width={61}
                      value={borderTop}
                      min={0}
                      max={10}
                      fallback={0}
                      setter={setBorderTop}
                    />
                  </BorderInput>
                </div>
                <div className='middle'>
                  <BorderInput>
                    <TriangleLeft />
                    <NumberInput
                      width={61}
                      value={borderLeft}
                      min={0}
                      max={10}
                      fallback={0}
                      setter={setBorderLeft}
                    />
                  </BorderInput>
                  <BorderInput>
                    <NumberInput
                      width={61}
                      value={borderRight}
                      min={0}
                      max={10}
                      fallback={0}
                      setter={setBorderRight}
                    />
                    <TriangleRight />
                  </BorderInput>
                </div>
                <div className='end'>
                  <BorderInput>
                    <TriangleDown className='spacer' />
                    <NumberInput
                      width={61}
                      value={borderBottom}
                      min={0}
                      max={10}
                      fallback={0}
                      setter={setBorderBottom}
                    />
                  </BorderInput>
                </div>
              </BorderInputs>
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
