import React, { useState, useEffect, useRef } from 'react'
import convertHEXtoHSL from '../../../lib/convertHEXtoHSL'
import convertHSLtoRGB from '../../../lib/convertHSLtoRGB'
import Modal from '../Modal'
import Hue from './Hue'
import Alpha from './Alpha'
import Square from './Square'
import Svg from '../../Svg'
import NumberInput from '../NumberInput'
import {
  Container,
  TitleBar,
  Main,
  Heading,
  ColorProperty,
  ColorDisplay,
  MiniButton
} from './styles'
import config from 'common/config'

const {
  picker: { squareSize, handleOffsetY, crossOffset }
} = config

function computeHueY(hue) {
  return Math.round((squareSize / 360) * hue - handleOffsetY)
}

function computeSquareXY(s, l) {
  const t = (s * (l < 50 ? l : 100 - l)) / 100
  const s1 = Math.round((200 * t) / (l + t)) | 0
  const b1 = Math.round(t + l)
  const x = (squareSize / 100) * s1 - crossOffset
  const y = squareSize - (squareSize / 100) * b1 - crossOffset
  return [x, y]
}

function computeAlphaY(alpha) {
  return Math.round(squareSize - alpha * squareSize - handleOffsetY)
}

export default function ColorPicker({ show, initialColor, onChange, onClose }) {
  const modal = useRef(null)

  const [hue, setHue] = useState(0)
  const [hueY, setHueY] = useState(0)
  const [square, setSquare] = useState([0, 0])
  const [squareXY, setSquareXY] = useState([0, 0])
  const [alpha, setAlpha] = useState(1)
  const [alphaY, setAlphaY] = useState(0)

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
    setHueY(computeHueY(h))
    setSquare([s, l])
    setSquareXY(computeSquareXY(s, l))
    setAlpha(a)
    setAlphaY(computeAlphaY(a))
  }, [initialColor])

  function onHueChange(x) {
    setHue(x)
    setHueY(computeHueY(x))
  }

  function onSaturationChange(x) {
    setSquare([x, square[1]])
    setSquareXY(computeSquareXY(x, square[1]))
  }

  function onLightnessChange(x) {
    setSquare([square[0], x])
    setSquareXY(computeSquareXY(square[0], x))
  }

  function onAlphaChange(x) {
    setAlpha(x / 100)
    setAlphaY(computeAlphaY(x / 100))
  }

  function onOkayClick() {
    onChange(convertHSLtoRGB([hue, square[0], square[1], alpha]).hexa)
    onClose()
  }

  return (
    <Modal modal={modal} show={show} onClose={onClose}>
      <Container>
        <TitleBar>
          <div className='left'>
            <div className='icon'>
              <Svg name='icon' />
            </div>
            <div className='text'>Color Picker</div>
          </div>
          <div className='right' onClick={onClose}>
            <Svg name='window-close' />
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
          <div className='alpha'>
            <Alpha
              alphaY={alphaY}
              hue={hue}
              offsetTop={offsetTop}
              setAlpha={setAlpha}
              setAlphaY={setAlphaY}
            />
          </div>
          <div className='hue'>
            <Hue hueY={hueY} offsetTop={offsetTop} setHueY={setHueY} setHue={setHue} />
          </div>
          <div className='controls'>
            <Heading>Select a Color</Heading>
            <ColorProperty>
              <div className='text'>Hue</div>
              <NumberInput
                width={75}
                value={hue}
                min={0}
                max={360}
                fallback={0}
                setter={onHueChange}
              />
            </ColorProperty>
            <ColorProperty>
              <div className='text'>Saturation</div>
              <NumberInput
                width={75}
                value={square[0]}
                min={0}
                max={100}
                fallback={100}
                setter={onSaturationChange}
              />
            </ColorProperty>
            <ColorProperty>
              <div className='text'>Lightness</div>
              <NumberInput
                width={75}
                value={square[1]}
                min={0}
                max={100}
                fallback={50}
                setter={onLightnessChange}
              />
            </ColorProperty>
            <ColorProperty>
              <div className='text'>Alpha</div>
              <NumberInput
                width={75}
                value={Math.round(alpha * 100)}
                min={0}
                max={100}
                fallback={100}
                setter={onAlphaChange}
              />
            </ColorProperty>
            <div className='divider' />
            <ColorProperty>
              <div className='text'>Hex</div>
              <div className='hex'>{convertHSLtoRGB([hue, square[0], square[1], alpha]).hexa}</div>
            </ColorProperty>
            <ColorDisplay
              initial={initialColor}
              current={convertHSLtoRGB([hue, square[0], square[1], alpha]).hexa}
            >
              <div className='initial' />
              <div className='current' />
            </ColorDisplay>
            <div className='buttons'>
              <MiniButton onClick={onOkayClick}>
                <Svg name='check' />
                <div className='text'>Ok</div>
              </MiniButton>
              <MiniButton onClick={onClose}>
                <Svg name='cancel' />
                <div className='text'>Cancel</div>
              </MiniButton>
            </div>
          </div>
        </Main>
      </Container>
    </Modal>
  )
}
