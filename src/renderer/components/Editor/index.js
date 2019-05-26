import React, { useRef, useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import { List } from 'immutable'
import path from 'path'
import { readFile, writeFile, readdir, rmdir, unlink } from 'fs'
import { promisify } from 'util'
import createRandomString from '../../lib/createRandomString'
import createHashPath from '../../lib/createHashPath'
import createTFName from '../../lib/createTFName'
import initializeOptions from '../Options/initializeOptions'
import initializeRecorder from '../Recorder/initializeRecorder'
import initializeWebcam from '../Webcam/initializeWebcam'
import drawBorder from './Border/drawBorder'
import drawProgressBar from './Progress/drawProgressBar'
import drawProgressText from './Progress/drawProgressText'
import drawFree from './FreeDrawing/drawFree'
import drawErase from './FreeDrawing/drawErase'
import drawBrush from './FreeDrawing/drawBrush'
import drawEraser from './FreeDrawing/drawEraser'
import createGIFFfmpeg from './createGIFFfmpeg'
import createGIFEncoder from './createGIFEncoder'
import getTextXY from './getTextXY'
import { AppContext } from '../App'
import CropOverlay from './Crop/CropOverlay'
import WatermarkOverlay from './Watermark/WatermarkOverlay'
import Drawer from './Drawer'
import Resize from './Resize'
import Crop from './Crop'
import TitleFrame from './TitleFrame'
import FreeDrawing from './FreeDrawing'
import Border from './Border'
import Watermark from './Watermark'
import Progress from './Progress'
import RecentProjects from './RecentProjects'
import Override from './Override'
import Toolbar from './Toolbar'
import Thumbnails from './Thumbnails'
import BottomBar from './BottomBar'
import { Container, Main, Wrapper, Canvas1, Canvas2, Canvas3, Canvas4, Canvas5 } from './styles'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  mainWindow,
  appActions: { SET_APP_MODE, SET_PROJECT_FOLDER, SET_OPTIONS_OPEN },
  constants: { IMAGE_TYPE }
} = config

