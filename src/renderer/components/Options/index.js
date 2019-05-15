import React, { useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import { Check } from 'styled-icons/material/Check'
import { DesktopWindows } from 'styled-icons/material/DesktopWindows'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { AppContext } from '../App'
import Checkbox from '../Shared/Checkbox'
import Button from '../Shared/Button'
import NumberInput from '../Shared/NumberInput'
import { Container, MenuItem, Application, FFMpeg, Section, CountdownSize } from './styles'
import { OPTIONS_PATH } from 'common/filepaths'
import config from 'common/config'

const {
  ipcActions: { OPTIONS_UPDATE },
  appActions: { SET_OPTIONS }
} = config

const writeFileAsync = promisify(writeFile)

const menu = [
  'Application',
  'Interface',
  'Automated Tasks',
  'Shortcuts',
  'Languages',
  'Temporary Files',
  'Upload Services',
  'FFMpeg',
  'Donate',
  'About'
]

export default function Options() {
  const { state, dispatch } = useContext(AppContext)
  const { options } = state

  const [menuIndex, setMenuIndex] = useState(0)

  useEffect(() => {
    writeFileAsync(OPTIONS_PATH, JSON.stringify(options)).then(() => {
      remote.BrowserWindow.fromId(1).webContents.send(OPTIONS_UPDATE, options.toObject())
    })
  }, [options])

  function onCheckboxClick(x) {
    dispatch({ type: SET_OPTIONS, payload: options.set(x, !options.get(x)) })
  }

  function onCountdownTimeChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 15) {
        newValue = 15
      } else {
        newValue = value
      }
    } else {
      newValue = 2
    }
    dispatch({ type: SET_OPTIONS, payload: options.set('countdownTime', Number(newValue)) })
  }

  function onCountdownTimeBlur({ target: { value } }) {
    if (Number(value) < 2 || !value) {
      dispatch({ type: SET_OPTIONS, payload: options.set('countdownTime', 2) })
    }
  }

  function onCountdownTimeArrowClick(inc) {
    const currentValue = options.get('countdownTime')
    if (inc) {
      if (currentValue < 15) {
        dispatch({ type: SET_OPTIONS, payload: options.set('countdownTime', currentValue + 1) })
      }
    } else {
      if (currentValue > 2) {
        dispatch({ type: SET_OPTIONS, payload: options.set('countdownTime', currentValue - 1) })
      }
    }
  }

  function onClose() {
    remote.getCurrentWindow().close()
  }

  return (
    <Container>
      <div className='main'>
        <div className='menu'>
          {menu.map((el, i) => (
            <MenuItem key={i} selected={i === menuIndex} onClick={() => setMenuIndex(i)}>
              <DesktopWindows />
              <div className='text'>{el}</div>
            </MenuItem>
          ))}
        </div>
        <div className='content'>
          {menuIndex === 0 ? (
            <Application>
              <Section height={200}>
                <div className='title'>
                  <div className='text'>Screen Recorder</div>
                  <div className='divider' />
                </div>
                <div className='content'>
                  <Checkbox
                    value={options.get('showCursor')}
                    primary='Show the mouse cursor in the recording.'
                    onClick={() => onCheckboxClick('showCursor')}
                  />
                  <Checkbox
                    value={options.get('useCountdown')}
                    primary='Use pre start countdown.'
                    onClick={() => onCheckboxClick('useCountdown')}
                  />
                  {options.get('useCountdown') && (
                    <CountdownSize>
                      <NumberInput
                        width={60}
                        value={options.get('countdownTime')}
                        onChange={onCountdownTimeChange}
                        onBlur={onCountdownTimeBlur}
                        onArrowUpClick={() => onCountdownTimeArrowClick(true)}
                        onArrowDownClick={() => onCountdownTimeArrowClick(false)}
                      />
                      <div className='text'>(In seconds, wait before start capture.)</div>
                    </CountdownSize>
                  )}
                </div>
              </Section>
            </Application>
          ) : menuIndex === 7 ? (
            <FFMpeg>
              <Section height={200}>
                <div className='title'>
                  <div className='text'>FFMpeg Path</div>
                  <div className='divider' />
                </div>
              </Section>
            </FFMpeg>
          ) : null}
        </div>
      </div>
      <div className='bottom'>
        <Button width={115} onClick={onClose}>
          <Check />
          <div className='text'>Close</div>
        </Button>
      </div>
    </Container>
  )
}
