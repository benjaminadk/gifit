import React, { useRef, useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import { Map, List } from 'immutable'
import path from 'path'
import { readFile, writeFile, readdir, rmdir, unlink } from 'fs'
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
import BottomBar from './BottomBar'
import { Container, Main, Wrapper, Canvas1, Canvas2 } from './styles'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  appActions: { SET_APP_MODE, SET_GIF_FOLDER },
  constants: { IMAGE_TYPE }
} = config

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const readdirAsync = promisify(readdir)
const rmdirAsync = promisify(rmdir)
const unlinkAsync = promisify(unlink)

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)
  const { options, gifFolder } = state

  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(List())

  const [images, setImages] = useState([])
  const [imageIndex, setImageIndex] = useState(null)
  const [gifData, setGifData] = useState(null)

  const [scale, setScale] = useState(null)
  const [zoomToFit, setZoomToFit] = useState(null)

  const [recentProjects, setRecentProjects] = useState([])
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
  const [titleFont, setTitleFont] = useState('Segoe UI')
  const [titleStyle, setTitleStyle] = useState('Normal')
  const [titleDelay, setTitleDelay] = useState(500)
  const [titleBackground, setTitleBackground] = useState('#FFFF00')

  const container = useRef(null)
  const main = useRef(null)
  const wrapper = useRef(null)
  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const thumbnail = useRef(null)

  // initialize editor
  async function initialize(initialIndex = 0) {
    setLoading(true)
    const projects = []
    // read all project directories
    const dirs = await readdirAsync(RECORDINGS_DIRECTORY)
    // calculate main editor section height
    // total height - toolbar height - thumbnails height - bottom bar height
    const mainHeight = container.current.clientHeight - 100 - 100 - 20
    main.current.style.height = mainHeight + 'px'
    // calculate main drawer height - drawer header height - drawer footer height
    setDrawerHeight(mainHeight - 40 - 50)
    // loop over all projects
    for (const dir of dirs) {
      // each project is represented by a project.json file
      const projectPath = path.join(RECORDINGS_DIRECTORY, dir, 'project.json')
      const data = await readFileAsync(projectPath)
      const project = JSON.parse(data)
      // isolate current project by matching gifFolder app state
      if (dir === gifFolder) {
        // ratio of available height to height of image
        const heightRatio = Math.floor((mainHeight / project.height) * 100) / 100
        // if ratio less than 1 image is taller than editor and height ratio is intial scale 0 - 1
        // if ratio greater than 1 image is shorter than editor and set scale to 1 or actual size
        const initialScale = heightRatio < 1 ? heightRatio : 1
        // use immutable list to manage selected frames true=selected
        // initialIndex default is 0 but other value can be used
        const initialSelected = List(Array(project.frames.length).fill(false)).set(
          initialIndex,
          true
        )
        // set state
        setSelected(initialSelected)
        setScale(initialScale)
        setZoomToFit(initialScale)
        setImages(project.frames)
        setImageIndex(initialIndex)
        setGifData({
          relative: project.relative,
          date: project.date,
          width: project.width,
          height: project.height,
          frameRate: project.frameRate
        })
        // store all other projects as recent projects
      } else {
        projects.push(project)
      }
    }
    setRecentProjects(projects)
    setLoading(false)
  }

  // ensure window is maximized
  useEffect(() => {
    remote.getCurrentWindow().maximize()
  }, [])

  // call initialize onload and when gifFolder changes
  useEffect(() => {
    initialize()
  }, [gifFolder])

  // manage main canvas
  useEffect(() => {
    // only run if state variables are set
    if (images.length && scale && gifData) {
      // set w:h to project size and adjust for scale
      wrapper.current.style.width = gifData.width * scale + 'px'
      wrapper.current.style.height = gifData.height * scale + 'px'
      canvas1.current.width = gifData.width * scale
      canvas1.current.height = gifData.height * scale
      canvas2.current.width = gifData.width * scale
      canvas2.current.height = gifData.height * scale
      const ctx1 = canvas1.current.getContext('2d')

      // title frame replace image when in title drawerMode
      if (drawerMode === 'title') {
        ctx1.fillStyle = titleBackground
        ctx1.fillRect(0, 0, canvas1.current.width, canvas1.current.height)
        ctx1.fillStyle = titleColor
        ctx1.font = `${titleStyle} ${titleSize * scale}px ${titleFont}`
        const x = canvas1.current.width / 2 - ctx1.measureText(titleText).width / 2
        const y = canvas1.current.height / 2 - titleSize / 2
        ctx1.fillText(titleText, x, y)
        // create image, set scale on context and draw image
      } else {
        // only if imageIndex is not null
        if (imageIndex !== null) {
          ctx1.scale(scale, scale)
          const image = new Image()
          image.onload = () => {
            ctx1.drawImage(image, 0, 0)
          }
          image.src = images[imageIndex].path
        }
      }
    }
  }, [
    images,
    gifData,
    imageIndex,
    scale,
    drawerMode,
    titleText,
    titleSize,
    titleFont,
    titleStyle,
    titleColor,
    titleBackground
  ])

  // manage second canvas (overlays)
  useEffect(() => {
    // when border drawer open redraw canvas on size or color change
    if (drawerMode === 'border') {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
      drawBorder(canvas2.current, borderLeft, borderRight, borderTop, borderBottom, borderColor)
      // clear canvas when drawer is closed
    } else {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    }
  }, [drawerMode, borderLeft, borderRight, borderTop, borderBottom, borderColor])

  // when imageIndex change is automated scroll to it
  useEffect(() => {
    if (thumbnail.current) {
      thumbnail.current.scrollIntoView()
    }
  }, [imageIndex])

  // play gif frame by frame when playing is set to true
  useEffect(() => {
    var playingId
    if (playing) {
      // use function version of useState setter
      playingId = setInterval(() => {
        setImageIndex(index => (index === images.length - 1 ? 0 : index + 1))
      }, Math.round(1000 / gifData.frameRate))
      // clear interval when playing is set to false
    } else {
      clearInterval(playingId)
    }
    return () => clearInterval(playingId)
  }, [playing])

  // listen for keypress events
  useEffect(() => {
    function onKeyDown({ keyCode }) {
      if (keyCode === 46) {
        onFrameDeleteClick()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected])

  function onNewRecordingClick() {
    dispatch({ type: SET_APP_MODE, payload: 0 })
  }

  function onSaveClick() {
    const win = remote.getCurrentWindow()

    if (options.get('ffmpegPath')) {
      const opts = {
        title: 'Save',
        defaultPath: path.join(remote.app.getPath('downloads'), `${createRandomString()}.gif`),
        buttonLabel: 'Save',
        filters: [{ name: 'GIF File', extensions: ['gif'] }]
      }
      const callback = async filepath => {
        if (filepath) {
          setLoading(true)
          const cwd = path.join(RECORDINGS_DIRECTORY, gifData.relative)
          const success = await createGIF(images, cwd, filepath)
          setLoading(false)
        }
      }
      remote.dialog.showSaveDialog(win, opts, callback)
    } else {
      // go to options where ffmpeg can be added
    }
  }

  function onDiscardProjectClick() {
    const win = remote.getCurrentWindow()
    const opts = {
      type: 'question',
      buttons: ['Discard', 'Cancel'],
      defaultId: 0,
      title: `Discard Project`,
      message: `Are you sure you want to discard?`,
      detail: `Action will delete current project.`
    }
    const callback = async result => {
      if (result === 0) {
        const ctx1 = canvas1.current.getContext('2d')
        ctx1.clearRect(0, 0, gifData.width, gifData.height)

        const projectDir = path.join(RECORDINGS_DIRECTORY, gifData.relative)
        const files = await readdirAsync(projectDir)

        for (const file of files) {
          await unlinkAsync(path.join(projectDir, file))
        }

        rmdirAsync(projectDir).then(() => {
          initialize(null)
          setSelected(List())
          setImages([])
          setGifData(null)
        })
      }
    }
    remote.dialog.showMessageBox(win, opts, callback)
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

  function onFrameDeleteClick() {
    const count = selected.count(el => el)
    if (count === 0) {
      return
    }
    const win = remote.getCurrentWindow()
    const opts = {
      type: 'question',
      buttons: ['Delete', 'Cancel'],
      defaultId: 0,
      title: `Delete Frames`,
      message: `Are you sure you want to delete?`,
      detail: `Action will delete ${count} selected frame${count === 1 ? '' : 's'}.`
    }
    const callback = result => {
      if (result === 0) {
        const oldImages = images.filter((el, i) => selected.get(i))
        const newImages = images.filter((el, i) => !selected.get(i))
        const newProject = { ...gifData, frames: newImages }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          initialize(selected.findIndex(el => el))
        })
        for (const image of oldImages) {
          unlinkAsync(image.path)
        }
      }
    }
    remote.dialog.showMessageBox(win, opts, callback)
  }

  function onTitleAccept() {
    const reader = new FileReader()
    const filepath = path.join(RECORDINGS_DIRECTORY, gifData.relative, createTFName())
    reader.onload = () => {
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

    const newImages = images.slice()
    newImages.splice(imageIndex, 0, { path: filepath, time: titleDelay })
    const newProject = { ...gifData, frames: newImages }
    const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
    writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
      initialize()
    })
  }

  function onTitleCancel() {
    setShowDrawer(false)
    setDrawerMode('')
    setTitleText('Title Frame')
  }

  function onBorderAccept() {
    const reader = new FileReader()

    reader.onload = () => {
      const filepath = images[imageIndex].path
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
      drawBorder(canvas, borderLeft, borderRight, borderTop, borderBottom, borderColor)
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

  function onThumbnailClick(e, index) {
    if (e.ctrlKey && e.shiftKey) {
      setSelected(
        selected.map(
          (el, i) => (i >= Math.min(index, imageIndex) && i <= Math.max(index, imageIndex)) || el
        )
      )
      setImageIndex(index)
    } else if (e.shiftKey) {
      setSelected(
        selected.map(
          (el, i) => i >= Math.min(index, imageIndex) && i <= Math.max(index, imageIndex)
        )
      )
      setImageIndex(index)
    } else if (e.ctrlKey) {
      if (index === imageIndex) {
        setSelected(selected.set(index, false))
        setImageIndex(null)
      } else {
        setSelected(selected.set(index, true))
        setImageIndex(index)
      }
    } else {
      setSelected(selected.map((el, i) => index === i))
      setImageIndex(index)
    }
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
        onDiscardProjectClick={onDiscardProjectClick}
        onPlaybackClick={onPlaybackClick}
        onFrameDeleteClick={onFrameDeleteClick}
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
        selected={selected}
        images={images}
        imageIndex={imageIndex}
        onClick={onThumbnailClick}
      />
      <BottomBar loading={loading} />
      <Drawer show={showDrawer}>
        {drawerMode === 'title' ? (
          <TitleFrame
            drawerHeight={drawerHeight}
            titleText={titleText}
            titleDelay={titleDelay}
            titleSize={titleSize}
            titleFont={titleFont}
            titleStyle={titleStyle}
            titleColor={titleColor}
            titleBackground={titleBackground}
            setTitleText={setTitleText}
            setTitleDelay={setTitleDelay}
            setTitleSize={setTitleSize}
            setTitleFont={setTitleFont}
            setTitleStyle={setTitleStyle}
            setTitleColor={setTitleColor}
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
