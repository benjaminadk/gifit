import React, { useRef, useState } from 'react'
import Modal from '../../Shared/Modal'
import NumberInput from '../../Shared/NumberInput'
import Svg from '../../Svg'
import { Container, TitleBar, Main, Button } from './styles'

export default function Goto({ show, max, onThumbnailClick, setShowGoto }) {
  const [value, setValue] = useState(1)

  const modal = useRef(null)

  function onClose() {
    setShowGoto(false)
  }

  function onOkayClick() {
    onThumbnailClick({}, value - 1)
    onClose()
  }

  return (
    <Modal modal={modal} show={show}>
      <Container>
        <TitleBar>
          <div className='left'>
            <div className='icon'>
              <Svg name='icon' />
            </div>
            <div className='text'>Go To Frame</div>
          </div>
          <div className='right' onClick={onClose}>
            <Svg name='window-close' />
          </div>
        </TitleBar>
        <Main>
          <div className='text'>Go To Frame (1 to {max})</div>
          <div className='content'>
            <NumberInput
              width={150}
              value={value}
              max={max}
              min={1}
              fallback={1}
              setter={setValue}
            />
          </div>
          <div className='actions'>
            <Button onClick={onOkayClick}>
              <Svg name='check' />
              <div className='label'>Okay</div>
            </Button>
            <Button onClick={onClose}>
              <Svg name='cancel' />
              <div className='label'>Cancel</div>
            </Button>
          </div>
        </Main>
      </Container>
    </Modal>
  )
}
