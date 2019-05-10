import React, { useRef, useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import path from 'path'
import { readFile, writeFile, readdir } from 'fs'
import { promisify } from 'util'
import createRandomString from '../../lib/createRandomString'
import createHashPath from '../../lib/createHashPath'
import createTFName from '../../lib/createTFName'
import drawBorder from './drawBorder'
import createGIF from './createGIF'
import { AppContext } from '../App'
import Drawer from './Drawer'
import TitleFrame from './TitleFrame'
import Border from './Border'
import RecentProjects from './RecentProjects'
import Toolbar from './Toolbar'
import Thumbnails from './Thumbnails'
import { Container, Main, Wrapper, Canvas1, Canvas2 } from './styles'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  appActions: { SET_APP_MODE, SET_GIF_FOLDER },
  constants: { IMAGE_TYPE }
} = config

const readdirAsync = promisify(readdir)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)
  const { options, gifFolder } = state

  const [recentProjects, setRecentProjects] = useState([])

  const [images, setImages] = useState([])
  const [gifData, setGifData] = useState(null)
  const [scale, setScale] = useState(null)
  const [zoomToFit, setZoomToFit] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState('')
  const [drawerHeight, setDrawerHeight] = useState(null)

  const [borderLeft, setBorderLeft] = useState(0)
  const [borderRight, setBorderRight] = useState(0)
  const [borderTop, setBorderTop] = useState(0)
  const [borderBottom, setBorderBottom] = useState(0)
  const [borderColor, setBorderColor] = useState('#000000')

  const [titleText, setTitleText] = useState('Title Frame')
  const [titleColor, setTitleColor] = useState('#000000')
  const [titleSize, setTitleSize] = useState(40)
  const [titleDelay, setTitleDelay] = useState(500)
  const [titleBackground, setTitleBackground] = useState('#FFFF00')

  const container = useRef(null)
  const main = useRef(null)
  const wrapper = useRef(null)
  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const thumbnail = useRef(null)

  useEffect(() => {
    async function initialize() {
      const projects = []
      const dirs = await readdirAsync(RECORDINGS_DIRECTORY)

      const mainHeight = container.current.clientHeight - 200
      main.current.style.height = mainHeight + 'px'
      setDrawerHeight(mainHeight - 90)

      for (const dir of dirs) {
        const projectPath = path.join(RECORDINGS_DIRECTORY, dir, 'project.json')
        const data = await readFileAsync(projectPath)
        const project = JSON.parse(data)

        if (dir === gifFolder) {
          const heightRatio =
            Math.round((mainHeight / project.height) * 100) / 100
          const initialScale = heightRatio < 1 ? heightRatio : 1
          setImages(project.frames)
          setGifData({
            relative: project.relative,
            width: project.width,
            height: project.height,
            frameRate: project.frameRate
          })
          setScale(initialScale)
          setZoomToFit(initialScale)
        } else {
          projects.push(project)
        }
      }

      setRecentProjects(projects)
    }

    initialize()
  }, [gifFolder])

  useEffect(() => {
    if (images.length && scale) {
      wrapper.current.style.width = gifData.width * scale + 'px'
      wrapper.current.style.height = gifData.height * scale + 'px'
      canvas1.current.width = gifData.width * scale
      canvas1.current.height = gifData.height * scale
      canvas2.current.width = gifData.width * scale
      canvas2.current.height = gifData.height * scale
      const ctx1 = canvas1.current.getContext('2d')

      if (drawerMode === 'title') {
        ctx1.fillStyle = titleBackground
        ctx1.fillRect(0, 0, canvas1.current.width, canvas1.current.height)

        ctx1.fillStyle = titleColor
        ctx1.font = `${titleSize}px sans-serif`
        const x =
          canvas1.current.width / 2 - ctx1.measureText(titleText).width / 2
        const y = canvas1.current.height / 2 - titleSize / 2
        ctx1.fillText(titleText, x, y)
      } else {
        ctx1.scale(scale, scale)
        const image = new Image()
        image.onload = () => {
          ctx1.drawImage(image, 0, 0)
        }
        image.src = images[imageIndex].path
      }
    }
  }, [
    images,
    imageIndex,
    scale,
    drawerMode,
    titleText,
    titleSize,
    titleColor,
    titleBackground
  ])

  useEffect(() => {
    if (drawerMode === 'border') {
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

  function onNewRecordingClick() {
    dispatch({ type: SET_APP_MODE, payload: 0 })
  }

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
        const cwd = path.join(RECORDINGS_DIRECTORY, gifData.relative)
        createGIF(images, cwd, filepath)
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

  function onTitleAccept() {
    const reader = new FileReader()

    reader.onload = () => {
      const filepath = path.join(
        RECORDINGS_DIRECTORY,
        gifData.relative,
        createTFName()
      )
      const buffer = Buffer.from(reader.result)
      writeFileAsync(filepath, buffer).then(() => {
        setShowDrawer(false)
        setDrawerMode('')
      })
    }

    const canvas = document.createElement('canvas')
    canvas.width = gifData.width
    canvas.height = gifData.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = titleBackground
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = titleColor
    ctx.font = `${titleSize}px sans-serif`
    const x = canvas.width / 2 - ctx.measureText(titleText).width / 2
    const y = canvas.height / 2 - titleSize / 2
    ctx.fillText(titleText, x, y)
    canvas.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
  }

  function onTitleCancel() {
    setShowDrawer(false)
    setDrawerMode('')
    setTitleText('Title Frame')
  }

  function onBorderAccept() {
    const reader = new FileReader()

    reader.onload = () => {
      const filepath = path.join(
        RECORDINGS_DIRECTORY,
        gifData.relative,
        `${imageIndex}.png`
      )
      const buffer = Buffer.from(reader.result)
      writeFileAsync(filepath, buffer).then(() => {
        images[imageIndex].path = createHashPath(images[imageIndex].path)
        setShowDrawer(false)
        setScale(zoomToFit)
      })
    }

    const canvas = document.createElement('canvas')
    canvas.width = gifData.width
    canvas.height = gifData.height
    const ctx = canvas.getContext('2d')
    const image = new Image()
    image.onload = () => {
      ctx.drawImage(image, 0, 0)
      drawBorder(
        canvas,
        borderLeft,
        borderRight,
        borderTop,
        borderBottom,
        borderColor
      )
      canvas.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
    }
    image.src = images[imageIndex].path
  }

  function onBorderCancel() {
    const ctx2 = canvas2.current.getContext('2d')
    ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  function onRecentAccept(folder) {
    dispatch({ type: SET_GIF_FOLDER, payload: folder })
    setShowDrawer(false)
  }

  function onRecentCancel() {
    setShowDrawer(false)
  }

  function onThumbnailClick(e, i) {
    setImageIndex(i)
  }

  return (
    <Container ref={container}>
      <Toolbar
        scale={scale}
        zoomToFit={zoomToFit}
        playing={playing}
        setScale={setScale}
        setShowDrawer={setShowDrawer}
        setDrawerMode={setDrawerMode}
        onNewRecordingClick={onNewRecordingClick}
        onSaveClick={onSaveClick}
        onPlaybackClick={onPlaybackClick}
      />
      <Main
        ref={main}
        shift={showDrawer}
        color={options.get('checkerColor')}
        size={options.get('checkerSize')}
      >
        <Wrapper ref={wrapper}>
          <Canvas1 ref={canvas1} />
          <Canvas2 ref={canvas2} />
        </Wrapper>
      </Main>
      <Thumbnails
        thumbnail={thumbnail}
        images={images}
        imageIndex={imageIndex}
        onClick={onThumbnailClick}
      />
      <Drawer show={showDrawer}>
        {drawerMode === 'title' ? (
          <TitleFrame
            drawerHeight={drawerHeight}
            titleText={titleText}
            titleDelay={titleDelay}
            titleBackground={titleBackground}
            setTitleText={setTitleText}
            setTitleDelay={setTitleDelay}
            setTitleBackground={setTitleBackground}
            onAccept={onTitleAccept}
            onCancel={onTitleCancel}
          />
        ) : drawerMode === 'border' ? (
          <Border
            drawerHeight={drawerHeight}
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
            onAccept={onBorderAccept}
            onCancel={onBorderCancel}
          />
        ) : drawerMode === 'recent' ? (
          <RecentProjects
            drawerHeight={drawerHeight}
            recentProjects={recentProjects}
            onAccept={onRecentAccept}
            onCancel={onRecentCancel}
          />
        ) : null}
      </Drawer>
    </Container>
  )
}
