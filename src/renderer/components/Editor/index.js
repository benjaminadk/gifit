import React, { useRef, useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import { BorderOuter } from 'styled-icons/material/BorderOuter'
import path from 'path'
import { readFile, writeFile } from 'fs'
import { promisify } from 'util'
import { spawn } from 'child_process'
import createRandomString from '../../lib/createRandomString'
import createHashPath from '../../lib/createHashPath'
import drawBorder from './drawBorder'
import { AppContext } from '../App'
import Drawer from './Drawer'
import Border from './Border'
import Toolbar from './Toolbar'
import Thumbnails from './Thumbnails'
import { Container, Main, Wrapper, Canvas1, Canvas2 } from './styles'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  constants: { IMAGE_TYPE }
} = config

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)
  const { gifFolder } = state

  const [images, setImages] = useState([])
  const [gifData, setGifData] = useState(null)
  const [scale, setScale] = useState(null)
  const [zoomToFit, setZoomToFit] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState(1)

  const [borderLeft, setBorderLeft] = useState(0)
  const [borderRight, setBorderRight] = useState(0)
  const [borderTop, setBorderTop] = useState(0)
  const [borderBottom, setBorderBottom] = useState(0)
  const [borderColor, setBorderColor] = useState('#000000')

  const container = useRef(null)
  const main = useRef(null)
  const wrapper = useRef(null)
  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const thumbnail = useRef(null)

  useEffect(() => {
    async function initialize() {
      const data = await readFileAsync(
        path.join(RECORDINGS_DIRECTORY, gifFolder, 'project.json')
      )
      const project = JSON.parse(data)
      setImages(project.frames)
      setGifData({
        relative: project.relative,
        width: project.width,
        height: project.height,
        frameRate: project.frameRate
      })

      const mainHeight = container.current.clientHeight - 200
      main.current.style.height = mainHeight + 'px'
      const heightRatio = Math.round((mainHeight / project.height) * 100) / 100
      const initialScale = heightRatio < 1 ? heightRatio : 1
      setScale(initialScale)
      setZoomToFit(initialScale)
    }

    initialize()
  }, [])

  useEffect(() => {
    if (images.length && scale) {
      wrapper.current.style.width = gifData.width * scale + 'px'
      wrapper.current.style.height = gifData.height * scale + 'px'
      canvas1.current.width = gifData.width * scale
      canvas1.current.height = gifData.height * scale
      canvas2.current.width = gifData.width * scale
      canvas2.current.height = gifData.height * scale

      const ctx1 = canvas1.current.getContext('2d')
      ctx1.scale(scale, scale)
      const image = new Image()
      image.onload = () => {
        ctx1.drawImage(image, 0, 0)
      }
      image.src = images[imageIndex].path
    }
  }, [images, imageIndex, scale])

  useEffect(() => {
    if (drawerMode === 1) {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
      drawBorder(
        canvas2.current,
        borderLeft,
        borderRight,
        borderTop,
        borderBottom,
        borderColor
      )
    } else {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    }
  }, [
    drawerMode,
    borderLeft,
    borderRight,
    borderTop,
    borderBottom,
    borderColor
  ])

  useEffect(() => {
    if (thumbnail.current) {
      thumbnail.current.scrollIntoView()
    }
  }, [imageIndex])

  useEffect(() => {
    var playingId

    if (playing) {
      playingId = setInterval(() => {
        setImageIndex(index => (index === images.length - 1 ? 0 : index + 1))
      }, Math.round(1000 / gifData.frameRate))
    } else {
      clearInterval(playingId)
    }

    return () => clearInterval(playingId)
  }, [playing])

  function onSaveClick() {
    const win = remote.getCurrentWindow()
    const options = {
      title: 'Save',
      defaultPath: path.join(
        remote.app.getPath('downloads'),
        `${createRandomString()}.gif`
      ),
      buttonLabel: 'Save',
      filters: [{ name: 'GIF File', extensions: ['gif'] }]
    }
    const callback = filepath => {
      if (filepath) {
        const srcPath = `${RECORDINGS_DIRECTORY}/${gifData.relative}/%d.png`
        const scale = Math.min(gifData.width, 720) + ':-1'
        const ffmpeg = spawn('ffmpeg', [
          '-framerate',
          gifData.frameRate,
          '-i',
          srcPath,
          '-filter_complex',
          `scale=${scale}:flags=lanczos,split [o1] [o2];[o1] palettegen=stats_mode=single [p]; [o2] fifo [o3];[o3] [p] paletteuse=new=1`,
          filepath
        ])

        ffmpeg.on('close', code => {
          console.log('ffmpeg exit code: ', code)
        })

        ffmpeg.on('error', error => {
          console.error(error)
        })
      }
    }
    remote.dialog.showSaveDialog(win, options, callback)
  }

  function onPlaybackClick(index) {
    if (index === 0) {
      setImageIndex(0)
    } else if (index === 1) {
      setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1)
    } else if (index === 2) {
      setPlaying(!playing)
    } else if (index === 3) {
      setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1)
    } else if (index === 4) {
      setImageIndex(images.length - 1)
    }
  }

  function onOpenBorderDrawer() {
    setShowDrawer(true)
    setDrawerMode(1)
    setScale(1)
  }

  function onBorderAccept() {
    const reader = new FileReader()

    reader.onload = () => {
      const filepath = `${RECORDINGS_DIRECTORY}/${
        gifData.relative
      }/${imageIndex}.png`
      const buffer = Buffer.from(reader.result)
      writeFileAsync(filepath, buffer).then(() => {
        images[imageIndex].path = createHashPath(images[imageIndex].path)
        setShowDrawer(false)
        setScale(zoomToFit)
      })
    }

    const canvas3 = document.createElement('canvas')
    canvas3.width = gifData.width
    canvas3.height = gifData.height
    const ctx3 = canvas3.getContext('2d')
    const image = new Image()
    image.onload = () => {
      ctx3.drawImage(image, 0, 0)
      drawBorder(
        canvas3,
        borderLeft,
        borderRight,
        borderTop,
        borderBottom,
        borderColor
      )
      canvas3.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
    }
    image.src = images[imageIndex].path
  }

  function onBorderCancel() {
    const ctx2 = canvas2.current.getContext('2d')
    ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  return (
    <Container ref={container}>
      <Toolbar
        playing={playing}
        onSaveClick={onSaveClick}
        onPlaybackClick={onPlaybackClick}
        onOpenBorderDrawer={onOpenBorderDrawer}
      />
      <Main ref={main} shift={showDrawer}>
        <Wrapper ref={wrapper}>
          <Canvas1 ref={canvas1} />
          <Canvas2 ref={canvas2} />
        </Wrapper>
      </Main>
      <Thumbnails
        thumbnail={thumbnail}
        images={images}
        imageIndex={imageIndex}
        setImageIndex={setImageIndex}
      />
      <Drawer
        width={300}
        show={showDrawer}
        icon={<BorderOuter />}
        title='Border'
        onAccept={onBorderAccept}
        onCancel={onBorderCancel}
      >
        {drawerMode === 1 ? (
          <Border
            borderLeft={borderLeft}
            borderRight={borderRight}
            borderTop={borderTop}
            borderBottom={borderBottom}
            borderColor={borderColor}
            setBorderLeft={setBorderLeft}
            setBorderRight={setBorderRight}
            setBorderTop={setBorderTop}
            setBorderBottom={setBorderBottom}
            setBorderColor={setBorderColor}
          />
        ) : null}
      </Drawer>
    </Container>
  )
}
