import React from 'react'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { Container, Layout, Header, Footer, Button } from './styles'

export default function Drawer({
  width = 300,
  show,
  icon,
  title,
  acceptText = 'Accept',
  cancelText = 'Cancel',
  children,
  onAccept,
  onCancel
}) {
  return (
    <Container show={show} width={width}>
      <Layout>
        <Header>
          <div className='left'>
            {icon}
            <div className='text'>{title}</div>
          </div>
          <div className='right'>
            <Close onClick={onCancel} />
          </div>
        </Header>
        {children}
        <Footer>
          <Button width={115} onClick={onAccept}>
            <Check />
            <div className='text'>{acceptText}</div>
          </Button>
          <Button width={115} onClick={onCancel}>
            <Close />
            <div className='text'>{cancelText}</div>
          </Button>
        </Footer>
      </Layout>
    </Container>
  )
}
