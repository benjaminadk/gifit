import React from 'react'
import { Rnd } from 'react-rnd'
import styled from 'styled-components'
import { Close } from 'styled-icons/material/Close'
import { Settings } from 'styled-icons/material/Settings'
import NumberInput from '../../Shared/NumberInput'
import Svg from '../../Svg'
import config from 'common/config'

export const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px;
  align-items: center;
  .text {
    font-size: 1rem;
    color: ${p => p.theme.primary};
  }
  svg {
    justify-self: center;
    width: 30px;
    height: 30px;
  }
`

export const Bottom = styled.div`
  display: grid;
  grid-template-columns: 30px 60px 1fr 30px 30px;
  align-items: center;
  svg {
    justify-self: center;
    width: 25px;
    height: 25px;
  }
`

const {
  recorder: { controlsWidth, controlsHeight }
} = config

export default function Controls({ show, controlsX, controlsY, setControlsX, setControlsY }) {
  return (
    <Rnd
      style={{
        visibility: show ? 'visible' : 'hidden',
        zIndex: 2,
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        background: '#FFFFFF'
      }}
      bounds='parent'
      size={{ width: controlsWidth, height: controlsHeight }}
      position={{ x: controlsX, y: controlsY }}
      onDrag={(e, d) => {
        setControlsX(d.x)
        setControlsY(d.y)
      }}
      enableResizing={false}
    >
      <Top>
        <div className='text'>GifIt Screen Recorder</div>
        <Close />
      </Top>
      <Bottom>
        <Svg name='settings' />
        <NumberInput width={60} value={10} min={1} max={20} fallback={10} onChange={() => {}} />
        <div />
        <Svg name='record' />
        <Svg name='stop' />
      </Bottom>
    </Rnd>
  )
}
