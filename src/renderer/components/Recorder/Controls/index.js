import React, { useRef, useEffect, useContext, useState } from 'react'
import { Rnd } from 'react-rnd'
import { remote } from 'electron'
import { writeFile } from 'fs'
import { promisify } from 'util'
import initializeOptions from '../../Options/initializeOptions'
import NumberInput from '../../Shared/NumberInput'
import Svg from '../../Svg'
import { AppContext } from '../../App'
import { Top, Bottom, FpsDisplay, SourceSelect } from './styles'
import { OPTIONS_PATH } from 'common/filepaths'
import config from 'common/config'

const writeFileAsync = promisify(writeFile)

const {
  ipcActions: { OPTIONS_UPDATE },
  appActions: { SET_OPTIONS, SET_OPTIONS_OPEN },
  recorder: { controlsWidth, controlsHeight }
} = config

export default function Controls({
  mode,
  time,
  count,
  captureType,
  controlsX,
  controlsY,
  setCaptureType,
  setControlsX,
  setControlsY,
  setMode,
  onRecordStart,
  onRecordStop,
  onRecordPause,
  onRecordResume,
  onCloseClick
}) {
  const { state, dispatch } = useContext(AppContext)
  const { options, optionsOpen } = state
  const useCountdown = options.get('useCountdown')
  const frameRate = options.get('frameRate')

  const [showSelect, setShowSelect] = useState(false)

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

  useEffect(() => {
    writeFileAsync(OPTIONS_PATH, JSON.stringify(options)).then(() => {
      remote.BrowserWindow.fromId(1).webContents.send(OPTIONS_UPDATE, options.toObject())
    })
  }, [options])

  useEffect(() => {
    function onCloseSelect() {
      window.removeEventListener('click', onCloseSelect)
      setShowSelect(false)
    }

    if (showSelect) {
      window.addEventListener('click', onCloseSelect)
    }

    return () => {
      window.removeEventListener('click', onCloseSelect)
    }
  }, [showSelect])

  function onChangeFrameRate(x) {
    dispatch({ type: SET_OPTIONS, payload: options.set('frameRate', x) })
  }

  function onCaptureClick() {
    if (captureType === 'screen') {
      setMode(2)
    } else if (captureType === 'crop') {
      setMode(1)
    }
  }

  function onOptionsClick() {
    dispatch({ type: SET_OPTIONS_OPEN, payload: true })
    initializeOptions(remote.getCurrentWindow(), dispatch)
  }

  return (
    <Rnd
      style={{
        visibility:
          [0, 2, 4, 6].includes(mode) || (mode === 3 && useCountdown) ? 'visible' : 'hidden',
        zIndex: 2,
        display: 'grid',
        gridTemplateRows: '30px 40px',
        background: '#FFFFFF',
        outline: '1px solid #CFCFCF'
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
        <div className='text'>
          GifIt{' '}
          {mode === 3 && useCountdown
            ? `(Prestart Recording ${time}s)`
            : [4, 6].includes(mode)
            ? count
            : ''}
        </div>
        <div className='close' onClick={onCloseClick}>
          <Svg name='close' />
        </div>
      </Top>
      <Bottom>
        <div className='button' onClick={onOptionsClick}>
          <Svg name='settings' />
        </div>
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
        <div className='divider' />
        <SourceSelect show={showSelect}>
          <div className='selected'>
            <div className='icon' onClick={onCaptureClick}>
              <Svg name={captureType} />
            </div>
            <div className='arrow' onClick={() => setShowSelect(!showSelect)}>
              {'\u2bc6'}
            </div>
          </div>
          <div className='options'>
            <div className='option' onClick={() => setCaptureType('crop')}>
              <Svg name='crop' />
              <div className='text'>Area</div>
            </div>
            <div className='option' onClick={() => setCaptureType('screen')}>
              <Svg name='screen' />
              <div className='text'>Screen</div>
            </div>
          </div>
        </SourceSelect>
        <div className='divider' />
        <div
          className='button'
          onClick={mode === 4 ? onRecordPause : mode === 6 ? onRecordResume : onRecordStart}
        >
          <Svg name={mode === 4 ? 'pause' : 'record'} />
        </div>
        <div className='button' onClick={onRecordStop}>
          <Svg name='stop' />
        </div>
      </Bottom>
    </Rnd>
  )
}
