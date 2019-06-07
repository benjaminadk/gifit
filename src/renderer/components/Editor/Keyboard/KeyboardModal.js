import React from 'react'
import Modal from '../../Shared/Modal'
import Svg from '../../Svg'
import { Container, TitleBar, Main, Footer, Button } from './styles'

export default function KeyboardModal({ show, onClose }) {
  return (
    <Modal show={show}>
      <Container>
        <TitleBar>
          <div className='left'>
            <div className='icon'>
              <Svg name='icon' />
            </div>
            <div className='text'>Key Strokes</div>
          </div>
          <div className='right' onClick={onClose}>
            <Svg name='window-close' />
          </div>
        </TitleBar>
        <Main />
        <Footer>
          <div />
          <Button width={100}>
            <Svg name='check' />
            <div className='text'>Accept</div>
          </Button>
          <Button width={100} onClick={onClose}>
            <Svg name='cancel' />
            <div className='text'>Cancel</div>
          </Button>
        </Footer>
      </Container>
    </Modal>
  )
}
