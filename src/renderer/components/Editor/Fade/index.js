import React from 'react'
import NumberInput from '../../Shared/NumberInput'
import RangeInput from '../../Shared/RangeInput'
import ColorSwatch from '../../Shared/ColorSwatch'
import Choice from '../../Shared/Choice'
import Svg from '../../Svg'
import {
  Header,
  Main,
  Section,
  ChoiceRow,
  Property,
  Label,
  Info,
  Footer,
  Button
} from '../Drawer/styles'

export default function Fade({
  drawerHeight,
  fadeOption,
  fadeLength,
  fadeDelay,
  fadeColor,
  setFadeOption,
  setFadeLength,
  setFadeDelay,
  setFadeColor,
  onAccept,
  onCancel
}) {
  function onFadeLengthChange(values) {
    setFadeLength(values[0])
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='fade' />
          <div className='text'>Fade Transition</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={60}>
          <div className='title'>
            <div className='text'>Fade To...</div>
            <div className='divider' />
          </div>
          <div>
            <ChoiceRow>
              <Choice
                selected={fadeOption === 'frame'}
                icon={<Svg name='image' />}
                label='Next frame'
                onClick={() => setFadeOption('frame')}
              />
              <Choice
                selected={fadeOption === 'color'}
                icon={<Svg name='color' />}
                label='Color'
                onClick={() => setFadeOption('color')}
              />
            </ChoiceRow>
          </div>
        </Section>
        {fadeOption === 'color' && (
          <Section height={60}>
            <div className='title'>
              <div className='text'>Color</div>
              <div className='divider' />
            </div>
            <div>
              <Property>
                <Label width={70}>Color:</Label>
                <ColorSwatch width={60} color={fadeColor} onChange={setFadeColor} />
              </Property>
            </div>
          </Section>
        )}
        <Section height={100}>
          <div className='title'>
            <div className='text'>Transition Length</div>
            <div className='divider' />
          </div>
          <div>
            <RangeInput
              domain={[1, 25]}
              values={[fadeLength]}
              tickCount={25}
              onChange={onFadeLengthChange}
            />
          </div>
        </Section>
        <Section height={100}>
          <div className='title'>
            <div className='text'>Transition Delay</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={70}>Delay:</Label>
              <NumberInput
                width={100}
                value={fadeDelay}
                max={25000}
                min={10}
                fallback={100}
                setter={setFadeDelay}
              />
            </Property>
            <Info>
              <Svg name='info' />
              <div className='text'>
                The transition will be applied between the selected frame and the next one.
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
