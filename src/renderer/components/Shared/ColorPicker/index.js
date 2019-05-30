import React, { useState, useEffect, useRef } from 'react'
import convertHEXtoHSL from '../../../lib/convertHEXtoHSL'
import Modal from '../Modal'
import Hue from './Hue'
import Square from './Square'
import Svg from '../../Svg'
import { Container, TitleBar, Main } from './styles'

export default function ColorPicker({ show, initialColor, onChange, onClose }) {
  const modal = useRef(null)

  const [hue, setHue] = useState(0)
  const [hueY, setHueY] = useState(0)
  const [square, setSquare] = useState([0, 0])
  const [squareXY, setSquareXY] = useState([0, 0])
  const [alpha, setAlpha] = useState(1)
  const [alphaY, setAlphaY] = useState(0)
  const [color, setColor] = useState(null)

  const [offsetTop, setOffsetTop] = useState(null)
  const [offsetLeft, setOffsetLeft] = useState(null)

  useEffect(() => {
    if (show) {
      setOffsetTop(modal.current.offsetTop)
      setOffsetLeft(modal.current.offsetLeft)
    }
  }, [show])

  useEffect(() => {
    const [h, s, l, a] = convertHEXtoHSL(initialColor)
    setHue(h)
    setSquare([s, l])
    setAlpha(a)
  }, [initialColor])

  return (
    <Modal modal={modal} show={show} onClose={onClose}>
      <Container>
        <TitleBar>
          <div className='left'>
            <div className='icon'>i</div>
            <div className='text'>Color Picker</div>
          </div>
          <div className='right'>
            <div>-</div>
            <div>o</div>
            <div className='icon' onClick={onClose}>
              <Svg name='window-close' />
            </div>
          </div>
        </TitleBar>
        <Main>
          <div className='square'>
            <Square
              hue={hue}
              squareXY={squareXY}
              setSquare={setSquare}
              offsetTop={offsetTop}
              offsetLeft={offsetLeft}
              setSquareXY={setSquareXY}
            />
          </div>
          <div className='hue'>
            <Hue hueY={hueY} setHueY={setHueY} setHue={setHue} />
          </div>
          <div />
        </Main>
      </Container>
    </Modal>
  )
}
