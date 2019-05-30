import React, { useState, useEffect } from 'react'
import convertHEXtoHSL from '../../../lib/convertHEXtoHSL'
import Modal from '../Modal'
import Hue from './Hue'
import Square from './Square'
import Svg from '../../Svg'
import styled from 'styled-components'

export const Container = styled.div`
  width: 400px;
  height: 400px;
  display: grid;
  grid-template-rows: 30px 1fr;
`

export const TitleBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  background: #3d3d3d;
  .left {
    display: grid;
    grid-template-columns: 30px 1fr;
    .icon {
    }
    .text {
      font-size: 1.2rem;
      color: white;
    }
  }
  .right {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 40px);
    .icon {
      width: 100%;
      height: 100%;
      display: grid;
      justify-items: center;
      align-items: center;
      svg {
        width: 15px;
        height: 15px;
      }
    }
  }
`

export const Main = styled.div`
  display: grid;
  grid-template-columns: 220px 60px 1fr;
  background: #ffffff;
  .square {
    display: grid;
    justify-items: center;
  }
  .hue {
    display: grid;
    justify-items: center;
  }
`

export default function ColorPicker({ show, initialColor, onChange, onClose }) {
  const [hue, setHue] = useState(0)
  const [hueY, setHueY] = useState(0)
  const [square, setSquare] = useState([0, 0])
  const [squareXY, setSquareXY] = useState([0, 0])
  const [alpha, setAlpha] = useState(1)
  const [alphaY, setAlphaY] = useState(0)
  const [color, setColor] = useState(null)

  useEffect(() => {
    const [h, s, l, a] = convertHEXtoHSL(initialColor)
    setHue(h)
    setSquare([s, l])
    setAlpha(a)
  }, [initialColor])

  return (
    <Modal show={show} onClose={onClose}>
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
            <Square hue={hue} squareXY={squareXY} />
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
