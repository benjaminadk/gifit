import React, { useEffect, useState, useContext } from 'react'
import { remote, shell } from 'electron'
import { writeFile, statSync } from 'fs'
import { promisify } from 'util'
import { AppContext } from '../App'
import Button from '../Shared/Button'
import Svg from '../Svg'
import Application from './Application'
import Temporary from './Temporary'
import Extras from './Extras'
import { Container, MenuItem } from './styles'
import { OPTIONS_PATH } from 'common/filepaths'
import config from 'common/config'

const {
  ipcActions: { OPTIONS_UPDATE },
  appActions: { SET_OPTIONS },
  constants: { FFMPEG_DOWNLOAD }
} = config

const writeFileAsync = promisify(writeFile)

const menu = [
  { text: 'Application', icon: 'window' },
  { text: 'Interface', icon: 'color' },
  { text: 'Automated Tasks', icon: 'automated' },
  { text: 'Shortcuts', icon: 'keyboard' },
  { text: 'Languages', icon: '' },
  { text: 'Temporary Files', icon: '' },
  { text: 'Upload Services', icon: '' },
  { text: 'Extras', icon: 'extras' },
  { text: 'Donate', icon: '' },
  { text: 'About', icon: 'info' }
]

export default function Options() {
  const { state, dispatch } = useContext(AppContext)
  const { options } = state

  const [menuIndex, setMenuIndex] = useState(0)
  const [ffmpegPath, setFFmpegPath] = useState(options.get('ffmpegPath'))
  const [ffmpegPathSize, setFFmpegPathSize] = useState(0)

  // any time options changes overwrite options.json
  // also send new options object to parent window to update state
  useEffect(() => {
    writeFileAsync(OPTIONS_PATH, JSON.stringify(options)).then(() => {
      remote.BrowserWindow.fromId(1).webContents.send(OPTIONS_UPDATE, options.toObject())
    })
    setFFmpegPath(options.get('ffmpegPath'))
  }, [options])

  // check for ffmpegPath if exists get file size
  useEffect(() => {
    if (ffmpegPath) {
      const stats = statSync(ffmpegPath)
      if (stats) {
        setFFmpegPathSize(stats.size)
      }
    }
  }, [])

  // clicking a checkbox toggles boolean option
  function onCheckboxClick(option) {
    dispatch({ type: SET_OPTIONS, payload: options.set(option, !options.get(option)) })
  }

  function onCountdownTimeChange(x) {
    dispatch({ type: SET_OPTIONS, payload: options.set('countdownTime', Number(x)) })
  }

  function onFFmpegChange({ target: { value } }) {
    setFFmpegPath(value)
  }

  function onFFmpegBlur({ target: { value } }) {
    dispatch({ type: SET_OPTIONS, payload: options.set('ffmpegPath', value) })
  }

  function onFFmpegFolderClick() {
    const win = remote.getCurrentWindow()
    const opts = {
      title: 'Select the location of the FFMpeg executable',
      defaultPath: '.',
      buttonLabel: 'Open',
      filters: [{ name: 'FFMpeg Executable', extensions: ['exe', 'dmg'] }],
      properties: ['openFile']
    }
    const callback = filepath => {
      if (filepath) {
        dispatch({ type: SET_OPTIONS, payload: options.set('ffmpegPath', filepath[0]) })
      }
    }
    remote.dialog.showOpenDialog(win, opts, callback)
  }

  function onFFmpegDownloadClick() {
    if (ffmpegPath) {
      shell.showItemInFolder(ffmpegPath)
    } else {
      shell.openExternal(FFMPEG_DOWNLOAD)
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
              <Svg name={el.icon} />
              <div className='text'>{el.text}</div>
            </MenuItem>
          ))}
        </div>
        <div className='content'>
          {menuIndex === 0 ? (
            <Application
              options={options}
              onCheckboxClick={onCheckboxClick}
              onCountdownTimeChange={onCountdownTimeChange}
            />
          ) : menuIndex === 5 ? (
            <Temporary />
          ) : menuIndex === 7 ? (
            <Extras
              ffmpegPath={ffmpegPath}
              ffmpegPathSize={ffmpegPathSize}
              onFFmpegChange={onFFmpegChange}
              onFFmpegBlur={onFFmpegBlur}
              onFFmpegFolderClick={onFFmpegFolderClick}
              onFFmpegDownloadClick={onFFmpegDownloadClick}
            />
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
