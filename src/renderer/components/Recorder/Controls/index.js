import React, { useEffect, useContext, useState } from 'react'
import { Rnd } from 'react-rnd'
import { remote } from 'electron'
import initializeOptions from '../../Options/initializeOptions'
import FrameRate from '../../Shared/FrameRate'
import Svg from '../../Svg'
import { AppContext } from '../../App'
import { Inner, Top, Bottom, SourceSelect } from './styles'
import config from 'common/config'

const {
  appActions: { SET_OPTIONS_OPEN },
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
  onCloseClick,
  onControlsEnter,
  onControlsLeave
}) {
  const { state, dispatch } = useContext(AppContext)
  const { options, optionsOpen } = state
  const useCountdown = options.get('useCountdown')

  const [showSelect, setShowSelect] = useState(false)

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

  function onCaptureClick() {
    if (captureType === 'screen') {
      setMode(2)
    } else if (captureType === 'crop') {
      setMode(1)
    }
  }

  function onOptionsClick() {
    if (!optionsOpen) {
      dispatch({ type: SET_OPTIONS_OPEN, payload: true })
      initializeOptions(remote.getCurrentWindow(), dispatch)
    }
  }

  return (
    <Rnd
      style={{
        visibility:
          [0, 2, 4, 6].includes(mode) || (mode === 3 && useCountdown) ? 'visible' : 'hidden',
        zIndex: 2,
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
      <Inner onMouseEnter={onControlsEnter} onMouseLeave={onControlsLeave}>
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
          <FrameRate />
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
      </Inner>
    </Rnd>
  )
}
