import React from 'react'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import ColorSwatch from '../../Shared/ColorSwatch'
import Choice from '../../Shared/Choice'
import { ShapeOption, Shapes } from './styles'
import { Header, Main, Section, ChoiceRow, Property, Label, Footer, Button } from '../Drawer/styles'

export default function Shape({
  drawerHeight,
  shapeMode,
  shapeType,
  shapeStrokeWidth,
  shapeStrokeColor,
  shapeFillColor,
  setShapeMode,
  setShapeType,
  setShapeStrokeWidth,
  setShapeStrokeColor,
  setShapeFillColor,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='shape' />
          <div className='text'>Shape</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={60}>
          <div className='title'>
            <div className='text'>Mode</div>
            <div className='divider' />
          </div>
          <div>
            <ChoiceRow>
              <Choice
                selected={shapeMode === 'insert'}
                icon={<Svg name='insert' />}
                label='Insert'
                onClick={() => setShapeMode('insert')}
              />
              <Choice
                selected={shapeMode === 'select'}
                icon={<Svg name='select' />}
                label='Select'
                onClick={() => setShapeMode('select')}
              />
            </ChoiceRow>
          </div>
        </Section>
        {shapeMode === 'insert' && (
          <>
            <Section height={70}>
              <div className='title'>
                <div className='text'>Shapes</div>
                <div className='divider' />
              </div>
              <div>
                <Shapes>
                  <ShapeOption
                    selected={shapeType === 'rectangle'}
                    onClick={() => setShapeType('rectangle')}
                  >
                    <Svg name='rectangle' />
                  </ShapeOption>
                  <ShapeOption
                    selected={shapeType === 'ellipsis'}
                    onClick={() => setShapeType('ellipsis')}
                  >
                    <Svg name='shape' />
                  </ShapeOption>
                </Shapes>
              </div>
            </Section>
          </>
        )}
        <>
          <Section height={100}>
            <div className='title'>
              <div className='text'>Outline</div>
              <div className='divider' />
            </div>
            <div>
              <Property>
                <Label width={70}>Thickness:</Label>
                <NumberInput
                  width={60}
                  value={shapeStrokeWidth}
                  min={1}
                  max={100}
                  fallback={10}
                  setter={setShapeStrokeWidth}
                />
              </Property>
              <Property>
                <Label width={70}>Color:</Label>
                <ColorSwatch width={100} color={shapeStrokeColor} onChange={setShapeStrokeColor} />
              </Property>
            </div>
          </Section>
          <Section height={50}>
            <div className='title'>
              <div className='text'>Fill</div>
              <div className='divider' />
            </div>
            <div>
              <Property>
                <Label width={70}>Color:</Label>
                <ColorSwatch width={100} color={shapeFillColor} onChange={setShapeFillColor} />
              </Property>
            </div>
          </Section>
        </>
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
