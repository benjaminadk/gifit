import React, { useRef, useEffect, useContext } from 'react'
import { Rnd } from 'react-rnd'
import { Close } from 'styled-icons/material/Close'
import NumberInput from '../../Shared/NumberInput'
import Svg from '../../Svg'
import { AppContext } from '../../App'
import { Top, Bottom, FpsDisplay } from './styles'
import config from 'common/config'

const {
  appActions: { SET_OPTIONS },
  recorder: { controlsWidth, controlsHeight }
} = config

export default function Controls({ show, controlsX, controlsY, setControlsX, setControlsY }) {
  const { state, dispatch } = useContext(AppContext)
  const { options } = state
  const frameRate = options.get('frameRate')

  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const canvas3 = useRef(null)

  useEffect(() => {
    const ctx1 = canvas1.current.getContext('2d')
    ctx1.beginPath()
    ctx1.fillStyle = '#DDDDDD'
    ctx1.arc(20, 20, 15, 0, Math.PI * 2)
    ctx1.fill()
    const ctx3 = canvas3.current.getContext('2d')
    ctx3.beginPath()
    ctx3.strokeStyle = '#FFFFFF'
    ctx3.lineWidth = 1.5
    ctx3.arc(20, 20, 13.5, 0, Math.PI * 2)
    ctx3.stroke()
  }, [])

  useEffect(() => {
    const start = Math.PI * 1.5
    const end = Math.PI * 2 * ((60 - frameRate) / 59) + start
    const ctx2 = canvas2.current.getContext('2d')
    ctx2.fillStyle = '#DA8C77'
    ctx2.strokeStyle = '#DA8C77'
    ctx2.clearRect(0, 0, 40, 40)
    ctx2.beginPath()
    ctx2.arc(20, 20, 15, start, end)
    ctx2.lineTo(20, 20)
    ctx2.closePath()
    ctx2.stroke()
    ctx2.fill()
  }, [frameRate])

  function onChangeFrameRate(x) {
    dispatch({ type: SET_OPTIONS, payload: options.set('frameRate', x) })
  }

  return (
    <Rnd
      style={{
        visibility: show ? 'visible' : 'hidden',
        zIndex: 2,
        display: 'grid',
        gridTemplateRows: '30px 40px',
        background: '#FFFFFF',
        outline: '1px solid lightgrey'
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
        <div className='text'>GifIt</div>
        <Close />
      </Top>
      <Bottom>
        <Svg name='settings' />
        <FpsDisplay>
          <canvas ref={canvas1} className='canvas1' width={40} height={40} />
          <canvas ref={canvas2} className='canvas2' width={40} height={40} />
          <canvas ref={canvas3} className='canvas3' width={40} height={40} />
        </FpsDisplay>
        <NumberInput
          width={50}
          value={frameRate}
          min={1}
          max={60}
          fallback={10}
          setter={onChangeFrameRate}
        />
        <div className='label'>fps</div>
        <div />
        <Svg name='record' />
        <Svg name='stop' />
      </Bottom>
    </Rnd>
  )
}
