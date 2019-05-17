import React from 'react'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { PenFancy } from 'styled-icons/fa-solid/PenFancy'
import { PenNib } from 'styled-icons/fa-solid/PenNib'
import { Eraser } from 'styled-icons/boxicons-solid/Eraser'
import Choice from '../../Shared/Choice'
import { Header, Main, Section, ChoiceRow, Property, Label, Footer, Button } from '../Drawer/styles'

export default function FreeDrawing({ drawerHeight, drawType, setDrawType, onAccept, onCancel }) {
  return (
    <>
      <Header>
        <div className='left'>
          <PenFancy />
          <div className='text'>Free Drawing</div>
        </div>
        <div className='right'>
          <Close onClick={onCancel} />
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
                selected={drawType === 'pen'}
                icon={<PenNib />}
                label='Pen'
                onClick={() => setDrawType('pen')}
              />
              <Choice
                selected={drawType === 'eraser'}
                icon={<Eraser />}
                label='Eraser'
                onClick={() => setDrawType('eraser')}
              />
            </ChoiceRow>
          </div>
        </Section>
        {drawType === 'pen' ? (
          <>
            <Section height={200}>
              <div className='title'>
                <div className='text'>Pen</div>
                <div className='divider' />
              </div>
            </Section>
          </>
        ) : (
          <>
            <Section height={200}>
              <div className='title'>
                <div className='text'>Eraser</div>
                <div className='divider' />
              </div>
            </Section>
          </>
        )}
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
