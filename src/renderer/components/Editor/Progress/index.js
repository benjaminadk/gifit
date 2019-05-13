import React from 'react'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { RemoveFromQueue } from 'styled-icons/material/RemoveFromQueue'
import styled from 'styled-components'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'

export default function Progress({ drawerHeight, onAccept, onCancel }) {
  return (
    <>
      <Header>
        <div className='left'>
          <RemoveFromQueue />
          <div className='text'>Progress</div>
        </div>
        <div className='right'>
          <Close onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={50}>
          <div className='title'>
            <div className='text'>Type</div>
            <div className='divider' />
          </div>
          <div />
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
