import React, { useRef, useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import { List } from 'immutable'
import path from 'path'
import { mkdir, writeFile } from 'fs'
import { promisify } from 'util'
import { AppContext } from '../App'
import initializeOptions from '../Options/initializeOptions'
import createFolderName from '../../lib/createFolderName'
import drawBrush from '../../lib/drawBrush'
import drawFree from '../../lib/drawFree'
import drawEraser from '../../lib/drawEraser'
import drawErase from '../../lib/drawErase'
import Svg from '../Svg'
import NumberInput from '../Shared/NumberInput'
import ColorSwatch from '../Shared/ColorSwatch/generic'
import Checkbox from '../Shared/Checkbox'
import FrameRate from '../Shared/FrameRate'
import {
  Container,
  Top,
  Action,
  Status,
  Main,
  Canvas1,
  Canvas2,
  Canvas3,
  Bottom,
  Dimensions,
  Control,
  Discard
} from './styles'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  appActions: { SET_OPTIONS_OPEN },
  ipcActions: { BOARD_STOP },
  constants: { IMAGE_TYPE, IMAGE_REGEX }
} = config

const writeFileAsync = promisify(writeFile)
const mkdirAsync = promisify(mkdir)

export default function Board() {
  const { state, dispatch } = useContext(AppContext)
  const { options, optionsOpen, sources } = state

  const sourceIndex = options.get('sourceIndex')
  const frameRate = options.get('frameRate')

  const source = sources[sourceIndex]
  const { width: screenWidth, height: screenHeight } = source.display.bounds

  const [autoRecord, setAutoRecord] = useState(true)
  const [count, setCount] = useState(0)
  const [frames, setFrames] = useState(List([]))
  const [times, setTimes] = useState(List([]))
  const [canvasWidth, setCanvasWidth] = useState(500)
  const [canvasHeight, setCanvasHeight] = useState(350)
  const [drawing, setDrawing] = useState(false)
  const [drawXY, setDrawXY] = useState(null)
  const [drawType, setDrawType] = useState('pen')
  const [drawHighlight, setDrawHighlight] = useState(false)
  const [drawPenColor, setDrawPenColor] = useState('#FFFF00')
  const [drawPenWidth, setDrawPenWidth] = useState(20)
  const [drawPenHeight, setDrawPenHeight] = useState(20)
  const [drawShape, setDrawShape] = useState('rectangle')
  const [drawEraserWidth, setDrawEraserWidth] = useState(10)
  const [drawEraserHeight, setDrawEraserHeight] = useState(10)

  const main = useRef(null)
  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const canvas3 = useRef(null)
  const canvas4 = useRef(null)
  const canvas5 = useRef(null)
  const ctx4 = useRef(null)
  const ctx5 = useRef(null)
  const captureInterval = useRef(null)
  const t1 = useRef(null)

  useEffect(() => {
    canvas4.current = document.createElement('canvas')
    canvas5.current = document.createElement('canvas')
    ctx4.current = canvas4.current.getContext('2d')
    ctx5.current = canvas5.current.getContext('2d')
    resize(canvasWidth, canvasHeight)
  }, [])

  function resize(w, h) {
    main.current.style.width = w + 'px'
    main.current.style.height = h + 'px'
    canvas1.current.width = w
    canvas1.current.height = h
    canvas2.current.width = w
    canvas2.current.height = h
    canvas3.current.width = w
    canvas3.current.height = h
    canvas4.current.width = w
    canvas4.current.height = h
    canvas5.current.width = w
    canvas5.current.height = h
    const w1 = w + 4
    const h1 = h + 90
    const x = Math.round(screenWidth / 2 - w1 / 2)
    const y = Math.round(screenHeight / 2 - h1 / 2 + 20)
    remote.getCurrentWindow().setContentBounds({ x, y, width: w1, height: h1 })
  }

  async function onCaptureFrame() {
    setCount(cur => cur + 1)

    ctx4.current.clearRect(0, 0, canvas4.current.width, canvas4.current.height)
    ctx4.current.fillStyle = '#FFFFFF'
    ctx4.current.fillRect(0, 0, canvas4.current.width, canvas4.current.height)

    const ctx1 = canvas1.current.getContext('2d')
    const data = ctx1.getImageData(0, 0, canvas1.current.width, canvas1.current.height).data
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] !== 0) {
        data[i] = 52
      }
    }
    const imageData = new ImageData(data, canvas1.current.width, canvas1.current.height)
    ctx5.current.putImageData(imageData, 0, 0)

    ctx4.current.drawImage(canvas5.current, 0, 0)
    ctx4.current.drawImage(canvas2.current, 0, 0)

    const frame = canvas4.current.toDataURL(IMAGE_TYPE)
    setFrames(cur => cur.push(frame))

    const t2 = performance.now()
    const diff = Math.round(t2 - t1.current)
    t1.current = t2
    setTimes(cur => cur.push(diff))
  }

  async function onStop() {
    if (!count) {
      return
    }

    const folder = createFolderName()
    const folderPath = path.join(RECORDINGS_DIRECTORY, folder)
    await mkdirAsync(folderPath)
    const data = []

    for (const [i, frame] of frames.toArray().entries()) {
      const filepath = path.join(folderPath, `${i}.png`)
      data.push({
        path: filepath,
        time: times.get(i)
      })
      const base64Data = frame.replace(IMAGE_REGEX, '')
      await writeFileAsync(filepath, base64Data, {
        encoding: 'base64'
      })
    }

    const project = {
      relative: folder,
      date: new Date().getTime(),
      width: canvasWidth,
      height: canvasHeight,
      frameRate,
      frames: data
    }
    await writeFileAsync(path.join(folderPath, 'project.json'), JSON.stringify(project))
    remote.BrowserWindow.fromId(1).webContents.send(BOARD_STOP, folder)
    remote.getCurrentWindow().close()
  }

  function onDiscard() {
    setCount(0)
    setFrames(List([]))
    const ctx1 = canvas1.current.getContext('2d')
    const ctx2 = canvas2.current.getContext('2d')
    ctx1.clearRect(0, 0, canvas1.current.width, canvas1.current.height)
    ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
  }

  function onMouseDown(e) {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    setDrawing(true)
    setDrawXY([x, y])

    const ctx1 = canvas1.current.getContext('2d')
    const ctx2 = canvas2.current.getContext('2d')
    if (drawType === 'pen') {
      if (drawHighlight) {
        ctx1.fillStyle = drawPenColor
        if (drawShape === 'rectangle') {
          ctx1.fillRect(x - drawPenWidth / 2, y - drawPenHeight / 2, drawPenWidth, drawPenHeight)
        } else {
          ctx1.beginPath()
          ctx1.ellipse(
            x - drawPenWidth / 2,
            y - drawPenHeight / 2,
            drawPenWidth / 2,
            drawPenHeight / 2,
            0,
            0,
            Math.PI * 2
          )
          ctx1.fill()
        }
      } else {
        ctx2.fillStyle = drawPenColor
        if (drawShape === 'rectangle') {
          ctx2.fillRect(x - drawPenWidth / 2, y - drawPenHeight / 2, drawPenWidth, drawPenHeight)
        } else {
          ctx2.beginPath()
          ctx2.ellipse(
            x - drawPenWidth / 2,
            y - drawPenHeight / 2,
            drawPenWidth / 2,
            drawPenHeight / 2,
            0,
            0,
            Math.PI * 2
          )
          ctx2.fill()
        }
      }
    } else {
      ctx1.clearRect(
        x - drawEraserWidth / 2,
        y - drawEraserHeight / 2,
        drawEraserWidth,
        drawEraserHeight
      )
      ctx2.clearRect(
        x - drawEraserWidth / 2,
        y - drawEraserHeight / 2,
        drawEraserWidth,
        drawEraserHeight
      )
    }

    if ((autoRecord && !e.ctrlKey) || (!autoRecord && e.ctrlKey)) {
      t1.current = performance.now()
      captureInterval.current = setInterval(() => onCaptureFrame(), Math.round(1000 / frameRate))
    }
  }

  function onMouseUp() {
    setDrawing(false)
    clearInterval(captureInterval.current)
  }

  function onMouseMove(e) {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY

    if (drawType === 'pen') {
      drawBrush(canvas3.current, x, y, drawShape, drawPenColor, drawPenWidth, drawPenHeight)
    } else if (drawType === 'eraser') {
      drawEraser(canvas3.current, x, y, drawEraserWidth, drawEraserHeight)
    }

    if (drawing) {
      if (drawType === 'pen') {
        drawFree(
          canvas1.current,
          canvas2.current,
          drawXY,
          x,
          y,
          drawHighlight,
          drawShape,
          drawPenColor,
          drawPenWidth,
          drawPenHeight
        )
      } else if (drawType === 'eraser') {
        drawErase(canvas1.current, canvas2.current, drawXY, x, y, drawEraserWidth, drawEraserHeight)
      }
    }

    setDrawXY([x, y])
  }

  function onMouseLeave() {
    setDrawing(false)
    clearInterval(captureInterval.current)
    const ctx3 = canvas3.current.getContext('2d')
    ctx3.clearRect(0, 0, canvas3.current.width, canvas3.current.height)
  }

  function onCanvasWidthChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      newValue = Number(value)
    } else {
      newValue = canvasWidth
    }
    setCanvasWidth(newValue)
  }

  function onCanvasWidthBlur(e) {
    if (!!count) {
      return
    }
    var newValue
    if (canvasWidth > screenWidth - 6) {
      newValue = screenWidth - 6
    } else if (canvasWidth < 500) {
      newValue = 500
    } else {
      newValue = canvasWidth
    }
    setCanvasWidth(newValue)
    resize(newValue, canvasHeight)
  }

  function onCanvasHeightChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      newValue = Number(value)
    } else {
      newValue = canvasWidth
    }
    setCanvasHeight(newValue)
  }

  function onCanvasHeightBlur(e) {
    if (!!count) {
      return
    }
    var newValue
    if (canvasHeight > screenHeight - 70 - 90) {
      newValue = screenHeight - 70 - 90
    } else if (canvasHeight < 350) {
      newValue = 350
    } else {
      newValue = canvasHeight
    }
    setCanvasHeight(newValue)
    resize(canvasWidth, newValue)
  }

  function onOptionsClick() {
    if (!optionsOpen) {
      dispatch({ type: SET_OPTIONS_OPEN, payload: true })
      initializeOptions(remote.getCurrentWindow(), dispatch)
    }
  }

  return (
    <Container>
      <Top pen={drawType === 'pen'}>
        <Action selected={drawType === 'pen'} onClick={() => setDrawType('pen')}>
          <Svg name='pen' />
        </Action>
        <Action selected={drawType === 'eraser'} onClick={() => setDrawType('eraser')}>
          <Svg name='eraser' />
        </Action>
        {drawType === 'pen' ? (
          <>
            <ColorSwatch width={60} color={drawPenColor} onChange={setDrawPenColor} />
            <NumberInput
              width={60}
              value={drawPenWidth}
              min={1}
              max={100}
              fallback={20}
              setter={setDrawPenWidth}
            />
            <NumberInput
              width={60}
              value={drawPenHeight}
              min={1}
              max={100}
              fallback={20}
              setter={setDrawPenHeight}
            />
            <Action selected={drawShape === 'rectangle'} onClick={() => setDrawShape('rectangle')}>
              <Svg name='rectangle' />
            </Action>
            <Action selected={drawShape === 'ellipsis'} onClick={() => setDrawShape('ellipsis')}>
              <Svg name='shape' />
            </Action>
            <Checkbox
              value={drawHighlight}
              primary='Highlighter'
              style={{ height: '100%', marginBottom: 0 }}
              onClick={() => setDrawHighlight(!drawHighlight)}
            />
            <div />
            <Status show={!!count}>
              {count} {!drawing ? '(Paused)' : ''}
            </Status>
          </>
        ) : (
          <>
            <NumberInput
              width={60}
              value={drawEraserWidth}
              min={1}
              max={100}
              fallback={10}
              setter={setDrawEraserWidth}
            />
            <NumberInput
              width={60}
              value={drawEraserHeight}
              min={1}
              max={100}
              fallback={10}
              setter={setDrawEraserHeight}
            />
            <div />
            <Status show={!!count}>
              {count} {!drawing ? '(Paused)' : ''}
            </Status>
          </>
        )}
      </Top>
      <Main ref={main}>
        <Canvas1 ref={canvas1} />
        <Canvas2 ref={canvas2} />
        <Canvas3
          ref={canvas3}
          opacity={drawType === 'pen' && drawHighlight ? 0.2 : 1}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        />
      </Main>
      <Bottom discard={!!count}>
        <div />
        <Action onClick={onOptionsClick}>
          <Svg name='settings' />
        </Action>
        <FrameRate disabled={!!count} />
        <Dimensions>
          <input
            type='text'
            value={canvasWidth}
            readOnly={!!count}
            onChange={onCanvasWidthChange}
            onBlur={onCanvasWidthBlur}
          />
          <div className='label'>x</div>
          <input
            type='text'
            value={canvasHeight}
            readOnly={!!count}
            onChange={onCanvasHeightChange}
            onBlur={onCanvasHeightBlur}
          />
          <div className='label'>px</div>
        </Dimensions>
        {!!count && (
          <Discard onClick={onDiscard}>
            <Svg name='close' />
            <div className='text'>Discard</div>
          </Discard>
        )}
        <Control width={80} active={autoRecord} onClick={() => setAutoRecord(!autoRecord)}>
          <Svg name='record' />
          <div className='text'>
            <div className='primary'>Record</div>
            <div className='secondary'>Ctrl [hold]</div>
          </div>
        </Control>
        <Control width={60} onClick={onStop}>
          <Svg name='stop' />
          <div className='text'>
            <div className='primary'>Stop</div>
            <div className='secondary'>Esc</div>
          </div>
        </Control>
      </Bottom>
    </Container>
  )
}
