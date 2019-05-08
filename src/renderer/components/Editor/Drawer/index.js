import React from 'react'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { BorderOuter } from 'styled-icons/material/BorderOuter'
import { FileArchive } from 'styled-icons/fa-solid/FileArchive'
import { Container, Layout, Header, Footer, Button } from './styles'

export default function Drawer({
  width = 300,
  show,
  drawerMode,
  acceptText = 'Accept',
  cancelText = 'Cancel',
  children,
  onBorderAccept,
  onBorderCancel
}) {
  const icon =
    drawerMode === 1 ? (
      <BorderOuter />
    ) : drawerMode === 2 ? (
      <FileArchive />
    ) : null

  const title =
    drawerMode === 1 ? 'Border' : drawerMode === 2 ? 'Recent Projects' : null

  const onAccept = drawerMode === 1 ? onBorderAccept : null

  const onCancel = drawerMode === 1 ? onBorderCancel : null

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
