import React, { useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import { DesktopWindows } from 'styled-icons/material/DesktopWindows'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { AppContext } from '../App'
import Checkbox from '../Shared/Checkbox'
import Button from '../Shared/Button'
import NumberInput from '../Shared/NumberInput'
import Svg from '../Svg'
import { Container, MenuItem, Application, Section, CountdownSize, PathInput } from './styles'
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
  'Extras',
  'Donate',
  'About'
]

export default function Options() {
  const { state, dispatch } = useContext(AppContext)
  const { options } = state

  const [menuIndex, setMenuIndex] = useState(0)
  const [ffmpegPath, setFfmpegPath] = useState(options.get('ffmpegPath'))

  // any time options changes overwrite options.json
  // also send new options object to parent window to update state
  useEffect(() => {
    writeFileAsync(OPTIONS_PATH, JSON.stringify(options)).then(() => {
      remote.BrowserWindow.fromId(1).webContents.send(OPTIONS_UPDATE, options.toObject())
    })
    setFfmpegPath(options.get('ffmpegPath'))
  }, [options])

  // clicking a checkbox toggles boolean option
  function onCheckboxClick(option) {
    if (option === 'gifProcessor') {
      dispatch({
        type: SET_OPTIONS,
        payload: options.set(
          option,
          options.get('gifProcessor') === 'ffmpeg' ? 'gifEncoder' : 'ffmpeg'
        )
      })
    } else {
      dispatch({ type: SET_OPTIONS, payload: options.set(option, !options.get(option)) })
    }
  }

  function onCountdownTimeChange(x) {
    dispatch({ type: SET_OPTIONS, payload: options.set('countdownTime', Number(x)) })
  }

  function onFFMpegChange({ target: { value } }) {
    setFfmpegPath(value)
  }

  function onFFMpegBlur({ target: { value } }) {
    dispatch({ type: SET_OPTIONS, payload: options.set('ffmpegPath', value) })
  }

  function onFFMpegBrowsePath() {
    const win = remote.getCurrentWindow()
    const opts = {
      title: 'Select the location of the FFMpeg executable',
      defaultPath: '.',
      buttonLabel: 'Open',
      filters: [{ name: 'FFMpeg Executable', extensions: ['exe'] }],
      properties: ['openFile']
    }
    const callback = filepaths => {
      if (filepaths) {
        dispatch({ type: SET_OPTIONS, payload: options.set('ffmpegPath', filepaths[0]) })
      }
    }
    remote.dialog.showOpenDialog(win, opts, callback)
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
                        min={2}
                        max={15}
                        fallback={3}
                        setter={onCountdownTimeChange}
                      />
                      <div className='text'>(In seconds, wait before start capture.)</div>
                    </CountdownSize>
                  )}
                </div>
              </Section>
              <Section>
                <div className='title'>
                  <div className='text'>GIF Processor</div>
                  <div className='divider' />
                </div>
                <div className='content'>
                  <Checkbox
                    value={options.get('gifProcessor') === 'ffmpeg'}
                    primary='Use FFMpeg to process GIF.'
                    secondary='Faster and smaller output size than default.'
                    onClick={() => onCheckboxClick('gifProcessor')}
                  />
                  {options.get('gifProcessor') === 'ffmpeg' ? (
                    <PathInput>
                      <div className='title'>
                        <div className='text'>FFMpeg Path</div>
                        <div className='divider' />
                      </div>
                      <div className='input'>
                        <input
                          type='text'
                          value={ffmpegPath}
                          onChange={onFFMpegChange}
                          onBlur={onFFMpegBlur}
                        />
                        <Svg name='folder' onClick={onFFMpegBrowsePath} />
                      </div>
                    </PathInput>
                  ) : null}
                </div>
              </Section>
            </Application>
          ) : null}
        </div>
      </div>
      <div className='bottom'>
        <Button width={115} onClick={onClose}>
          <Svg name='check' />
          <div className='text'>Ok</div>
        </Button>
      </div>
    </Container>
  )
}
