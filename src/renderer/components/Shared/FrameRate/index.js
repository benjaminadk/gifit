import React, { useRef, useEffect, useContext } from 'react'
import { remote } from 'electron'
import { writeFile } from 'fs'
import { promisify } from 'util'
import NumberInput from '../NumberInput'
import { AppContext } from '../../App'
import { Container, Display, Label } from './styles'
import { OPTIONS_PATH } from 'common/filepaths'
import config from 'common/config'

const {
  appActions: { SET_OPTIONS },
  ipcActions: { OPTIONS_UPDATE }
} = config

const writeFileAsync = promisify(writeFile)

export default function FrameRate() {
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

  useEffect(() => {
    writeFileAsync(OPTIONS_PATH, JSON.stringify(options)).then(() => {
      remote.BrowserWindow.fromId(1).webContents.send(OPTIONS_UPDATE, options.toObject())
    })
  }, [options])

  return (
    <Container>
      <Display>
        <canvas ref={canvas1} className='canvas1' width={40} height={40} />
        <canvas ref={canvas2} className='canvas2' width={40} height={40} />
        <canvas ref={canvas3} className='canvas3' width={40} height={40} />
      </Display>
      <NumberInput
        width={50}
        value={frameRate}
        min={1}
        max={60}
        fallback={10}
        setter={x => dispatch({ type: SET_OPTIONS, payload: options.set('frameRate', x) })}
      />
      <Label>fps</Label>
    </Container>
  )
}
