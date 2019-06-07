import React from 'react'
import Modal from '../../Shared/Modal'
import Svg from '../../Svg'
import { Container, TitleBar, Table, Row, Footer, Button } from './styles'

export default function KeyboardModal({ show, images, onClose }) {
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
        <div>
          <Table>
            <div className='header'>
              <div className='left'>Frame number</div>
              <div className='right'>Detected key strokes</div>
            </div>
            <div className='content'>
              {images.map(
                (el, i) =>
                  console.log(el.keys) || (
                    <Row key={i}>
                      <div className='left'>{i + 1}</div>
                      <div className='right'>{el.keys ? String.fromCharCode(el.keys.raw) : ''}</div>
                    </Row>
                  )
              )}
            </div>
          </Table>
        </div>
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
