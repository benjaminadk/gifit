import React from 'react'
import Svg from '../../Svg'
import Choice from '../../Shared/Choice'
import { ChoiceColumn } from './styles'
import { Header, Main, Section, Footer, Button } from '../Drawer/styles'

export default function Flip({ drawerHeight, flipMode, setFlipMode, onAccept, onCancel }) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='flip-h' />
          <div className='text'>Flip/Rotate</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Flip/Rotate</div>
            <div className='divider' />
          </div>
          <div>
            <ChoiceColumn>
              <div className='row'>
                <Choice
                  selected={flipMode === 'horizontal'}
                  icon={<Svg name='flip-h' />}
                  label='Flip Horizonal'
                  onClick={() => setFlipMode('horizontal')}
                />
              </div>
              <div className='row'>
                <Choice
                  selected={flipMode === 'vertical'}
                  icon={<Svg name='flip-v' />}
                  label='Flip Vertical'
                  onClick={() => setFlipMode('vertical')}
                />
              </div>
              <div className='row'>
                <Choice
                  selected={flipMode === 'left'}
                  icon={<Svg name='rotate-l' />}
                  label='Rotate Left 90°'
                  onClick={() => setFlipMode('left')}
                />
              </div>
              <div className='row'>
                <Choice
                  selected={flipMode === 'right'}
                  icon={<Svg name='rotate-r' />}
                  label='Rotate Right 90°'
                  onClick={() => setFlipMode('right')}
                />
              </div>
            </ChoiceColumn>
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