// make node fs methods asynchronous
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const readdirAsync = promisify(readdir)
const rmdirAsync = promisify(rmdir)
const unlinkAsync = promisify(unlink)

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)
  const { options, optionsOpen, fontOptions, projectFolder } = state

  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [imageIndex, setImageIndex] = useState(null)
  const [selected, setSelected] = useState(List())

  const [gifData, setGifData] = useState(null)
  const [originalPaths, setOriginalPaths] = useState(null)
  const [totalDuration, setTotalDuration] = useState(null)
  const [averageDuration, setAverageDuration] = useState(null)

  const [thumbWidth, setThumbWidth] = useState(100)
  const [thumbHeight, setThumbHeight] = useState(56)

  const [scale, setScale] = useState(null)
  const [zoomToFit, setZoomToFit] = useState(null)

  const [recentProjects, setRecentProjects] = useState(null)
  const [playing, setPlaying] = useState(false)

  const [mainHeight, setMainHeight] = useState(0)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState('')
  const [drawerHeight, setDrawerHeight] = useState(0)

  const [drawXY, setDrawXY] = useState(null)
  const [drawing, setDrawing] = useState(false)
  const [drawType, setDrawType] = useState('pen')
  const [drawPenWidth, setDrawPenWidth] = useState(50)
  const [drawPenHeight, setDrawPenHeight] = useState(50)
  const [drawPenColor, setDrawPenColor] = useState('#FFFF00')
  const [drawShape, setDrawShape] = useState('rectangle')
  const [drawHighlight, setDrawHighlight] = useState(false)
  const [drawEraserWidth, setDrawEraserWidth] = useState(10)
  const [drawEraserHeight, setDrawEraserHeight] = useState(10)

  const [borderLeft, setBorderLeft] = useState(0)
  const [borderRight, setBorderRight] = useState(0)
  const [borderTop, setBorderTop] = useState(0)
  const [borderBottom, setBorderBottom] = useState(0)
  const [borderColor, setBorderColor] = useState('#000000')

  const [progressType, setProgressType] = useState('bar')
  const [progressBackground, setProgressBackground] = useState('#00FF00')
  const [progressThickness, setProgressThickness] = useState(20)
  const [progressVertical, setProgressVertical] = useState('Bottom')
  const [progressHorizontal, setProgressHorizontal] = useState('Left')
  const [progressOrientation, setProgressOrientation] = useState('Horizontal')
  const [progressColor, setProgressColor] = useState('#000000')
  const [progressSize, setProgressSize] = useState(40)
  const [progressFont, setProgressFont] = useState('Segoe UI')
  const [progressStyle, setProgressStyle] = useState('Normal')
  const [progressPrecision, setProgressPrecision] = useState('Seconds')

  const [watermarkPath, setWatermarkPath] = useState('')
  const [watermarkWidth, setWatermarkWidth] = useState(0)
  const [watermarkHeight, setWatermarkHeight] = useState(0)
  const [watermarkX, setWatermarkX] = useState(0)
  const [watermarkY, setWatermarkY] = useState(0)
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.7)
  const [watermarkScale, setWatermarkScale] = useState(1)
  const [watermarkRealWidth, setWatermarkRealWidth] = useState(0)
  const [watermarkRealHeight, setWatermarkRealHeight] = useState(0)

  const [titleText, setTitleText] = useState('Title Frame')
  const [titleColor, setTitleColor] = useState('#000000')
  const [titleSize, setTitleSize] = useState(40)
  const [titleFont, setTitleFont] = useState('Segoe UI')
  const [titleStyle, setTitleStyle] = useState('Normal')
  const [titleDelay, setTitleDelay] = useState(500)
  const [titleVertical, setTitleVertical] = useState('Center')
  const [titleHorizontal, setTitleHorizontal] = useState('Center')
  const [titleBackground, setTitleBackground] = useState('#FFFF00')

  const [cropWidth, setCropWidth] = useState(0)
  const [cropHeight, setCropHeight] = useState(0)
  const [cropX, setCropX] = useState(0)
  const [cropY, setCropY] = useState(0)

  const [overrideMS, setOverrideMS] = useState(100)

  const container = useRef(null)
  const main = useRef(null)
  const wrapper = useRef(null)
  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const canvas3 = useRef(null)
  const canvas4 = useRef(null)
  const canvas5 = useRef(null)
  const thumbnail = useRef(null)

  // initialize editor
  async function initialize(initialIndex = 0) {
    setLoading(true)
    const projects = []
    // read all project directories
    const dirs = await readdirAsync(RECORDINGS_DIRECTORY)
    // loop over all projects
    for (const dir of dirs) {
      // each project is represented by a project.json file
      const projectPath = path.join(RECORDINGS_DIRECTORY, dir, 'project.json')
      const data = await readFileAsync(projectPath)
      const project = JSON.parse(data)
      // isolate current project by matching projectFolder app state
      if (dir === projectFolder) {
        // calcuate ratios for image w:h and h:w
        const imageRatio = Math.floor((project.width / project.height) * 100) / 100
        const inverseRatio = Math.floor((project.height / project.width) * 100) / 100
        // set longer dimension to 100px and calculate other dimension based on ratio
        var tWidth, tHeight
        if (imageRatio >= 1) {
          tWidth = 100
          tHeight = 100 * inverseRatio
        } else {
          tWidth = 100 * imageRatio
          tHeight = 100
        }
        // calculate main editor section height
        // total height - toolbar height - thumbnails height - bottom bar height
        const initialMainHeight = container.current.clientHeight - 120 - tHeight - 40 - 20
        // drawer height = main height - drawer header height - drawer buttons height
        const initialDrawerHeight = initialMainHeight - 40 - 50
        // ratio of available height to height of image
        const heightRatio = Math.floor((initialMainHeight / project.height) * 100) / 100
        // if ratio less than 1 image is taller than editor and height ratio is intial scale 0 - 1
        // if ratio greater than 1 image is shorter than editor and set scale to 1 or actual size
        const initialScale = heightRatio < 1 ? heightRatio : 1
        // use immutable list to manage selected frames true=selected
        // initialIndex default is 0 but other value can be used
        const initialSelected = List(Array(project.frames.length).fill(false)).set(
          initialIndex,
          true
        )
        // add time of all frames to determine total duration
        const totalDuration = project.frames.reduce((acc, val) => (acc += val.time), 0)
        // divide total by number of frames to get average duration
        const averageDuration = Math.round((totalDuration / project.frames.length) * 10) / 10
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
        setOriginalPaths(project.frames.map(el => el.path))
        setTotalDuration(totalDuration)
        setAverageDuration(averageDuration)
        setMainHeight(initialMainHeight)
        setDrawerHeight(initialDrawerHeight)
        setThumbWidth(tWidth)
        setThumbHeight(tHeight)
        // store all other projects as recent projects
      } else {
        projects.push(project)
      }
    }
    setRecentProjects(projects)
    setLoading(false)
    setShowDrawer(false)
  }

  // ensure window is maximized
  useEffect(() => {
    remote.getCurrentWindow().maximize()
    remote.getCurrentWindow().setTitle('GifIt - Editor')
  }, [])

  // call initialize onload and when projectFolder changes
  useEffect(() => {
    initialize()
  }, [projectFolder])

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
      canvas3.current.width = gifData.width * scale
      canvas3.current.height = gifData.height * scale
      canvas4.current.width = gifData.width * scale
      canvas4.current.height = gifData.height * scale
      canvas5.current.width = gifData.width * scale
      canvas5.current.height = gifData.height * scale
      const ctx1 = canvas1.current.getContext('2d')
      // title frame replaces image when in title drawerMode
      if (drawerMode === 'title') {
        ctx1.textBaseline = 'middle'
        ctx1.fillStyle = titleBackground
        ctx1.fillRect(0, 0, canvas1.current.width, canvas1.current.height)
        ctx1.fillStyle = titleColor
        ctx1.font = `${titleStyle} ${titleSize * scale}px ${titleFont}`
        const { x, y } = getTextXY(
          canvas1.current,
          titleVertical,
          titleHorizontal,
          titleSize,
          titleText,
          scale
        )
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
    titleVertical,
    titleHorizontal,
    titleBackground
  ])

  // manage second canvas (overlays)
  useEffect(() => {
    // when border drawer open redraw borders preview based on border parameters
    if (drawerMode === 'border') {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
      drawBorder(canvas2.current, borderLeft, borderRight, borderTop, borderBottom, borderColor)
      // when progress drawer is open redraw progress preview based on progress parameters
    } else if (drawerMode === 'progress') {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
      if (progressType === 'bar') {
        drawProgressBar(
          canvas2.current,
          50,
          progressBackground,
          progressHorizontal,
          progressVertical,
          progressOrientation,
          progressThickness
        )
      } else if (progressType === 'text') {
        drawProgressText(
          canvas2.current,
          0,
          totalDuration,
          progressBackground,
          progressHorizontal,
          progressVertical,
          progressFont,
          progressSize,
          progressStyle,
          progressColor,
          progressPrecision
        )
      }
    } else {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    }
  }, [
    showDrawer,
    drawerMode,
    totalDuration,
    borderLeft,
    borderRight,
    borderTop,
    borderBottom,
    borderColor,
    progressType,
    progressBackground,
    progressThickness,
    progressVertical,
    progressHorizontal,
    progressOrientation,
    progressFont,
    progressSize,
    progressStyle,
    progressColor,
    progressPrecision
  ])

  useEffect(() => {
    var sub
    if (showToolbar) {
      sub = 120
    } else {
      sub = 25
    }
    const initialMainHeight = container.current.clientHeight - sub - thumbHeight - 40 - 20
    const initialDrawerHeight = initialMainHeight - 40 - 50
    setMainHeight(initialMainHeight)
    setDrawerHeight(initialDrawerHeight)
  }, [showToolbar, thumbHeight])

  // when drawer is closed set mode to empty string
  useEffect(() => {
    if (!showDrawer) {
      setDrawerMode('')
    }
  }, [showDrawer])

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
      setSelected(selected.map((el, i) => i === imageIndex))
    }
    return () => clearInterval(playingId)
  }, [playing])

  // listen for keypress events
  useEffect(() => {
    // listen for delete key
    function onKeyDown({ keyCode }) {
      if (keyCode === 46) {
        onFrameDeleteClick('selection')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected])

  useEffect(() => {
    if (watermarkPath) {
      const image = new Image()
      image.onload = () => {
        var w, h
        const ratio = Math.floor((image.width / image.height) * 100) / 100
        const inverse = Math.floor((image.height / image.width) * 100) / 100
        if (image.height > gifData.height) {
          w = gifData.height * ratio
          h = gifData.height
        } else if (image.width > gifData.width) {
          w = gifData.width
          h = gifData.width * inverse
        } else {
          w = image.width
          h = image.height
        }
        setWatermarkWidth(w)
        setWatermarkHeight(h)
        setWatermarkRealWidth(w)
        setWatermarkRealHeight(h)
      }
      image.src = watermarkPath
    }
  }, [watermarkPath, gifData])

  // navigate back recorder
  function onNewRecordingClick() {
    initializeRecorder(state, dispatch)
    dispatch({ type: SET_APP_MODE, payload: 0 })
    remote.getCurrentWindow().setSize(mainWindow.width, mainWindow.height)
    remote.getCurrentWindow().center()
    remote.getCurrentWindow().setTitle('GifIt - Start Page')
  }

  // navigate to webcam
  function onNewWebcamClick() {
    initializeWebcam(state, dispatch)
    dispatch({ type: SET_APP_MODE, payload: 0 })
    remote.getCurrentWindow().setSize(mainWindow.width, mainWindow.height)
    remote.getCurrentWindow().center()
    remote.getCurrentWindow().setTitle('GifIt - Start Page')
  }

  // save project as a GIF
  function onSaveClick() {
    const win = remote.getCurrentWindow()
    // default to downloads directory with random filename.gif
    const opts = {
      title: 'Save',
      defaultPath: path.join(remote.app.getPath('downloads'), `${createRandomString()}.gif`),
      buttonLabel: 'Save',
      filters: [
        {
          name: 'GIF File',
          extensions: ['gif']
        }
      ]
    }
    const callback = async filepath => {
      if (filepath) {
        setLoading(true)
        const gifProcessor = options.get('gifProcessor')
        // user can chose javascript encoder or ffmpeg to create GIF
        if (gifProcessor === 'ffmpeg') {
          const ffmpegPath = options.get('ffmpegPath')
          const cwd = path.join(RECORDINGS_DIRECTORY, gifData.relative)
          await createGIFFfmpeg(ffmpegPath, images, originalPaths, cwd, filepath)
        } else if (gifProcessor === 'gifEncoder') {
          await createGIFEncoder(images, originalPaths, gifData, filepath)
        }
        setLoading(false)
      }
    }
    remote.dialog.showSaveDialog(win, opts, callback)
  }

  // remove a project and delete all associated files
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
        // clear the image canvas layer
        const ctx1 = canvas1.current.getContext('2d')
        ctx1.clearRect(0, 0, gifData.width, gifData.height)
        // read all files from project directory
        const projectDir = path.join(RECORDINGS_DIRECTORY, gifData.relative)
        const files = await readdirAsync(projectDir)
        // loop through and delete all files
        for (const file of files) {
          await unlinkAsync(path.join(projectDir, file))
        }
        // delete empty directory and re-initialize editor
        rmdirAsync(projectDir).then(() => {
          setSelected(List())
          setImages([])
          setGifData(null)
          initialize(null)
        })
      }
    }
    remote.dialog.showMessageBox(win, opts, callback)
  }

  // playback interface
  // index refers to button order 0=first 1=previous 2=play/pause 3=next 4=last
  function onPlaybackClick(index) {
    if (!gifData) {
      return
    }
    if (index === 2) {
      setPlaying(!playing)
    } else {
      var x
      if (index === 0) {
        x = 0
      } else if (index === 1) {
        x = imageIndex === 0 ? images.length - 1 : imageIndex - 1
      } else if (index === 3) {
        x = imageIndex === images.length - 1 ? 0 : imageIndex + 1
      } else if (index === 4) {
        x = images.length - 1
      }
      setImageIndex(x)
      setSelected(selected.map((el, i) => i === x))
    }
  }

  // delete selected frames from project
  function onFrameDeleteClick(type) {
    // number of frames to delete
    var count
    if (type === 'selection') {
      count = selected.count(el => el)
    } else if (type === 'previous') {
      count = imageIndex
    } else {
      count = images.length - imageIndex - 1
    }
    // if not deleting any frames delete
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
        var deleteImages, keepImages
        if (type === 'selection') {
          deleteImages = images.filter((el, i) => selected.get(i))
          keepImages = images.filter((el, i) => !selected.get(i))
        } else if (type === 'previous') {
          deleteImages = images.filter((el, i) => i < imageIndex)
          keepImages = images.filter((el, i) => i >= imageIndex)
        } else {
          deleteImages = images.filter((el, i) => i > imageIndex)
          keepImages = images.filter((el, i) => i <= imageIndex)
        }
        // overwrite project.json with new images
        const newProject = { ...gifData, frames: keepImages }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          initialize()
        })
        // delete old images
        for (const image of deleteImages) {
          unlinkAsync(image.path)
        }
      }
    }
    remote.dialog.showMessageBox(win, opts, callback)
  }

  // toolbar selection controls
  // index refers to button 0=all 1=inverse 2=deselect
  function onSelectClick(index) {
    if (index === 0) {
      setImageIndex(imageIndex === null ? 0 : imageIndex)
      setSelected(selected.map(el => true))
    } else if (index === 1) {
      const newIndex = selected.findIndex(el => !el)
      setImageIndex(newIndex === -1 ? null : newIndex)
      setSelected(selected.map(el => !el))
    } else if (index === 2) {
      setImageIndex(null)
      setSelected(selected.map(el => false))
    }
  }

  // open drawer, adjust scale, side effects, and assign drawer mode
  function onOpenDrawer(mode) {
    if (mode === 'recent') {
    } else {
      if (!gifData) {
        return
      }
      if (mode === 'title') {
        setScale(zoomToFit)
      } else if (mode === 'border') {
        setScale(1)
      } else if (mode === 'progress') {
        setScale(1)
        setTimeout(() => {
          var height
          if (progressVertical === 'Bottom') {
            height = main.current.scrollHeight
          } else if (progressVertical === 'Center') {
            height = main.current.scrollHeight / 2
          }
          main.current.scrollTop = height
        }, 500)
      } else if (mode === 'watermark') {
        setScale(1)
      } else if (mode === 'drawing') {
        setScale(1)
      } else if (mode === 'resize') {
      } else if (mode === 'crop') {
        setScale(1)
        setCropWidth(gifData.width)
        setCropHeight(gifData.height)
      }
    }
    setDrawerMode(mode)
    setShowDrawer(true)
  }

  // open a recent project
  function onRecentAccept(folder) {
    dispatch({ type: SET_PROJECT_FOLDER, payload: folder })
  }

  // close recent project drawer
  function onRecentCancel() {
    setShowDrawer(false)
  }

  async function onResizeAccept(newWidth, newHeight) {
    const newGifData = {
      ...gifData,
      width: newWidth,
      height: newHeight
    }
    const newFrames = images.slice()

    async function draw() {
      return new Promise(resolve => {
        for (const [i, img] of images.entries()) {
          const reader = new FileReader()

          reader.onload = () => {
            const filepath = originalPaths[i]
            const buffer = Buffer.from(reader.result)
            writeFileAsync(filepath, buffer).then(() => {
              images[i].path = createHashPath(images[i].path)
              if (i === images.length - 1) {
                resolve()
              }
            })
          }

          const widthScale = newWidth / gifData.width
          const heightScale = newHeight / gifData.height
          const canvas = document.createElement('canvas')
          canvas.width = newWidth
          canvas.height = newHeight
          const ctx = canvas.getContext('2d')
          ctx.scale(widthScale, heightScale)
          const image = new Image()
          image.onload = () => {
            ctx.drawImage(image, 0, 0)
            canvas.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
          }
          image.src = images[i].path
        }
      })
    }

    async function update() {
      return new Promise(resolve => {
        const newProject = { ...newGifData, frames: newFrames }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          const imageRatio = Math.floor((newWidth / newHeight) * 100) / 100
          const inverseRatio = Math.floor((newHeight / newWidth) * 100) / 100
          var tWidth, tHeight
          if (imageRatio >= 1) {
            tWidth = 100
            tHeight = 100 * inverseRatio
          } else {
            tWidth = 100 * imageRatio
            tHeight = 100
          }
          const initialMainHeight = container.current.clientHeight - 120 - tHeight - 40 - 20
          const initialDrawerHeight = initialMainHeight - 40 - 50
          const heightRatio = Math.floor((initialMainHeight / newHeight) * 100) / 100
          const initialScale = heightRatio < 1 ? heightRatio : 1
          setScale(initialScale)
          setZoomToFit(initialScale)
          setThumbWidth(tWidth)
          setThumbHeight(tHeight)
          setMainHeight(initialMainHeight)
          setDrawerHeight(initialDrawerHeight)
          resolve()
        })
      })
    }

    setLoading(true)
    await draw()
    await update()
    setGifData(newGifData)
    setLoading(false)
    setShowDrawer(false)
  }

  function onResizeCancel() {
    setShowDrawer(false)
  }

  async function onCropAccept() {
    const newGifData = {
      ...gifData,
      width: cropWidth,
      height: cropHeight
    }
    const newFrames = images.slice()

    async function draw() {
      return new Promise(resolve => {
        for (const [i, img] of images.entries()) {
          const reader = new FileReader()

          reader.onload = () => {
            const filepath = originalPaths[i]
            const buffer = Buffer.from(reader.result)
            writeFileAsync(filepath, buffer).then(() => {
              images[i].path = createHashPath(images[i].path)
              if (i === images.length - 1) {
                resolve()
              }
            })
          }

          const canvas = document.createElement('canvas')
          canvas.width = cropWidth
          canvas.height = cropHeight
          const ctx = canvas.getContext('2d')
          const image = new Image()
          image.onload = () => {
            ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
            canvas.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
          }
          image.src = images[i].path
        }
      })
    }

    async function update() {
      return new Promise(resolve => {
        const newProject = { ...newGifData, frames: newFrames }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          const imageRatio = Math.floor((cropWidth / cropHeight) * 100) / 100
          const inverseRatio = Math.floor((cropHeight / cropWidth) * 100) / 100
          var tWidth, tHeight
          if (imageRatio >= 1) {
            tWidth = 100
            tHeight = 100 * inverseRatio
          } else {
            tWidth = 100 * imageRatio
            tHeight = 100
          }
          const initialMainHeight = container.current.clientHeight - 120 - tHeight - 40 - 20
          const initialDrawerHeight = initialMainHeight - 40 - 50
          const heightRatio = Math.floor((initialMainHeight / cropHeight) * 100) / 100
          const initialScale = heightRatio < 1 ? heightRatio : 1
          setScale(initialScale)
          setZoomToFit(initialScale)
          setThumbWidth(tWidth)
          setThumbHeight(tHeight)
          setMainHeight(initialMainHeight)
          setDrawerHeight(initialDrawerHeight)
          resolve()
        })
      })
    }

    setLoading(true)
    await draw()
    await update()
    setGifData(newGifData)
    setLoading(false)
    setShowDrawer(false)
  }

  function onCropCancel() {
    setShowDrawer(false)
  }

  async function onOverrideAccept() {
    async function update() {
      return new Promise(resolve => {
        const newFrames = []
        for (const [i, bool] of selected.toArray().entries()) {
          var newFrame = {
            ...images[i],
            path: originalPaths[i]
          }
          if (bool) {
            newFrame.time = overrideMS
          }
          newFrames.push(newFrame)
        }
        const newProject = {
          ...gifData,
          frames: newFrames
        }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          resolve()
        })
      })
    }

    setLoading(true)
    await update()
    setLoading(false)
    setShowDrawer(false)
    initialize(imageIndex)
  }

  function onOverrideCancel() {
    setShowDrawer(false)
  }

  // create a new title frame image file and update project.json
  function onTitleAccept() {
    setLoading(true)
    const reader = new FileReader()
    const filepath = path.join(RECORDINGS_DIRECTORY, gifData.relative, createTFName())

    reader.onload = () => {
      const buffer = Buffer.from(reader.result)
      writeFileAsync(filepath, buffer).then(() => {})
    }
    //create full size canvas in memory
    const canvas = document.createElement('canvas')
    canvas.width = gifData.width
    canvas.height = gifData.height
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'middle'
    ctx.fillStyle = titleBackground
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = titleColor
    ctx.font = `${titleStyle} ${titleSize}px ${titleFont}`
    const { x, y } = getTextXY(canvas, titleVertical, titleHorizontal, titleSize, titleText, 1)
    ctx.fillText(titleText, x, y)
    canvas.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
    // update project.json and overwrite
    const newImages = images.slice()
    newImages.splice(imageIndex, 0, {
      path: filepath,
      time: titleDelay
    })
    const newProject = {
      ...gifData,
      frames: newImages
    }
    const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
    writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
      // after new project.json is saved
      // re-initialize editor to include new title frame and close drawer
      initialize(imageIndex)
      setShowDrawer(false)
      setLoading(false)
    })
  }

  // cancel title frame creation
  function onTitleCancel() {
    setShowDrawer(false)
    setTitleText('Title Frame')
  }

  // add free drawing to selected frames
  async function onDrawAccept() {
    // handle highlighter effect
    // capture imageData from highlight layer
    const ctx3 = canvas3.current.getContext('2d')
    const data = ctx3.getImageData(0, 0, gifData.width, gifData.height).data
    const length = data.length
    // if alpha has a value change it to 52 aka .2 opacity
    for (let i = 3; i < length; i += 4) {
      if (data[i] !== 0) {
        data[i] = 52
      }
    }
    // create a new image data object and put it on a canvas
    const imageData = new ImageData(data, gifData.width, gifData.height)
    const canvas1 = document.createElement('canvas')
    canvas1.width = gifData.width
    canvas1.height = gifData.height
    const cxt1 = canvas1.getContext('2d')
    cxt1.putImageData(imageData, 0, 0)
    // draw function returns promise to ensure all selected frames are drawn to
    async function draw() {
      return new Promise(resolve => {
        // last selected index
        const lastIndex = selected.findLastIndex(el => el)
        // loop over array entries to get index and value in for of loop
        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()
            // read file and hash path to force ui update
            reader.onload = () => {
              const filepath = originalPaths[i]
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                images[i].path = createHashPath(images[i].path)
                // wait for last selection to be saved to resolve
                if (i === lastIndex) {
                  resolve()
                }
              })
            }
            // create new canvas draw image and then draw on top of it
            const canvas2 = document.createElement('canvas')
            canvas2.width = gifData.width
            canvas2.height = gifData.height
            const ctx2 = canvas2.getContext('2d')
            const image = new Image()
            image.onload = () => {
              ctx2.drawImage(image, 0, 0)
              ctx2.drawImage(canvas1, 0, 0)
              ctx2.drawImage(canvas4.current, 0, 0)
              canvas2.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
            }
            image.src = images[i].path
          }
        }
      })
    }
    // wait for draw to resolve to close drawer and reset zoom
    setLoading(true)
    await draw()
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  // close drawer and restore scale when exit drawing mode
  function onDrawCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  // initialize drawing mode and set start point
  function onDrawMouseDown(e) {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    setDrawing(true)
    setDrawXY([x, y])
  }

  // stop drawing when mouse is released
  function onDrawMouseUp() {
    setDrawing(false)
  }

  // handle mouse movement over canvas in drawing mode
  function onDrawMouseMove(e) {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    // make the cursor match the size and color of pen
    if (drawType === 'pen') {
      drawBrush(canvas5.current, x, y, drawShape, drawPenColor, drawPenWidth, drawPenHeight)
    } else if (drawType === 'eraser') {
      drawEraser(canvas5.current, x, y, drawEraserWidth, drawEraserHeight)
    }
    // if in drawing mode draw to canvas
    if (drawing) {
      if (drawType === 'pen') {
        drawFree(
          canvas3.current,
          canvas4.current,
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
        drawErase(canvas3.current, canvas4.current, drawXY, x, y, drawEraserWidth, drawEraserHeight)
      }
    }

    setDrawXY([x, y])
  }

  // when mouse leaves canvas clear cursor layer
  function onDrawMouseLeave() {
    setDrawing(false)
    const ctx5 = canvas5.current.getContext('2d')
    ctx5.clearRect(0, 0, canvas5.current.width, canvas5.current.height)
  }

  // add configured border to selected frames
  async function onBorderAccept() {
    // draw function returns promise to make sure all borders are created
    async function draw() {
      return new Promise(resolve => {
        // last selected index
        const lastIndex = selected.findLastIndex(el => el)
        // loop over array entries to get index and value in for of loop
        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()
            // read file and hash path to force ui update
            reader.onload = () => {
              const filepath = originalPaths[i]
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                images[i].path = createHashPath(images[i].path)
                // wait for last selection to be saved to resolve
                if (i === lastIndex) {
                  resolve()
                }
              })
            }
            // create new canvas draw image and then border on top of it
            const c1 = document.createElement('canvas')
            c1.width = gifData.width
            c1.height = gifData.height
            const ctx1 = c1.getContext('2d')
            const image1 = new Image()
            image1.onload = () => {
              ctx1.drawImage(image1, 0, 0)
              drawBorder(c1, borderLeft, borderRight, borderTop, borderBottom, borderColor)
              c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
            }
            image1.src = images[i].path
          }
        }
      })
    }
    // wait for draw to resolve to close drawer and reset zoom
    setLoading(true)
    await draw()
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  // cancel adding border
  function onBorderCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  // add configured progress to all frames
  async function onProgressAccept() {
    // use function to help time actions
    async function draw() {
      // wait 1 second for ui updates - loading bar / message
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })

      return new Promise(resolve => {
        const times = []
        var t = 0
        // get elapsed time for each image
        for (let i = 0; i < images.length; i++) {
          times.push(t)
          t += images[i].time
        }
        // loop over each image and draw progress overlay
        for (let i = 0; i < images.length; i++) {
          const reader = new FileReader()
          // overwrite each image file with new image
          reader.onload = () => {
            const filepath = originalPaths[i]
            const buffer = Buffer.from(reader.result)
            writeFileAsync(filepath, buffer).then(() => {
              // hash image path to trick browser cache
              images[i].path = createHashPath(images[i].path)
              // resolve after last image is wrote to disk
              if (i === images.length - 1) {
                resolve()
              }
            })
          }
          // draw image then progress on top of it
          const canvas = document.createElement('canvas')
          canvas.width = gifData.width
          canvas.height = gifData.height
          const ctx = canvas.getContext('2d')
          const image = new Image()
          image.onload = () => {
            ctx.drawImage(image, 0, 0)
            if (progressType === 'bar') {
              drawProgressBar(
                canvas,
                Math.round((i / (images.length - 1)) * 100),
                progressBackground,
                progressHorizontal,
                progressVertical,
                progressOrientation,
                progressThickness
              )
            } else if (progressType === 'text') {
              drawProgressText(
                canvas,
                times[i],
                totalDuration,
                progressBackground,
                progressHorizontal,
                progressVertical,
                progressFont,
                progressSize,
                progressStyle,
                progressColor,
                progressPrecision
              )
            }
            canvas.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
          }
          image.src = images[i].path
        }
      })
    }
    setShowDrawer(false)
    setLoading(true)
    await draw()
    setLoading(false)
    setScale(zoomToFit)
  }

  // cancel adding progress bar
  function onProgressCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  // open file dialog for watermark image file
  function onWatermarkFileClick() {
    const win = remote.getCurrentWindow()
    const opts = {
      title: 'Select an Image',
      defaultPath: remote.app.getPath('pictures'),
      buttonLabel: 'Open',
      filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg'] }],
      properties: ['openFile']
    }
    const callback = filepath => {
      if (filepath) {
        setWatermarkPath(filepath[0])
      }
    }
    remote.dialog.showOpenDialog(win, opts, callback)
  }

  // add watermark to selected frames
  async function onWatermarkAccept() {
    async function draw() {
      return new Promise(async resolve1 => {
        // use last truthy index to resolve draw promise
        const lastIndex = selected.findLastIndex(el => el)
        // loop over selected List
        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()
            // overwrite file and hash state path to trick cache
            reader.onload = () => {
              const filepath = originalPaths[i]
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                images[i].path = createHashPath(images[i].path)
                if (i === lastIndex) {
                  resolve1()
                }
              })
            }
            // create a new canvas and image
            const c1 = document.createElement('canvas')
            c1.width = gifData.width
            c1.height = gifData.height
            const ctx1 = c1.getContext('2d')
            const image1 = new Image()
            // wait for original image to be drawn
            await new Promise(resolve2 => {
              image1.onload = () => {
                ctx1.drawImage(image1, 0, 0)
                resolve2()
              }
              image1.src = images[i].path
            })
            //create a second canvas to draw transparent watermark
            const c2 = document.createElement('canvas')
            c2.width = gifData.width
            c2.height = gifData.height
            const ctx2 = c2.getContext('2d')
            // set context global alpha to match opacity setting
            ctx2.globalAlpha = watermarkOpacity
            const image2 = new Image()
            // draw image2 on canvas2 then draw canvas2 on top of canvas1 then feed to file reader
            image2.onload = () => {
              ctx2.drawImage(image2, watermarkX, watermarkY, watermarkWidth, watermarkHeight)
              ctx1.drawImage(c2, 0, 0)
              c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
            }
            image2.src = watermarkPath
          }
        }
      })
    }
    setLoading(true)
    await draw()
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  function onWatermarkCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  // open options window
  function onOptionsClick() {
    if (!optionsOpen) {
      dispatch({ type: SET_OPTIONS_OPEN, payload: true })
      initializeOptions(remote.getCurrentWindow(), dispatch)
    }
  }

  // handle clicking a thumbail with modifier keys
  // immutable List and function useState setter makes this easier
  function onThumbnailClick(e, index) {
    // select multiple and consecutive
    if (e.ctrlKey && e.shiftKey) {
      setSelected(
        selected.map(
          (el, i) => (i >= Math.min(index, imageIndex) && i <= Math.max(index, imageIndex)) || el
        )
      )
      setImageIndex(index)
      // select consecutive between current image and clicked thumbnail
    } else if (e.shiftKey) {
      setSelected(
        selected.map(
          (el, i) => i >= Math.min(index, imageIndex) && i <= Math.max(index, imageIndex)
        )
      )
      setImageIndex(index)
      // select multiple
    } else if (e.ctrlKey) {
      // able to effectively select nothing with ctrl click on only selection
      if (index === imageIndex) {
        setSelected(selected.set(index, false))
        setImageIndex(null)
      } else {
        setSelected(selected.set(index, true))
        setImageIndex(index)
      }
    } else {
      // normal select with no modifiers
      setSelected(selected.map((el, i) => index === i))
      setImageIndex(index)
    }
  }

  return (
    <Container ref={container}>
      <Toolbar
        showToolbar={showToolbar}
        totalFrames={images.length}
        totalDuration={totalDuration}
        averageDuration={averageDuration}
        gifData={gifData}
        scale={scale}
        zoomToFit={zoomToFit}
        playing={playing}
        setShowToolbar={setShowToolbar}
        setScale={setScale}
        onOpenDrawer={onOpenDrawer}
        onNewRecordingClick={onNewRecordingClick}
        onNewWebcamClick={onNewWebcamClick}
        onSaveClick={onSaveClick}
        onDiscardProjectClick={onDiscardProjectClick}
        onPlaybackClick={onPlaybackClick}
        onFrameDeleteClick={onFrameDeleteClick}
        onOptionsClick={onOptionsClick}
        onSelectClick={onSelectClick}
      />
      <Main
        ref={main}
        height={mainHeight}
        shiftUp={showToolbar}
        shiftLeft={showDrawer}
        color={options.get('checkerColor')}
        size={options.get('checkerSize')}
      >
        <Wrapper ref={wrapper}>
          <Canvas1 ref={canvas1} />
          <Canvas2 ref={canvas2} />
          <Canvas3 ref={canvas3} />
          <Canvas4 ref={canvas4} />
          <Canvas5
            ref={canvas5}
            show={drawerMode === 'drawing'}
            opacity={drawType === 'pen' && drawHighlight ? 0.2 : 1}
            onMouseDown={onDrawMouseDown}
            onMouseUp={onDrawMouseUp}
            onMouseMove={onDrawMouseMove}
            onMouseLeave={onDrawMouseLeave}
          />
          <CropOverlay
            show={drawerMode === 'crop'}
            gifData={gifData}
            cropWidth={cropWidth}
            cropHeight={cropHeight}
            cropX={cropX}
            cropY={cropY}
            setCropWidth={setCropWidth}
            setCropHeight={setCropHeight}
            setCropX={setCropX}
            setCropY={setCropY}
          />
          <WatermarkOverlay
            show={drawerMode === 'watermark'}
            watermarkPath={watermarkPath}
            watermarkWidth={watermarkWidth}
            watermarkHeight={watermarkHeight}
            watermarkX={watermarkX}
            watermarkY={watermarkY}
            watermarkOpacity={watermarkOpacity}
            setWatermarkWidth={setWatermarkWidth}
            setWatermarkHeight={setWatermarkHeight}
            setWatermarkX={setWatermarkX}
            setWatermarkY={setWatermarkY}
          />
        </Wrapper>
      </Main>
      <Thumbnails
        thumbnail={thumbnail}
        thumbWidth={thumbWidth}
        thumbHeight={thumbHeight}
        selected={selected}
        images={images}
        imageIndex={imageIndex}
        onClick={onThumbnailClick}
      />
      <BottomBar
        loading={loading}
        playing={playing}
        total={images.length}
        selected={selected.count(el => el)}
        index={imageIndex + 1}
        scale={scale}
        setScale={setScale}
        onPlaybackClick={onPlaybackClick}
      />
      <Drawer show={showDrawer} shiftUp={showToolbar} thumbHeight={thumbHeight}>
        {drawerMode === 'recent' ? (
          <RecentProjects
            drawerHeight={drawerHeight}
            recentProjects={recentProjects}
            onAccept={onRecentAccept}
            onCancel={onRecentCancel}
          />
        ) : drawerMode === 'resize' ? (
          <Resize
            drawerHeight={drawerHeight}
            gifData={gifData}
            onAccept={onResizeAccept}
            onCancel={onResizeCancel}
          />
        ) : drawerMode === 'crop' ? (
          <Crop
            drawerHeight={drawerHeight}
            gifData={gifData}
            imagePath={images[imageIndex].path}
            cropWidth={cropWidth}
            cropHeight={cropHeight}
            cropX={cropX}
            cropY={cropY}
            setCropWidth={setCropWidth}
            setCropHeight={setCropHeight}
            setCropX={setCropX}
            setCropY={setCropY}
            onAccept={onCropAccept}
            onCancel={onCropCancel}
          />
        ) : drawerMode === 'override' ? (
          <Override
            drawerHeight={drawerHeight}
            overrideMS={overrideMS}
            setOverrideMS={setOverrideMS}
            onAccept={onOverrideAccept}
            onCancel={onOverrideCancel}
          />
        ) : drawerMode === 'title' ? (
          <TitleFrame
            drawerHeight={drawerHeight}
            fontOptions={fontOptions}
            titleText={titleText}
            titleDelay={titleDelay}
            titleSize={titleSize}
            titleFont={titleFont}
            titleStyle={titleStyle}
            titleColor={titleColor}
            titleVertical={titleVertical}
            titleHorizontal={titleHorizontal}
            titleBackground={titleBackground}
            setTitleText={setTitleText}
            setTitleDelay={setTitleDelay}
            setTitleSize={setTitleSize}
            setTitleFont={setTitleFont}
            setTitleStyle={setTitleStyle}
            setTitleColor={setTitleColor}
            setTitleVertical={setTitleVertical}
            setTitleHorizontal={setTitleHorizontal}
            setTitleBackground={setTitleBackground}
            onAccept={onTitleAccept}
            onCancel={onTitleCancel}
          />
        ) : drawerMode === 'drawing' ? (
          <FreeDrawing
            drawerHeight={drawerHeight}
            drawType={drawType}
            drawPenWidth={drawPenWidth}
            drawPenHeight={drawPenHeight}
            drawPenColor={drawPenColor}
            drawHighlight={drawHighlight}
            drawShape={drawShape}
            drawEraserWidth={drawEraserWidth}
            drawEraserHeight={drawEraserHeight}
            setDrawType={setDrawType}
            setDrawPenWidth={setDrawPenWidth}
            setDrawPenHeight={setDrawPenHeight}
            setDrawPenColor={setDrawPenColor}
            setDrawHighlight={setDrawHighlight}
            setDrawShape={setDrawShape}
            setDrawEraserWidth={setDrawEraserWidth}
            setDrawEraserHeight={setDrawEraserHeight}
            onAccept={onDrawAccept}
            onCancel={onDrawCancel}
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
        ) : drawerMode === 'progress' ? (
          <Progress
            drawerHeight={drawerHeight}
            fontOptions={fontOptions}
            progressType={progressType}
            progressBackground={progressBackground}
            progressThickness={progressThickness}
            progressVertical={progressVertical}
            progressHorizontal={progressHorizontal}
            progressOrientation={progressOrientation}
            progressColor={progressColor}
            progressSize={progressSize}
            progressFont={progressFont}
            progressStyle={progressStyle}
            progressPrecision={progressPrecision}
            setProgressType={setProgressType}
            setProgressBackground={setProgressBackground}
            setProgressThickness={setProgressThickness}
            setProgressVertical={setProgressVertical}
            setProgressHorizontal={setProgressHorizontal}
            setProgressOrientation={setProgressOrientation}
            setProgressColor={setProgressColor}
            setProgressSize={setProgressSize}
            setProgressFont={setProgressFont}
            setProgressStyle={setProgressStyle}
            setProgressPrecision={setProgressPrecision}
            onAccept={onProgressAccept}
            onCancel={onProgressCancel}
          />
        ) : drawerMode === 'watermark' ? (
          <Watermark
            drawerHeight={drawerHeight}
            gifData={gifData}
            watermarkPath={watermarkPath}
            watermarkX={watermarkX}
            watermarkY={watermarkY}
            watermarkRealWidth={watermarkRealWidth}
            watermarkRealHeight={watermarkRealHeight}
            watermarkOpacity={watermarkOpacity}
            watermarkScale={watermarkScale}
            setWatermarkX={setWatermarkX}
            setWatermarkY={setWatermarkY}
            setWatermarkOpacity={setWatermarkOpacity}
            setWatermarkScale={setWatermarkScale}
            setWatermarkWidth={setWatermarkWidth}
            setWatermarkHeight={setWatermarkHeight}
            onWatermarkFileClick={onWatermarkFileClick}
            onAccept={onWatermarkAccept}
            onCancel={onWatermarkCancel}
          />
        ) : null}
      </Drawer>
    </Container>
  )
}
