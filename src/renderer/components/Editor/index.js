import React, { useRef, useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import { format } from 'date-fns'
import { List } from 'immutable'
import path from 'path'
import { readFile, writeFile, readdir, mkdir, rmdir, unlink, copyFile, existsSync } from 'fs'
import { promisify } from 'util'
import createTFName from '../../lib/createTFName'
import createFileName from '../../lib/createFileName'
import initializeOptions from '../Options/initializeOptions'
import initializeRecorder from '../Recorder/initializeRecorder'
import initializeWebcam from '../Webcam/initializeWebcam'
import initializeBoard from '../Board/initializeBoard'
import initializeEncoder from '../Encoder/initializeEncoder'
import drawBorder from './Border/drawBorder'
import drawProgressBar from './Progress/drawProgressBar'
import drawProgressText from './Progress/drawProgressText'
import drawFree from '../../lib/drawFree'
import drawErase from '../../lib/drawErase'
import drawBrush from '../../lib/drawBrush'
import drawEraser from '../../lib/drawEraser'
import drawText from './Keyboard/drawText'
import getTextXY from './getTextXY'
import { AppContext } from '../App'
import CropOverlay from './Crop/CropOverlay'
import WatermarkOverlay from './Watermark/WatermarkOverlay'
import ShapeOverlay from './Shape/ShapeOverlay'
import ObfuscateOverlay from './Obfuscate/ObfuscateOverlay'
import TextOverlay from './Text/TextOverlay'
import Drawer from './Drawer'
import Clipboard from './Clipboard'
import Resize from './Resize'
import Crop from './Crop'
import Flip from './Flip'
import TitleFrame from './TitleFrame'
import Keyboard from './Keyboard'
import Text from './Text'
import FreeDrawing from './FreeDrawing'
import Shape from './Shape'
import Border from './Border'
import MouseClicks from './MouseClicks'
import Watermark from './Watermark'
import Progress from './Progress'
import Obfuscate from './Obfuscate'
import RecentProjects from './RecentProjects'
import SaveAs from './SaveAs'
import ReduceFrames from './ReduceFrames'
import Duplicate from './Duplicate'
import Override from './Override'
import IncreaseDecrease from './IncreaseDecrease'
import Fade from './Fade'
import Slide from './Slide'
import Toolbar from './Toolbar'
import Thumbnails from './Thumbnails'
import BottomBar from './BottomBar'
import { Container, Main, Wrapper, Canvas1, Canvas2, Canvas3, Canvas4, Canvas5 } from './styles'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  appActions: { SET_APP_MODE, SET_PROJECT_FOLDER, SET_OPTIONS_OPEN },
  ipcActions: { ENCODER_DATA },
  constants: { IMAGE_TYPE }
} = config

// make node fs methods asynchronous
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const readdirAsync = promisify(readdir)
const mkdirAsync = promisify(mkdir)
const rmdirAsync = promisify(rmdir)
const unlinkAsync = promisify(unlink)
const copyFileAsync = promisify(copyFile)

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)
  const { options, optionsOpen, encoderOpen, fontOptions, projectFolder } = state

  const ffmpegPath = options.get('ffmpegPath')

  const [loading, setLoading] = useState(false)
  const [messageTemp, setMessageTemp] = useState('')
  const [messagePerm, setMessagePerm] = useState('')

  const [images, setImages] = useState([])
  const [scale, setScale] = useState(null)
  const [zoomToFit, setZoomToFit] = useState(null)
  const [imageIndex, setImageIndex] = useState(null)
  const [selected, setSelected] = useState(List())
  const [hashModifier, setHashModifier] = useState('#' + Math.round(performance.now()))

  const [gifData, setGifData] = useState(null)
  const [totalDuration, setTotalDuration] = useState(null)
  const [averageDuration, setAverageDuration] = useState(null)

  const [recentProjects, setRecentProjects] = useState(null)
  const [playing, setPlaying] = useState(false)

  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [mainHeight, setMainHeight] = useState(0)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState('')
  const [drawerHeight, setDrawerHeight] = useState(0)
  const [thumbWidth, setThumbWidth] = useState(100)
  const [thumbHeight, setThumbHeight] = useState(56)

  const [encoderWin, setEncoderWin] = useState(null)
  const [saveMode, setSaveMode] = useState('gif')
  const [gifFolderPath, setGifFolderPath] = useState('')
  const [gifFilename, setGifFilename] = useState('')
  const [gifOverwrite, setGifOverwrite] = useState(false)
  const [gifOverwriteError, setGifOverwriteError] = useState(false)
  const [gifEncoder, setGifEncoder] = useState('1.0')
  const [gifLooped, setGifLooped] = useState(true)
  const [gifForever, setGifForever] = useState(true)
  const [gifLoops, setGifLoops] = useState(2)
  const [gifOptimize, setGifOptimize] = useState(false)
  const [gifQuality, setGifQuality] = useState(10)
  const [gifColors, setGifColors] = useState(256)

  const [clipboardDirectory, setClipboardDirectory] = useState('')
  const [clipboardNextSub, setClipboardNextSub] = useState(0)
  const [clipboardItems, setClipboardItems] = useState(List([]))
  const [clipboardIndex, setClipboardIndex] = useState(null)
  const [clipboardPaste, setClipboardPaste] = useState('before')

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

  const [clicksColor, setClicksColor] = useState('#FFFF00')
  const [clicksWidth, setClicksWidth] = useState(20)
  const [clicksHeight, setClicksHeight] = useState(20)

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

  const [keyboardExtend, setKeyboardExtend] = useState(true)
  const [keyboardExtendTime, setKeyboardExtendTime] = useState(500)
  const [keyboardColor, setKeyboardColor] = useState('#FFFFFF')
  const [keyboardSize, setKeyboardSize] = useState(40)
  const [keyboardFont, setKeyboardFont] = useState('Segoe UI')
  const [keyboardStyle, setKeyboardStyle] = useState('Normal')
  const [keyboardBackground, setKeyboardBackground] = useState('#000000')
  const [keyboardHorizontal, setKeyboardHorizontal] = useState('Center')
  const [keyboardVertical, setKeyboardVertical] = useState('Bottom')

  const [textText, setTextText] = useState('Free Text')
  const [textColor, setTextColor] = useState('#000000')
  const [textSize, setTextSize] = useState(20)
  const [textFont, setTextFont] = useState('Segoe UI')
  const [textStyle, setTextStyle] = useState('Normal')
  const [textWidth, setTextWidth] = useState(0)
  const [textHeight, setTextHeight] = useState(0)
  const [textX, setTextX] = useState(0)
  const [textY, setTextY] = useState(0)

  const [cropWidth, setCropWidth] = useState(0)
  const [cropHeight, setCropHeight] = useState(0)
  const [cropX, setCropX] = useState(0)
  const [cropY, setCropY] = useState(0)

  const [flipMode, setFlipMode] = useState('')

  const [reduceFactor, setReduceFactor] = useState(1)
  const [reduceCount, setReduceCount] = useState(1)

  const [duplicatePercent, setDuplicatePercent] = useState(90)
  const [duplicateRemove, setDuplicateRemove] = useState('Remove First Frame')

  const [overrideMS, setOverrideMS] = useState(100)
  const [incDecValue, setIncDecValue] = useState(0)

  const [obfuscatePixels, setObfuscatePixels] = useState(10)
  const [obfuscateAverage, setObfuscateAverage] = useState(true)
  const [obfuscateWidth, setObfuscateWidth] = useState(null)
  const [obfuscateHeight, setObfuscateHeight] = useState(null)
  const [obfuscateX, setObfuscateX] = useState(null)
  const [obfuscateY, setObfuscateY] = useState(null)

  const [shapeArray, setShapeArray] = useState([])
  const [shapeMode, setShapeMode] = useState('insert')
  const [shapeType, setShapeType] = useState('rectangle')
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(10)
  const [shapeStrokeColor, setShapeStrokeColor] = useState('#000000')
  const [shapeFillColor, setShapeFillColor] = useState('#FFFFFF00')

  const [fadeOption, setFadeOption] = useState('frame')
  const [fadeLength, setFadeLength] = useState(1)
  const [fadeDelay, setFadeDelay] = useState(100)
  const [fadeColor, setFadeColor] = useState('#000000')

  const [slideLength, setSlideLength] = useState(1)
  const [slideDelay, setSlideDelay] = useState(100)

  const container = useRef(null)
  const main = useRef(null)
  const wrapper = useRef(null)
  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const canvas3 = useRef(null)
  const canvas4 = useRef(null)
  const canvas5 = useRef(null)
  const thumbnail = useRef(null)

  // ensure window is maximized
  useEffect(() => {
    remote.getCurrentWindow().maximize()
    remote.getCurrentWindow().setTitle('GifIt - Editor')
  }, [])

  // call initialize projectFolder changes
  useEffect(() => {
    initialize()
    initClipboard()
  }, [projectFolder])

  useEffect(() => {
    if (images.length && scale && gifData) {
      wrapper.current.style.width = gifData.width * scale + 'px'
      wrapper.current.style.height = gifData.height * scale + 'px'
      canvas2.current.width = gifData.width * scale
      canvas2.current.height = gifData.height * scale
      canvas3.current.width = gifData.width * scale
      canvas3.current.height = gifData.height * scale
      canvas4.current.width = gifData.width * scale
      canvas4.current.height = gifData.height * scale
      canvas5.current.width = gifData.width * scale
      canvas5.current.height = gifData.height * scale
    }
  }, [images, gifData, scale])

  // manage main canvas
  useEffect(() => {
    // only run if project is open in editor
    if (images.length && scale && gifData) {
      // set w:h to project size and adjust for scale
      canvas1.current.width = gifData.width * scale
      canvas1.current.height = gifData.height * scale
      const ctx1 = canvas1.current.getContext('2d')
      // title frame replaces image when in title drawer is open
      if (drawerMode === 'title') {
        ctx1.textBaseline = 'middle'
        // draw background
        ctx1.fillStyle = titleBackground
        ctx1.fillRect(0, 0, canvas1.current.width, canvas1.current.height)
        // split input on new line characters
        const textArray = titleText.split('\n')
        // find the longest line and its index
        var longest = 0
        var longestIndex
        for (const [i, text] of textArray.entries()) {
          const len = text.length
          if (len > longest) {
            longestIndex = i
            longest = len
          }
        }
        // draw text
        ctx1.fillStyle = titleColor
        ctx1.font = `${titleStyle} ${titleSize * scale}px ${titleFont}`
        // get starting x,y coordinate
        const { x, y } = getTextXY(
          canvas1.current,
          titleVertical,
          titleHorizontal,
          titleSize,
          textArray[longestIndex],
          textArray.length,
          scale
        )
        // draw each line
        // add size * scale to y for each new line
        for (const [i, text] of textArray.entries()) {
          ctx1.fillText(text, x, y + i * titleSize * scale)
        }
        // draw image at imageIndex - the normal behavior
      } else {
        if (imageIndex !== null) {
          ctx1.scale(scale, scale)
          const image = new Image()
          image.onload = () => {
            ctx1.drawImage(image, 0, 0)
          }
          // add hashModifier to trick cache on image changes
          // needed because filename remains the same but imagedata is overwritten
          image.src = images[imageIndex].path + hashModifier
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
    titleBackground,
    hashModifier
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
    } else if (drawerMode === 'keyboard') {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
      drawText(
        canvas2.current,
        'Ctrl + C',
        keyboardSize,
        keyboardColor,
        keyboardFont,
        keyboardStyle,
        keyboardBackground,
        keyboardHorizontal,
        keyboardVertical
      )
    } else {
      // clear canvas 2 if no overlay drawers are open
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    }
  }, [
    showDrawer,
    drawerMode,
    imageIndex,
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
    progressPrecision,
    keyboardFont,
    keyboardSize,
    keyboardColor,
    keyboardStyle,
    keyboardBackground,
    keyboardHorizontal,
    keyboardVertical
  ])

  // resize main window and drawer when toolbar is opened/closed
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
      setMessagePerm('')
    }
  }, [showDrawer])

  // when imageIndex change is automated scroll to it
  useEffect(() => {
    if (thumbnail.current) {
      thumbnail.current.scrollIntoView()
    }
  }, [imageIndex])

  // play GIF frame by frame when playing is set to true
  useEffect(() => {
    var pid
    if (playing) {
      pid = setTimeout(() => {
        // account for looping
        setImageIndex(x => (x === images.length - 1 ? 0 : x + 1))
      }, images[imageIndex].time)

      // clear interval when playing is set to false
    } else {
      if (pid) {
        clearTimeout(pid)
        setSelected(selected.map((el, i) => i === imageIndex))
      }
    }
    return () => clearTimeout(pid)
  }, [playing, imageIndex])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [loading, imageIndex, selected, showDrawer])

  // load watermark image file to set its initial size
  useEffect(() => {
    if (watermarkPath) {
      const image = new Image()
      image.onload = () => {
        var w, h
        const ratio = Math.floor((image.width / image.height) * 100) / 100
        const inverse = Math.floor((image.height / image.width) * 100) / 100
        // constrain watermark to be smaller than original frame
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

  // warn user if chosen path already contains a file
  useEffect(() => {
    if (gifFolderPath && gifFilename && !gifOverwrite) {
      const filepath = path.join(gifFolderPath, gifFilename + '.gif')
      const exists = existsSync(filepath)
      setGifOverwriteError(exists)
    } else {
      setGifOverwriteError(false)
    }
  }, [gifFolderPath, gifFilename, gifOverwrite])

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
      // find dir that matches projectFolder app state aka the open project in editor
      if (dir === projectFolder) {
        // calcuate ratios for image w:h and h:w
        const imageRatio = Math.floor((project.width / project.height) * 100) / 100
        const inverseRatio = Math.floor((project.height / project.width) * 100) / 100
        // set larger dimension to 100px and calculate other dimension based on ratio
        var tWidth, tHeight
        if (imageRatio >= 1) {
          tWidth = 100
          tHeight = 100 * inverseRatio
        } else {
          tWidth = 100 * imageRatio
          tHeight = 100
        }
        // height of windows web content
        const initialContainerHeight = container.current.clientHeight
        // calculate main editor height
        // full screen height - toolbar height - thumbnail image height - thumb bottom height - bottom bar height
        const initialMainHeight = initialContainerHeight - 120 - tHeight - 40 - 20
        // calculate drawer height
        // main height - drawer header height - drawer buttons height
        const initialDrawerHeight = initialMainHeight - 40 - 50
        // ratio of main height to project image height
        const heightRatio = Math.floor((initialMainHeight / project.height) * 100) / 100
        // if ratio less than 1 image is taller than editor and height ratio is intial scale between 0 - 1
        // if ratio greater than 1 image is shorter than editor and set scale to 1 aka actual size
        const initialScale = heightRatio < 1 ? heightRatio : 1
        // use immutable list to manage selected frames true=selected false=unselected
        // initialIndex default is 0 but other value can be used as function parameter
        const initialSelected = List(Array(project.frames.length).fill(false)).set(
          initialIndex,
          true
        )
        // add time of all frames to determine total duration of GIF
        const totalDur = project.frames.reduce((acc, val) => {
          acc += val.time ? val.time : 0
          return acc
        }, 0)
        // divide total by number of frames to get average duration
        const averageDur = Math.round((totalDur / project.frames.length) * 10) / 10

        setSelected(initialSelected)
        setScale(initialScale)
        imageIndex === null && setMessageTemp(`Zoom set to ${Math.round(initialScale * 100)}%`)
        setZoomToFit(initialScale)
        setImages(project.frames)
        setImageIndex(initialIndex)
        setGifData({
          relative: project.relative,
          date: project.date,
          width: project.width,
          height: project.height
        })
        setTotalDuration(totalDur)
        setAverageDuration(averageDur)
        setContainerWidth(container.current.clientWidth)
        setContainerHeight(initialContainerHeight)
        setMainHeight(initialMainHeight)
        setDrawerHeight(initialDrawerHeight)
        setThumbWidth(tWidth)
        setThumbHeight(tHeight)
        // store all other projects as recent projects
      } else {
        projects.push(project)
      }
    }

    if (!projectFolder) {
      const initialContainerHeight = container.current.clientHeight
      const initialMainHeight = initialContainerHeight - 120 - thumbHeight - 40 - 20
      const initialDrawerHeight = initialMainHeight - 40 - 50
      setContainerWidth(container.current.clientWidth)
      setContainerHeight(initialContainerHeight)
      setMainHeight(initialMainHeight)
      setDrawerHeight(initialDrawerHeight)
    }

    setRecentProjects(projects)
    setLoading(false)
  }

  // initialize clipboard
  async function initClipboard() {
    // each project has its own clipboard
    if (projectFolder) {
      const initialClipboardDirectory = path.join(RECORDINGS_DIRECTORY, projectFolder, 'Clipboard')
      // get all directories within clipboard
      const clipDirs = await readdirAsync(initialClipboardDirectory)
      // if directories delete contents and then directory itself
      if (clipDirs.length) {
        for (const clipDir of clipDirs) {
          const clipFolder = path.join(initialClipboardDirectory, clipDir)
          const clipImgs = await readdirAsync(clipFolder)
          if (clipImgs.length) {
            for (const [i, clipImg] of clipImgs.entries()) {
              const imagePath = path.join(clipFolder, clipImg)
              unlinkAsync(imagePath).then(() => {
                if (i === clipImgs.length - 1) {
                  rmdirAsync(clipFolder)
                }
              })
            }
          }
        }
      }
      setClipboardDirectory(initialClipboardDirectory)
      setClipboardItems(List([]))
      setClipboardIndex(null)
      setClipboardNextSub(0)
    }
  }

  // assign keyboard shortcuts
  // could also use remote.globalshortcut to override system
  function onKeyDown({ keyCode, ctrlKey }) {
    if (keyCode === 65 && ctrlKey) {
      onSelectClick(0)
    } else if (keyCode === 46 && ctrlKey && !showDrawer) {
      onFrameDeleteClick('selection')
    } else if (keyCode === 88 && ctrlKey) {
      onCutClick()
    } else if (keyCode === 67 && ctrlKey) {
      onCopyClick()
    } else if (keyCode === 86 && ctrlKey) {
      onPasteClick()
    }
  }

  // trick cache
  function updateHashModifier() {
    setHashModifier('#' + Math.round(performance.now()))
  }

  // open recorder
  function onNewRecordingClick() {
    initializeRecorder(state, dispatch)
    dispatch({ type: SET_APP_MODE, payload: 0 })
  }

  // open webcam
  function onNewWebcamClick() {
    initializeWebcam(state, dispatch)
    dispatch({ type: SET_APP_MODE, payload: 0 })
  }

  // open board
  function onNewBoardClick() {
    initializeBoard(state, dispatch)
    dispatch({ type: SET_APP_MODE, payload: 0 })
  }

  // remove a project and delete all associated files
  function onDiscardProjectClick() {
    if (!gifData || loading) {
      return
    }
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
        // remove clipboard directory
        await initClipboard()
        await rmdirAsync(clipboardDirectory)
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
          setScale(null)
          setZoomToFit(null)
          initialize(null)
        })
      }
    }
    remote.dialog.showMessageBox(win, opts, callback)
  }

  // playback interface
  // index refers to button order 0=first 1=previous 2=play/pause 3=next 4=last
  function onPlaybackClick(index) {
    if (!gifData || loading) {
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

  // cut selected frames from project to clipboard
  async function onCutClick() {
    if (!selected.includes(true) || loading) {
      return
    }

    const items = []

    async function update() {
      return new Promise(async resolve => {
        const keepImages = images.filter((el, i) => !selected.get(i))
        const cutImages = images.filter((el, i) => selected.get(i))

        const dstFolder = path.join(clipboardDirectory, clipboardNextSub.toString())
        await mkdirAsync(dstFolder)

        for (const [i, img] of cutImages.entries()) {
          const srcPath = img.path
          const dstPath = path.join(dstFolder, path.basename(img.path))
          await copyFileAsync(srcPath, dstPath)
          items.push({
            ...img,
            path: dstPath
          })
        }

        const clipItem = { time: format(new Date(), 'hh:mm:ss'), items }
        setClipboardItems(clipboardItems.push(clipItem))
        setClipboardIndex(clipboardItems.size)
        setClipboardNextSub(clipboardNextSub + 1)

        const newProject = { ...gifData, frames: keepImages }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        await writeFileAsync(projectPath, JSON.stringify(newProject))
        resolve()
      })
    }

    setLoading(true)
    await update()
    setLoading(false)
    initialize(imageIndex)
    setMessageTemp(`${items.length} frame(s) cut`)
    onOpenDrawer('clipboard')
  }

  // copy selected frames to clipboard
  async function onCopyClick() {
    // if nothing selected return
    if (!selected.includes(true) || loading) {
      return
    }
    // create new clipboard sub directory
    // destination folder based on current project folder and next sub-directory
    const dstFolder = path.join(clipboardDirectory, clipboardNextSub.toString())
    await mkdirAsync(dstFolder)
    const items = []

    const copyImages = images.filter((el, i) => selected.get(i))

    for (const [i, img] of copyImages.entries()) {
      const srcPath = img.path
      const dstPath = path.join(dstFolder, path.basename(img.path))
      await copyFileAsync(srcPath, dstPath)
      items.push({
        ...img,
        path: dstPath
      })
    }
    // create new clip item
    const clipItem = { time: format(new Date(), 'hh:mm:ss'), items }
    // update state
    setClipboardItems(clipboardItems.push(clipItem))
    setClipboardIndex(clipboardItems.size)
    setClipboardNextSub(clipboardNextSub + 1)
    setMessageTemp(`${items.length} frame(s) copied`)
    onOpenDrawer('clipboard')
  }

  // paste selected clipboard item into project before/after imageIndex
  async function onPasteClick() {
    // if clipboard is empty return
    if (!clipboardItems.size || loading) {
      return
    }
    // isolate frame items
    const clipItems = clipboardItems.get(clipboardIndex).items

    async function update() {
      return new Promise(async resolve => {
        const insertionData = []
        // loop over clipboard items to copy images
        for (const [i, img] of clipItems.entries()) {
          const srcPath = img.path
          // create new png file in project
          const dstPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, createFileName('CB', i))
          await copyFileAsync(srcPath, dstPath)
          // keep track of new data with updated path
          insertionData.push({ ...img, path: dstPath })
        }
        // index to insert clipboard items at
        const insertionPoint = clipboardPaste === 'before' ? imageIndex : imageIndex + 1
        const newImages = images.slice()
        // splice in new data
        newImages.splice(insertionPoint, 0, ...insertionData)
        const newProject = { ...gifData, frames: newImages }
        // update project json file
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        await writeFileAsync(projectPath, JSON.stringify(newProject))
        resolve()
      })
    }

    setLoading(true)
    await update()
    setLoading(false)
    setShowDrawer(false)
    initialize(imageIndex)
    setMessageTemp(`${clipItems.length} frame(s) pasted`)
  }

  // delete selected frames from project
  function onFrameDeleteClick(type) {
    if (!gifData || loading) {
      return
    }
    // number of frames to delete
    var count
    if (type === 'selection') {
      count = selected.count(el => el)
    } else if (type === 'previous') {
      count = imageIndex
    } else {
      count = images.length - imageIndex - 1
    }
    // if not deleting any frames exit function
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
        const newProject = {
          ...gifData,
          frames: keepImages
        }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          const totalDur = keepImages.reduce((acc, val) => (acc += val.time), 0)
          const averageDur = Math.round((totalDur / keepImages.length) * 10) / 10
          setImages(keepImages)
          setTotalDuration(totalDur)
          setAverageDuration(averageDur)
        })
        // delete images
        for (const img of deleteImages) {
          unlinkAsync(img.path)
        }
        setMessageTemp(`${deleteImages.length} frame(s) deleted`)
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
    if (loading) {
      return
    }
    if (mode === 'recent') {
    } else {
      if (!gifData) {
        return
      }
      // apply scale and other side effects
      if (
        ['border', 'shape', 'watermark', 'drawing', 'obfuscate', 'text', 'keyboard'].includes(mode)
      ) {
        setScale(1)
      } else if (['title', 'fade', 'slide'].includes(mode)) {
        setScale(zoomToFit)
      } else if (mode === 'crop') {
        setScale(1)
        setCropWidth(gifData.width)
        setCropHeight(gifData.height)
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
      }
      // set message for current drawer
      if (
        ['border', 'shape', 'watermark', 'drawing', 'obfuscate', 'increase', 'override'].includes(
          mode
        )
      ) {
        setMessagePerm('This action applies to selected frames')
      } else if (['crop', 'resize', 'progress', 'reduce'].includes(mode)) {
        setMessagePerm('This action applies to all frames')
      } else if (mode === 'title') {
        setMessagePerm('The title frame will be inserted before the selected frame')
      } else if (mode === 'flip') {
        setMessagePerm(
          'The flip action applies to selected frames and rotate applies to all frames'
        )
      } else if (['fade', 'slide'].includes(mode)) {
        setMessagePerm('The transition will be applied between the selected frame and the next one')
      }
    }
    setDrawerMode(mode)
    setShowDrawer(true)
  }

  // open a recent project
  function onRecentAccept(folder) {
    dispatch({ type: SET_PROJECT_FOLDER, payload: folder })
    setShowDrawer(false)
  }

  // close recent project drawer
  function onRecentCancel() {
    setShowDrawer(false)
  }

  // call one of many save functions based on user input
  function onSaveAccept() {
    if (saveMode === 'gif') {
      onSaveGif()
    }
  }

  // save current project as a GIF file
  async function onSaveGif() {
    if (!gifFolderPath || !gifFilename || !existsSync(gifFolderPath) || gifOverwriteError) {
      return
    }

    const filepath = path.join(gifFolderPath, gifFilename + '.gif')
    if (!gifOverwrite && existsSync(filepath)) {
      return
    }

    const payload = {
      gifData,
      images,
      filepath,
      gifEncoder,
      gifOptimize,
      gifQuality,
      gifColors,
      gifLooped,
      gifForever,
      gifLoops,
      ffmpegPath
    }

    if (encoderOpen) {
      encoderWin.webContents.send(ENCODER_DATA, payload)
    } else {
      const win = initializeEncoder(remote.getCurrentWindow(), dispatch, payload)
      setEncoderWin(win)
    }
  }

  // close save drawer
  function onSaveCancel() {
    setShowDrawer(false)
  }

  // resize all frames
  async function onResizeAccept(newWidth, newHeight) {
    const newGifData = {
      ...gifData,
      width: newWidth,
      height: newHeight
    }
    const newFrames = images.slice()
    // draw and save new image at new size
    async function draw() {
      return new Promise(resolve => {
        for (const [i, img] of images.entries()) {
          const reader = new FileReader()

          reader.onload = () => {
            const filepath = img.path
            const buffer = Buffer.from(reader.result)
            writeFileAsync(filepath, buffer).then(() => {
              if (i === images.length - 1) {
                resolve()
              }
            })
          }

          const widthScale = newWidth / gifData.width
          const heightScale = newHeight / gifData.height
          const c1 = document.createElement('canvas')
          c1.width = newWidth
          c1.height = newHeight
          const ctx1 = c1.getContext('2d')
          ctx1.scale(widthScale, heightScale)
          const image1 = new Image()
          image1.onload = () => {
            ctx1.drawImage(image1, 0, 0)
            c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
          }
          image1.src = images[i].path
        }
      })
    }

    // update project.json and reset editor dimensions to resized project
    async function update() {
      return new Promise(resolve => {
        const newProject = {
          ...newGifData,
          frames: newFrames
        }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          resolve()
        })
      })
    }

    setLoading(true)
    await draw()
    await update()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
    setMessageTemp('Frames resized')
    initialize(imageIndex)
    initClipboard()
  }

  // close the resize drawer
  function onResizeCancel() {
    setShowDrawer(false)
  }

  // crop all frames to new size
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
            const filepath = img.path
            const buffer = Buffer.from(reader.result)
            writeFileAsync(filepath, buffer).then(() => {
              if (i === images.length - 1) {
                resolve()
              }
            })
          }

          // use cool version of drawImage to draw portion of original to new canvas
          const c1 = document.createElement('canvas')
          c1.width = cropWidth
          c1.height = cropHeight
          const ctx1 = c1.getContext('2d')
          const image1 = new Image()
          image1.onload = () => {
            ctx1.drawImage(image1, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
            c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
          }
          image1.src = images[i].path
        }
      })
    }

    // update project.json and editor dimensions
    async function update() {
      return new Promise(resolve => {
        const newProject = {
          ...newGifData,
          frames: newFrames
        }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          resolve()
        })
      })
    }

    setLoading(true)
    await draw()
    await update()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
    setMessageTemp('Frames cropped')
    initialize(imageIndex)
    initClipboard()
  }

  // close crop drawer
  function onCropCancel() {
    setShowDrawer(false)
  }

  // flip selected frames or rotate all frames
  async function onFlipAccept() {
    if (!flipMode || loading) {
      return
    }
    // apply image transformations and overwrite files
    async function draw() {
      return new Promise(async resolve => {
        const lastIndex = selected.findLastIndex(el => el)
        //  horizontal and vertical flips are applied to only selected frames
        if (['horizontal', 'vertical'].includes(flipMode)) {
          for (const [i, bool] of selected.toArray().entries()) {
            if (bool) {
              const reader = new FileReader()

              reader.onload = () => {
                const filepath = images[i].path
                const buffer = Buffer.from(reader.result)
                writeFileAsync(filepath, buffer).then(() => {
                  if (i === lastIndex) {
                    resolve()
                  }
                })
              }

              const c1 = document.createElement('canvas')
              c1.width = gifData.width
              c1.height = gifData.height
              const ctx1 = c1.getContext('2d')
              // apply negative scale to flip context around axis
              if (flipMode === 'horizontal') {
                ctx1.scale(-1, 1)
              } else if (flipMode === 'vertical') {
                ctx1.scale(1, -1)
              }

              const image1 = new Image()
              image1.onload = () => {
                // account for flipped context by negating dimension with negative scale
                if (flipMode === 'horizontal') {
                  ctx1.drawImage(image1, gifData.width * -1, 0)
                } else if (flipMode === 'vertical') {
                  ctx1.drawImage(image1, 0, gifData.height * -1)
                }
                c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
              }
              image1.src = images[i].path
            }
          }
          // left and right rotations are applied to all frames
        } else if (['left', 'right'].includes(flipMode)) {
          for (const [i, img] of images.entries()) {
            const reader = new FileReader()

            reader.onload = () => {
              const filepath = img.path
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                if (i === images.length - 1) {
                  resolve()
                }
              })
            }

            const c1 = document.createElement('canvas')
            c1.width = gifData.height
            c1.height = gifData.width
            const ctx1 = c1.getContext('2d')
            // translate and rotate to applied desired rotations
            // 270 degrees is equivilant to -90 degrees
            if (flipMode === 'right') {
              ctx1.translate(c1.width, 0)
              ctx1.rotate(90 * (Math.PI / 180))
            } else if (flipMode === 'left') {
              ctx1.translate(0, c1.height)
              ctx1.rotate(270 * (Math.PI / 180))
            }
            // wrap image load in Promise to make sure file is overwritten correctly
            const image1 = new Image()
            await new Promise(resolve2 => {
              image1.onload = () => {
                ctx1.drawImage(image1, 0, 0)
                c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
                resolve2()
              }
              image1.src = img.path
            })
          }
        }
      })
    }
    // rotations require an update to project dimensions and a re initialization
    async function update() {
      return new Promise(resolve => {
        if (['horizontal', 'vertical'].includes(flipMode)) {
          resolve()
        } else if (['left', 'right'].includes(flipMode)) {
          // width and height are switched
          const newProject = {
            ...gifData,
            width: gifData.height,
            height: gifData.width,
            frames: images.slice()
          }
          const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
          writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
            resolve()
          })
        }
      })
    }

    setLoading(true)
    await draw()
    await update()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    if (['left', 'right'].includes(flipMode)) {
      initialize(imageIndex)
    }
    setFlipMode('')
    setShowDrawer(false)
    setMessageTemp(`Frames flipped/rotated`)
  }

  // close flip drawer
  function onFlipCancel() {
    setShowDrawer(false)
  }

  // reduce number of frames based on user input
  async function onReduceAccept() {
    async function update() {
      return new Promise(async resolve => {
        // gather indices of images to delete
        const deleteIndices = []
        // delete reduceCount images for every reduceFactor (not counting deleted frames)
        for (let i = 0; i < images.length; i += reduceFactor) {
          if (i) {
            var j = 0
            while (j < reduceCount) {
              deleteIndices.push(i + j)
              j += 1
            }
            i += reduceCount
          }
        }
        // filter images to separate keepers and deletes
        const keepImages = images.filter((el, i) => deleteIndices.indexOf(i) === -1)
        const deleteImages = images.filter((el, i) => deleteIndices.indexOf(i) !== -1)
        // rewrite project data
        const newProject = {
          ...gifData,
          frames: keepImages
        }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        await writeFileAsync(projectPath, JSON.stringify(newProject))
        // delete images
        for (const [i, img] of deleteImages.entries()) {
          unlinkAsync(img.path).then(() => {
            if (i === deleteImages.length - 1) {
              resolve()
            }
          })
        }
      })
    }

    setLoading(true)
    await update()
    setLoading(false)
    setShowDrawer(false)
    initialize(0)
    setMessageTemp('Frame count reduced')
  }

  // close reduce drawer
  function onReduceCancel() {
    setShowDrawer(false)
  }

  // remove duplicate frames based on imageData similarity
  async function onDuplicateAccept() {
    async function update() {
      return new Promise(async resolve1 => {
        var keepImages = []
        var deleteImages = []

        for (let i = 0; i < images.length - 1; i += 1) {
          const c1 = document.createElement('canvas')
          c1.width = gifData.width
          c1.height = gifData.height
          const ctx1 = c1.getContext('2d')
          const image1 = new Image()
          // get imageData from current frame
          const data1 = await new Promise(resolve2 => {
            image1.onload = () => {
              ctx1.drawImage(image1, 0, 0)
              resolve2(ctx1.getImageData(0, 0, c1.width, c1.height).data)
            }
            image1.src = images[i].path
          })

          const c2 = document.createElement('canvas')
          c2.width = gifData.width
          c2.height = gifData.height
          const ctx2 = c2.getContext('2d')
          const image2 = new Image()
          // get imageData from next frame
          const data2 = await new Promise(resolve3 => {
            image2.onload = () => {
              ctx2.drawImage(image2, 0, 0)
              resolve3(ctx2.getImageData(0, 0, c2.width, c2.height).data)
            }
            image2.src = images[i + 1].path
          })
          // compare imageData pixel for pixel
          // if r|g|b values differ increase different pixel count
          var diffPixelCount = 0
          for (let j = 0; j < data1.length; j += 4) {
            if (
              data1[j] !== data2[j] ||
              data1[j + 1] !== data2[j + 1] ||
              data1[j + 2] !== data2[j + 2]
            ) {
              diffPixelCount += 1
            }
          }
          // divide imageData length by 4 to get number of pixels
          const totalPixels = data1.length / 4
          // calculate in % how frame one matches frame two
          const percentMatch = 100 - Math.ceil((diffPixelCount / totalPixels) * 100)
          // add image to keep or delete based on user input percentage
          if (percentMatch >= duplicatePercent) {
            if (duplicateRemove === 'Remove First Frame') {
              deleteImages.push(images[i])
            } else if (duplicateRemove === 'Remove Last Frame') {
              deleteImages.push(images[i + 1])
            }
          } else {
            if (duplicateRemove === 'Remove First Frame') {
              keepImages.push(images[i])
            } else if (duplicateRemove === 'Remove Last Frame') {
              keepImages.push(images[i + 1])
            }
          }
        }
        // tack on first or last image to keep depending on user input first/last remove setting
        if (duplicateRemove === 'Remove First Frame') {
          keepImages = [...keepImages, images[images.length - 1]]
        } else if (duplicateRemove === 'Remove Last Frame') {
          keepImages = [images[0], ...keepImages]
        }
        // update project
        const newProject = {
          ...gifData,
          frames: keepImages
        }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        await writeFileAsync(projectPath, JSON.stringify(newProject))
        // delete duplicate images
        for (const [i, img] of deleteImages.entries()) {
          unlinkAsync(img.path).then(() => {
            if (i === deleteImages.length - 1) {
              resolve1()
            }
          })
        }
      })
    }

    setLoading(true)
    await update()
    setLoading(false)
    setShowDrawer(false)
    initialize(0)
    setMessageTemp('Duplicates removed')
  }

  function onDuplicateCancel() {
    setShowDrawer(false)
  }

  // reverse the order of frames
  async function onReverseClick() {
    async function update() {
      return new Promise(resolve => {
        const newProject = {
          ...gifData,
          frames: images.slice().reverse()
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
    initialize(imageIndex)
    setMessageTemp('Frame order reversed')
  }

  // add yoyo effect - doubles frames by adding reversed original frames to the end or original frames
  async function onYoyoClick() {
    async function update() {
      return new Promise(async resolve => {
        const projectFolder = path.join(RECORDINGS_DIRECTORY, gifData.relative)
        const newFrames = images.slice()

        for (const [i, img] of images
          .slice()
          .reverse()
          .entries()) {
          const dstPath = path.join(projectFolder, createFileName('YY', i))
          await copyFileAsync(img.path, dstPath)
          const newFrame = {
            ...images.slice().reverse()[i],
            path: dstPath
          }
          newFrames.push(newFrame)
        }

        const projectPath = path.join(projectFolder, 'project.json')
        const newProject = {
          ...gifData,
          frames: newFrames
        }
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          resolve()
        })
      })
    }

    setLoading(true)
    await update()
    setLoading(false)
    initialize(imageIndex)
    setMessageTemp('Yoyo effect applied')
  }

  // move selected frames an index to the left - account for wrap arounds
  async function onMoveFrameLeft() {
    async function update() {
      return new Promise(resolve => {
        const newFrames = images.slice()
        const newIndices = []
        // use a temp variable to swap frames
        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            var newIndex = i === 0 ? newFrames.length - 1 : i - 1
            var temp = newFrames[i]
            newFrames[i] = newFrames[newIndex]
            newFrames[newIndex] = temp
            newIndices.push(newIndex)
          }
        }

        const newImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1
        const newSelected = selected.map((el, i) => newIndices.includes(i))
        const newProject = { ...gifData, frames: newFrames }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          setImages(newFrames)
          setImageIndex(newImageIndex)
          setSelected(newSelected)
          resolve()
        })
      })
    }

    setLoading(true)
    await update()
    setLoading(false)
    setMessageTemp(`Frame(s) moved to the left`)
  }

  // move selected frames 1 frame to the right
  async function onMoveFrameRight() {
    async function update() {
      return new Promise(resolve => {
        const newFrames = images.slice()
        const newIndices = []

        // reverse selected List makes process easier due to consecutive selected frames
        for (const [i, bool] of selected
          .toArray()
          .reverse()
          .entries()) {
          if (bool) {
            const realIndex = newFrames.length - 1 - i
            // wrap last frame around to begining if selected
            var newIndex = realIndex + 1 === newFrames.length ? 0 : realIndex + 1
            var temp = newFrames[realIndex]
            newFrames[realIndex] = newFrames[newIndex]
            newFrames[newIndex] = temp
            newIndices.push(newIndex)
          }
        }

        const newImageIndex = imageIndex === images.length - 1 ? 0 : imageIndex + 1
        const newSelected = selected.map((el, i) => newIndices.includes(i))
        const newProject = { ...gifData, frames: newFrames }
        const projectPath = path.join(RECORDINGS_DIRECTORY, gifData.relative, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          setImages(newFrames)
          setImageIndex(newImageIndex)
          setSelected(newSelected)
          resolve()
        })
      })
    }

    setLoading(true)
    await update()
    setLoading(false)
    setMessageTemp(`Frame(s) moved to the right`)
  }

  // override duration for selected frames to new value
  async function onOverrideAccept() {
    async function update() {
      return new Promise(resolve => {
        const newFrames = []

        for (const [i, bool] of selected.toArray().entries()) {
          var newFrame = images[i]
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
    setMessageTemp(`Duration (delay) altered`)
  }

  // close override drawer
  function onOverrideCancel() {
    setShowDrawer(false)
  }

  // increase/decrease duration of selected frames
  async function onIncreaseAccept() {
    async function update() {
      return new Promise(resolve => {
        const newFrames = []
        for (const [i, bool] of selected.toArray().entries()) {
          const newFrame = images[i]

          if (bool) {
            var newTime
            if (incDecValue >= 0) {
              newTime = newFrame.time + incDecValue > 25000 ? 25000 : newFrame.time + incDecValue
            } else {
              newTime =
                newFrame.time - Math.abs(incDecValue) < 10
                  ? 10
                  : newFrame.time - Math.abs(incDecValue)
            }

            newFrame.time = newTime
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
    setMessageTemp(`Duration (delay) altered`)
  }

  // close increase drawer
  function onIncreaseCancel() {
    setShowDrawer(false)
  }

  // create a new title frame image file and update project.json
  async function onTitleAccept() {
    const filepath = path.join(RECORDINGS_DIRECTORY, gifData.relative, createTFName())

    async function draw() {
      return new Promise(resolve => {
        const reader = new FileReader()

        reader.onload = () => {
          const buffer = Buffer.from(reader.result)
          writeFileAsync(filepath, buffer).then(() => {
            resolve()
          })
        }

        const c1 = document.createElement('canvas')
        c1.width = gifData.width
        c1.height = gifData.height
        const ctx1 = c1.getContext('2d')
        ctx1.textBaseline = 'middle'
        ctx1.fillStyle = titleBackground
        ctx1.fillRect(0, 0, c1.width, c1.height)

        const textArray = titleText.split('\n')
        var longest = 0
        var longestIndex
        for (const [i, text] of textArray.entries()) {
          const len = text.length
          if (len > longest) {
            longestIndex = i
            longest = len
          }
        }

        ctx1.fillStyle = titleColor
        ctx1.font = `${titleStyle} ${titleSize}px ${titleFont}`
        const { x, y } = getTextXY(
          c1,
          titleVertical,
          titleHorizontal,
          titleSize,
          textArray[longestIndex],
          textArray.length,
          1
        )

        for (const [i, text] of textArray.entries()) {
          ctx1.fillText(text, x, y + i * titleSize * 1)
        }

        c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
      })
    }

    async function update() {
      return new Promise(resolve => {
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
          resolve()
        })
      })
    }

    setLoading(true)
    await draw()
    await update()
    setLoading(false)
    setShowDrawer(false)
    initialize(imageIndex)
  }

  // cancel title frame creation
  function onTitleCancel() {
    setShowDrawer(false)
    setTitleText('Title Frame')
  }

  function onKeyboardAccept() {
    setShowDrawer(false)
  }

  function onKeyboardCancel() {
    setShowDrawer(false)
  }

  // draw text block on selected frames
  async function onTextAccept() {
    async function draw() {
      return new Promise(resolve => {
        const lastIndex = selected.findLastIndex(el => el)
        // draw user input text on canvas
        const c1 = document.createElement('canvas')
        c1.width = textWidth
        c1.height = textHeight
        const ctx1 = c1.getContext('2d')
        ctx1.textBaseline = 'top'
        ctx1.fillStyle = textColor
        ctx1.font = `${textStyle} ${textSize}px ${textFont}`
        const textArray = textText.split('\n')
        // account for multiline text
        for (const [i, text] of textArray.entries()) {
          ctx1.fillText(text, 0, i * textSize)
        }
        // draw text canvas on top on frame image if selected
        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()

            reader.onload = () => {
              const filepath = images[i].path
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                if (i === lastIndex) {
                  resolve()
                }
              })
            }

            const c2 = document.createElement('canvas')
            c2.width = gifData.width
            c2.height = gifData.height
            const ctx2 = c2.getContext('2d')
            const image1 = new Image()
            image1.onload = () => {
              ctx2.drawImage(image1, 0, 0)
              ctx2.drawImage(c1, textX, textY)
              c2.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
            }
            image1.src = images[i].path
          }
        }
      })
    }

    setLoading(true)
    await draw()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
    onTextReset()
    setMessageTemp('Overlay applied')
  }

  // close text drawer
  function onTextCancel() {
    setShowDrawer(false)
    onTextReset()
  }

  // reset all text state variables
  function onTextReset() {
    setTextText('Free Text')
    setTextFont('Segoe UI')
    setTextSize(20)
    setTextStyle('Normal')
    setTextColor('#000000')
    setTextX(0)
    setTextY(0)
    setTextWidth(0)
    setTextHeight(0)
  }

  // add free drawing to selected frames
  async function onDrawAccept() {
    // handle highlighter effect
    const ctx3 = canvas3.current.getContext('2d')
    const data = ctx3.getImageData(0, 0, gifData.width, gifData.height).data

    // change alpha values to 52 - equivilant to 52/255 or .2 opacity
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] !== 0) {
        data[i] = 52
      }
    }
    // create new imageData with opacity
    const imageData = new ImageData(data, gifData.width, gifData.height)
    // create canvas with opacity imateData
    const c1 = document.createElement('canvas')
    c1.width = gifData.width
    c1.height = gifData.height
    const cxt1 = c1.getContext('2d')
    cxt1.putImageData(imageData, 0, 0)

    async function draw() {
      return new Promise(resolve => {
        const lastIndex = selected.findLastIndex(el => el)

        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()

            reader.onload = () => {
              const filepath = images[i].path
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                if (i === lastIndex) {
                  resolve()
                }
              })
            }

            const c2 = document.createElement('canvas')
            c2.width = gifData.width
            c2.height = gifData.height
            const ctx2 = c2.getContext('2d')
            const image1 = new Image()
            // draw main image then opacity layer then regular drawing layer
            image1.onload = () => {
              ctx2.drawImage(image1, 0, 0)
              ctx2.drawImage(c1, 0, 0)
              ctx2.drawImage(canvas4.current, 0, 0)
              c2.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
            }
            image1.src = images[i].path
          }
        }
      })
    }

    setLoading(true)
    await draw()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
    setMessageTemp(`Overlay applied`)
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

  // handle free drawing on canvas5
  // handle mouse movement over canvas in drawing mode
  function onDrawMouseMove(e) {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    // create a cursor effect to match pen size/color or eraser
    if (drawType === 'pen') {
      drawBrush(canvas5.current, x, y, drawShape, drawPenColor, drawPenWidth, drawPenHeight)
    } else if (drawType === 'eraser') {
      drawEraser(canvas5.current, x, y, drawEraserWidth, drawEraserHeight)
    }

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

  // add new shapes to selected frames
  async function onShapeAccept() {
    async function draw() {
      return new Promise(resolve => {
        const lastIndex = selected.findLastIndex(el => el)

        const c1 = document.createElement('canvas')
        c1.width = gifData.width
        c1.height = gifData.height
        const ctx1 = c1.getContext('2d')

        // draw shape based on parameters
        for (const shape of shapeArray) {
          ctx1.beginPath()

          if (shape.shape === 'rectangle') {
            ctx1.rect(
              shape.x + shape.strokeWidth / 2,
              shape.y + shape.strokeWidth / 2,
              shape.width,
              shape.height
            )
          } else if (shape.shape === 'ellipsis') {
            ctx1.ellipse(
              shape.x + shape.width / 2 + shape.strokeWidth / 2,
              shape.y + shape.height / 2 + shape.strokeWidth / 2,
              shape.width / 2,
              shape.height / 2,
              0,
              0,
              Math.PI * 2
            )
          }

          ctx1.strokeStyle = shape.strokeColor
          ctx1.lineWidth = shape.strokeWidth
          ctx1.fillStyle = shape.fillColor
          ctx1.stroke()
          ctx1.fill()
        }

        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()

            reader.onload = () => {
              const filepath = images[i].path
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                if (i === lastIndex) {
                  resolve()
                }
              })
            }

            const c2 = document.createElement('canvas')
            c2.width = gifData.width
            c2.height = gifData.height
            const ctx2 = c2.getContext('2d')
            const image = new Image()
            image.onload = () => {
              ctx2.drawImage(image, 0, 0)
              ctx2.drawImage(c1, 0, 0)
              c2.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
            }
            image.src = images[i].path
          }
        }
      })
    }

    setLoading(true)
    await draw()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
    onShapeReset()
    setMessageTemp(`Overlay applied`)
  }

  // close shape drawer
  function onShapeCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
    onShapeReset()
  }

  function onShapeReset() {
    setShapeArray([])
    setShapeMode('insert')
    setShapeType('rectangle')
    setShapeStrokeWidth(10)
    setShapeStrokeColor('#000000')
    setShapeFillColor('#FFFFFF00')
  }

  // add configured border to selected frames
  async function onBorderAccept() {
    async function draw() {
      return new Promise(resolve => {
        const lastIndex = selected.findLastIndex(el => el)

        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()

            reader.onload = () => {
              const filepath = images[i].path
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                if (i === lastIndex) {
                  resolve()
                }
              })
            }

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

    setLoading(true)
    await draw()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
    setMessageTemp(`Overlay applied`)
  }

  // close border drawer
  function onBorderCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  // add configured progress to all frames
  async function onProgressAccept() {
    async function draw() {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })

      return new Promise(resolve => {
        const times = []
        var t = 0

        for (let i = 0; i < images.length; i++) {
          times.push(t)
          t += images[i].time
        }

        for (let i = 0; i < images.length; i++) {
          const reader = new FileReader()

          reader.onload = () => {
            const filepath = images[i].path
            const buffer = Buffer.from(reader.result)
            writeFileAsync(filepath, buffer).then(() => {
              if (i === images.length - 1) {
                resolve()
              }
            })
          }

          const c1 = document.createElement('canvas')
          c1.width = gifData.width
          c1.height = gifData.height
          const ctx1 = c1.getContext('2d')
          const image1 = new Image()
          image1.onload = () => {
            ctx1.drawImage(image1, 0, 0)
            if (progressType === 'bar') {
              drawProgressBar(
                c1,
                Math.round((i / (images.length - 1)) * 100),
                progressBackground,
                progressHorizontal,
                progressVertical,
                progressOrientation,
                progressThickness
              )
            } else if (progressType === 'text') {
              drawProgressText(
                c1,
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
            c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
          }
          image.src = images[i].path
        }
      })
    }

    setLoading(true)
    await draw()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setScale(zoomToFit)
    setShowDrawer(false)
    setMessageTemp(`Overlay applied`)
  }

  // close progress drawer
  function onProgressCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
  }

  // highlight points where mouse was clicked during recording
  async function onClicksAccept() {
    async function draw() {
      return new Promise(resolve => {
        const lastIndex = List(images).findLastIndex(el => el.clicked)

        for (const [i, img] of images.entries()) {
          if (img.clicked) {
            const reader = new FileReader()

            reader.onload = () => {
              const filepath = img.path
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                if (i === lastIndex) {
                  resolve()
                }
              })
            }

            const c1 = document.createElement('canvas')
            c1.width = gifData.width
            c1.height = gifData.height
            const ctx1 = c1.getContext('2d')
            const image1 = new Image()
            image1.onload = () => {
              ctx1.drawImage(image1, 0, 0)
              ctx1.fillStyle = clicksColor + '80'
              ctx1.beginPath()
              ctx1.ellipse(
                img.cursorX,
                img.cursorY,
                clicksWidth / 2,
                clicksHeight / 2,
                0,
                0,
                Math.PI * 2
              )
              ctx1.fill()
              c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
            }
            image1.src = img.path
          }
        }
      })
    }

    setLoading(true)
    await draw()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
  }

  // close clicks drawer
  function onClicksCancel() {
    setShowDrawer(false)
  }

  // pixelate selection on selected frames
  async function onObfuscateAccept() {
    async function draw() {
      return new Promise(async resolve1 => {
        const lastIndex = selected.findLastIndex(el => el)

        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()

            reader.onload = () => {
              const filepath = images[i].path
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                if (i === lastIndex) {
                  resolve1()
                }
              })
            }

            const c1 = document.createElement('canvas')
            c1.width = gifData.width
            c1.height = gifData.height
            const ctx1 = c1.getContext('2d')
            // adjust width and height to multiples of pixelation size
            // prevents discoloration of edges
            var adjustedWidth =
              obfuscateWidth - (obfuscateWidth % obfuscatePixels) + obfuscatePixels
            var adjustedHeight =
              obfuscateHeight - (obfuscateHeight % obfuscatePixels) + obfuscatePixels
            const c2 = document.createElement('canvas')
            c2.width = adjustedWidth
            c2.height = adjustedHeight
            const ctx2 = c2.getContext('2d')
            const image1 = new Image()
            // draw original image on main canvas
            // draw selection onto secondary canvas
            await new Promise(resolve2 => {
              image1.onload = () => {
                ctx1.drawImage(image1, 0, 0)
                ctx2.drawImage(
                  c1,
                  obfuscateX,
                  obfuscateY,
                  adjustedWidth,
                  adjustedHeight,
                  0,
                  0,
                  adjustedWidth,
                  adjustedHeight
                )
                resolve2()
              }
              image1.src = images[i].path
            })

            // use loops to get image data for each square chuck
            const data = []
            for (var y = 0; y < adjustedHeight; y += obfuscatePixels) {
              for (var x = 0; x < adjustedWidth; x += obfuscatePixels) {
                const imageData = ctx2.getImageData(x, y, obfuscatePixels, obfuscatePixels)
                data.push(imageData.data)
              }
            }

            // loop over array of imageData arrays
            // find average rgba value for each square - obfuscatePixels x obfuscatePixels
            const pixelColors = []
            var r = 0
            var g = 0
            var b = 0
            var a = 0
            var r1, g1, b1, a1
            var divide = 0

            for (const d of data) {
              // if use average is checked get totals for red, green, blue, alpha
              if (obfuscateAverage) {
                for (var j = 0; j < d.length; j += 4) {
                  r += d[j]
                  g += d[j + 1]
                  b += d[j + 2]
                  a += d[j + 3]
                  divide += 1
                }
              } else {
                // if not average just take first pixel's values
                r = d[0]
                g = d[1]
                b = d[2]
                a = d[3]
                divide = 1
              }

              // find average values for red, green, blue alpha
              r1 = Math.round(r / divide)
              g1 = Math.round(g / divide)
              b1 = Math.round(b / divide)
              a1 = Math.ceil((a / divide / 255) * 100) / 100
              // combine values into rgba color string
              pixelColors.push(`rgba(${r1},${g1},${b1},${a1})`)
              // reset variables for next imageData array
              r = 0
              g = 0
              b = 0
              a = 0
              divide = 0
            }

            // third canvas contains pixelated section
            const c3 = document.createElement('canvas')
            c3.width = adjustedWidth
            c3.height = adjustedHeight
            const ctx3 = c3.getContext('2d')

            var pixelIndex = 0
            for (let y = 0; y < adjustedHeight; y += obfuscatePixels) {
              for (let x = 0; x < adjustedWidth; x += obfuscatePixels) {
                ctx3.fillStyle = pixelColors[pixelIndex]
                ctx3.fillRect(x, y, obfuscatePixels, obfuscatePixels)
                pixelIndex += 1
              }
            }
            // draw pixelated section on top of original
            ctx1.drawImage(c3, obfuscateX, obfuscateY)
            c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
          }
        }
      })
    }

    setLoading(true)
    await draw()
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
    onObfuscateReset()
    setMessageTemp(`Overlay applied`)
  }

  // close obfuscate drawer
  function onObfuscateCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
    onObfuscateReset()
  }

  // reset obfuscate overlay square dimensions
  function onObfuscateReset() {
    setObfuscateWidth(0)
    setObfuscateHeight(0)
    setObfuscateX(0)
    setObfuscateY(0)
  }

  // open file dialog for watermark image file
  function onWatermarkFileClick() {
    const win = remote.getCurrentWindow()
    const opts = {
      title: 'Select an Image',
      defaultPath: remote.app.getPath('pictures'),
      buttonLabel: 'Open',
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpg', 'jpeg']
        }
      ],
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
        const lastIndex = selected.findLastIndex(el => el)

        for (const [i, bool] of selected.toArray().entries()) {
          if (bool) {
            const reader = new FileReader()

            reader.onload = () => {
              const filepath = images[i].path
              const buffer = Buffer.from(reader.result)
              writeFileAsync(filepath, buffer).then(() => {
                if (i === lastIndex) {
                  resolve1()
                }
              })
            }

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
    await new Promise(resolve => {
      setTimeout(() => {
        updateHashModifier()
        resolve()
      }, 500)
    })
    setLoading(false)
    setShowDrawer(false)
    setScale(zoomToFit)
    onWatermarkReset()
    setMessageTemp(`Overlay applied`)
  }

  // close watermark drawer
  function onWatermarkCancel() {
    setShowDrawer(false)
    setScale(zoomToFit)
    onWatermarkReset()
  }

  // reset watermark state to defaults
  function onWatermarkReset() {
    setWatermarkPath('')
    setWatermarkWidth(0)
    setWatermarkHeight(0)
    setWatermarkX(0)
    setWatermarkY(0)
    setWatermarkOpacity(0.7)
    setWatermarkScale(1)
    setWatermarkRealWidth(0)
    setWatermarkRealHeight(0)
  }

  async function onFadeAccept() {
    const projectFolder = path.join(RECORDINGS_DIRECTORY, gifData.relative)
    const fadeImages = []

    async function draw() {
      return new Promise(async resolve1 => {
        for (let i = 0; i < fadeLength; i += 1) {
          const reader = new FileReader()

          const filepath = path.join(projectFolder, createFileName('FD', i))
          fadeImages.push({ path: filepath, time: fadeDelay })

          reader.onload = () => {
            const buffer = Buffer.from(reader.result)
            writeFileAsync(filepath, buffer).then(() => {
              if (i === fadeLength - 1) {
                resolve1()
              }
            })
          }

          const c1 = document.createElement('canvas')
          c1.width = gifData.width
          c1.height = gifData.height
          const ctx1 = c1.getContext('2d')
          const image1 = new Image()
          const image2 = new Image()
          const alphaColor = Math.round(((i + 1) / fadeLength) * 100) / 100
          const alphaFrame = 1 - alphaColor

          await new Promise(resolve2 => {
            image1.onload = () => {
              ctx1.drawImage(image1, 0, 0)
              resolve2()
            }
            image1.src = images[imageIndex + 1].path
          })

          await new Promise(resolve3 => {
            image2.onload = () => {
              if (fadeOption === 'frame') {
                ctx1.globalAlpha = alphaFrame
                ctx1.drawImage(image2, 0, 0)
              } else if (fadeOption === 'color') {
                ctx1.globalAlpha = alphaColor
                ctx1.fillStyle = fadeColor
                ctx1.fillRect(0, 0, c1.width, c1.height)
              }

              c1.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
              resolve3()
            }
            image2.src = images[imageIndex].path
          })
        }
      })
    }

    async function update() {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
      return new Promise(resolve => {
        const newImages = images.slice()
        newImages.splice(imageIndex + 1, 0, ...fadeImages)
        const newProject = {
          ...gifData,
          frames: newImages
        }
        const projectPath = path.join(projectFolder, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          resolve()
        })
      })
    }

    setLoading(true)
    await draw()
    await update()
    setLoading(false)
    setShowDrawer(false)
    initialize(imageIndex)
    setMessageTemp('Transition inserted')
  }

  function onFadeCancel() {
    setShowDrawer(false)
  }

  // apply slide transition
  async function onSlideAccept() {
    const projectFolder = path.join(RECORDINGS_DIRECTORY, gifData.relative)
    // store new image objects created in draw to be used in update
    const slideImages = []
    // create new frames
    async function draw() {
      return new Promise(async resolve1 => {
        // draw next image with .25 alpha on canvas
        const c1 = document.createElement('canvas')
        c1.width = gifData.width
        c1.height = gifData.height
        const ctx1 = c1.getContext('2d')
        const image1 = new Image()
        await new Promise(resolve2 => {
          image1.onload = () => {
            ctx1.globalAlpha = 0.25
            ctx1.drawImage(image1, 0, 0)
            resolve2()
          }
          image1.src = images[imageIndex + 1].path
        })
        // create a new frame for each user input slide length
        for (let i = 0; i < slideLength; i += 1) {
          const reader = new FileReader()
          // add new frame to slide images array
          const filepath = path.join(projectFolder, createFileName('SL', i))
          slideImages.push({ path: filepath, time: slideDelay })

          reader.onload = () => {
            const buffer = Buffer.from(reader.result)
            writeFileAsync(filepath, buffer).then(() => {
              if (i === slideLength - 1) {
                resolve1()
              }
            })
          }
          // draw first image the alpha next image on top
          const c2 = document.createElement('canvas')
          c2.width = gifData.width
          c2.height = gifData.height
          const ctx2 = c2.getContext('2d')
          const image2 = new Image()
          await new Promise(resolve3 => {
            image2.onload = () => {
              const x = gifData.width - (gifData.width / slideLength) * (i + 1)
              ctx2.drawImage(image2, 0, 0)
              ctx2.drawImage(c1, x, 0)
              c2.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
              resolve3()
            }
            image2.src = images[imageIndex].path
          })
        }
      })
    }
    // update project json file
    async function update() {
      return new Promise(resolve => {
        // copy existing and splice in new images
        const newImages = images.slice()
        newImages.splice(imageIndex + 1, 0, ...slideImages)
        const newProject = {
          ...gifData,
          frames: newImages
        }
        const projectPath = path.join(projectFolder, 'project.json')
        writeFileAsync(projectPath, JSON.stringify(newProject)).then(() => {
          resolve()
        })
      })
    }

    setLoading(true)
    await draw()
    await update()
    setLoading(false)
    setShowDrawer(false)
    initialize(imageIndex)
    setMessageTemp('Transition inserted')
  }

  // close slide transition drawer
  function onSlideCancel() {
    setShowDrawer(false)
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
        onNewBoardClick={onNewBoardClick}
        onDiscardProjectClick={onDiscardProjectClick}
        onCutClick={onCutClick}
        onCopyClick={onCopyClick}
        onPasteClick={onPasteClick}
        onPlaybackClick={onPlaybackClick}
        onFrameDeleteClick={onFrameDeleteClick}
        onReverseClick={onReverseClick}
        onYoyoClick={onYoyoClick}
        onMoveFrameLeft={onMoveFrameLeft}
        onMoveFrameRight={onMoveFrameRight}
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
          <TextOverlay
            show={drawerMode === 'text'}
            textText={textText}
            textFont={textFont}
            textStyle={textStyle}
            textSize={textSize}
            textColor={textColor}
            textWidth={textWidth}
            textHeight={textHeight}
            textX={textX}
            textY={textY}
            setTextWidth={setTextWidth}
            setTextHeight={setTextHeight}
            setTextX={setTextX}
            setTextY={setTextY}
          />
          <ShapeOverlay
            show={drawerMode === 'shape'}
            gifData={gifData}
            shapeArray={shapeArray}
            shapeMode={shapeMode}
            shapeType={shapeType}
            shapeStrokeWidth={shapeStrokeWidth}
            shapeStrokeColor={shapeStrokeColor}
            shapeFillColor={shapeFillColor}
            setShapeArray={setShapeArray}
            setShapeStrokeWidth={setShapeStrokeWidth}
            setShapeStrokeColor={setShapeStrokeColor}
            setShapeFillColor={setShapeFillColor}
          />
          <ObfuscateOverlay
            show={drawerMode === 'obfuscate'}
            gifData={gifData}
            obfuscatePixels={obfuscatePixels}
            obfuscateWidth={obfuscateWidth}
            obfuscateHeight={obfuscateHeight}
            obfuscateX={obfuscateX}
            obfuscateY={obfuscateY}
            setObfuscateWidth={setObfuscateWidth}
            setObfuscateHeight={setObfuscateHeight}
            setObfuscateX={setObfuscateX}
            setObfuscateY={setObfuscateY}
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
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        selected={selected}
        images={images}
        imageIndex={imageIndex}
        hashModifier={hashModifier}
        onClick={onThumbnailClick}
      />
      <BottomBar
        showDrawer={showDrawer}
        loading={loading}
        playing={playing}
        total={images.length}
        selected={selected.count(el => el)}
        index={imageIndex + 1}
        messageTemp={messageTemp}
        messagePerm={messagePerm}
        scale={scale}
        setScale={setScale}
        setMessageTemp={setMessageTemp}
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
        ) : drawerMode === 'save' ? (
          <SaveAs
            drawerHeight={drawerHeight}
            ffmpegPath={ffmpegPath}
            saveMode={saveMode}
            gifFolderPath={gifFolderPath}
            gifFilename={gifFilename}
            gifOverwrite={gifOverwrite}
            gifOverwriteError={gifOverwriteError}
            gifEncoder={gifEncoder}
            gifLooped={gifLooped}
            gifForever={gifForever}
            gifLoops={gifLoops}
            gifOptimize={gifOptimize}
            gifQuality={gifQuality}
            gifColors={gifColors}
            setSaveMode={setSaveMode}
            setGifFolderPath={setGifFolderPath}
            setGifFilename={setGifFilename}
            setGifOverwrite={setGifOverwrite}
            setGifEncoder={setGifEncoder}
            setGifLooped={setGifLooped}
            setGifForever={setGifForever}
            setGifLoops={setGifLoops}
            setGifOptimize={setGifOptimize}
            setGifQuality={setGifQuality}
            setGifColors={setGifColors}
            onAccept={onSaveAccept}
            onCancel={onSaveCancel}
          />
        ) : drawerMode === 'clipboard' ? (
          <Clipboard
            drawerHeight={drawerHeight}
            clipboardDirectory={clipboardDirectory}
            clipboardItems={clipboardItems}
            clipboardIndex={clipboardIndex}
            clipboardPaste={clipboardPaste}
            setClipboardItems={setClipboardItems}
            setClipboardIndex={setClipboardIndex}
            setClipboardPaste={setClipboardPaste}
            onCancel={() => setShowDrawer(false)}
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
        ) : drawerMode === 'flip' ? (
          <Flip
            drawerHeight={drawerHeight}
            flipMode={flipMode}
            setFlipMode={setFlipMode}
            onAccept={onFlipAccept}
            onCancel={onFlipCancel}
          />
        ) : drawerMode === 'reduce' ? (
          <ReduceFrames
            drawerHeight={drawerHeight}
            reduceFactor={reduceFactor}
            reduceCount={reduceCount}
            setReduceFactor={setReduceFactor}
            setReduceCount={setReduceCount}
            onAccept={onReduceAccept}
            onCancel={onReduceCancel}
          />
        ) : drawerMode === 'duplicate' ? (
          <Duplicate
            drawerHeight={drawerHeight}
            duplicatePercent={duplicatePercent}
            duplicateRemove={duplicateRemove}
            setDuplicatePercent={setDuplicatePercent}
            setDuplicateRemove={setDuplicateRemove}
            onAccept={onDuplicateAccept}
            onCancel={onDuplicateCancel}
          />
        ) : drawerMode === 'override' ? (
          <Override
            drawerHeight={drawerHeight}
            overrideMS={overrideMS}
            setOverrideMS={setOverrideMS}
            onAccept={onOverrideAccept}
            onCancel={onOverrideCancel}
          />
        ) : drawerMode === 'increase' ? (
          <IncreaseDecrease
            drawerHeight={drawerHeight}
            incDecValue={incDecValue}
            setIncDecValue={setIncDecValue}
            onAccept={onIncreaseAccept}
            onCancel={onIncreaseCancel}
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
        ) : drawerMode === 'keyboard' ? (
          <Keyboard
            drawerHeight={drawerHeight}
            images={images}
            fontOptions={fontOptions}
            keyboardExtend={keyboardExtend}
            keyboardExtendTime={keyboardExtendTime}
            keyboardFont={keyboardFont}
            keyboardSize={keyboardSize}
            keyboardColor={keyboardColor}
            keyboardStyle={keyboardStyle}
            keyboardBackground={keyboardBackground}
            keyboardHorizontal={keyboardHorizontal}
            keyboardVertical={keyboardVertical}
            setKeyboardExtend={setKeyboardExtend}
            setKeyboardExtendTime={setKeyboardExtendTime}
            setKeyboardFont={setKeyboardFont}
            setKeyboardSize={setKeyboardSize}
            setKeyboardColor={setKeyboardColor}
            setKeyboardStyle={setKeyboardStyle}
            setKeyboardBackground={setKeyboardBackground}
            setKeyboardHorizontal={setKeyboardHorizontal}
            setKeyboardVertical={setKeyboardVertical}
            onAccept={onKeyboardAccept}
            onCancel={onKeyboardCancel}
          />
        ) : drawerMode === 'text' ? (
          <Text
            drawerHeight={drawerHeight}
            gifData={gifData}
            fontOptions={fontOptions}
            textText={textText}
            textFont={textFont}
            textStyle={textStyle}
            textSize={textSize}
            textColor={textColor}
            textWidth={textWidth}
            textHeight={textHeight}
            textX={textX}
            textY={textY}
            setTextText={setTextText}
            setTextFont={setTextFont}
            setTextStyle={setTextStyle}
            setTextSize={setTextSize}
            setTextColor={setTextColor}
            setTextX={setTextX}
            setTextY={setTextY}
            onAccept={onTextAccept}
            onCancel={onTextCancel}
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
        ) : drawerMode === 'shape' ? (
          <Shape
            drawerHeight={drawerHeight}
            shapeMode={shapeMode}
            shapeType={shapeType}
            shapeStrokeWidth={shapeStrokeWidth}
            shapeStrokeColor={shapeStrokeColor}
            shapeFillColor={shapeFillColor}
            setShapeMode={setShapeMode}
            setShapeType={setShapeType}
            setShapeStrokeWidth={setShapeStrokeWidth}
            setShapeStrokeColor={setShapeStrokeColor}
            setShapeFillColor={setShapeFillColor}
            onAccept={onShapeAccept}
            onCancel={onShapeCancel}
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
        ) : drawerMode === 'clicks' ? (
          <MouseClicks
            drawerHeight={drawerHeight}
            clicksColor={clicksColor}
            clicksWidth={clicksWidth}
            clicksHeight={clicksHeight}
            setClicksColor={setClicksColor}
            setClicksWidth={setClicksWidth}
            setClicksHeight={setClicksHeight}
            onAccept={onClicksAccept}
            onCancel={onClicksCancel}
          />
        ) : drawerMode === 'obfuscate' ? (
          <Obfuscate
            drawerHeight={drawerHeight}
            obfuscatePixels={obfuscatePixels}
            obfuscateAverage={obfuscateAverage}
            setObfuscatePixels={setObfuscatePixels}
            setObfuscateAverage={setObfuscateAverage}
            onAccept={onObfuscateAccept}
            onCancel={onObfuscateCancel}
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
        ) : drawerMode === 'slide' ? (
          <Slide
            drawerHeight={drawerHeight}
            slideLength={slideLength}
            slideDelay={slideDelay}
            setSlideLength={setSlideLength}
            setSlideDelay={setSlideDelay}
            onAccept={onSlideAccept}
            onCancel={onSlideCancel}
          />
        ) : drawerMode === 'fade' ? (
          <Fade
            drawerHeight={drawerHeight}
            fadeOption={fadeOption}
            fadeLength={fadeLength}
            fadeDelay={fadeDelay}
            fadeColor={fadeColor}
            setFadeOption={setFadeOption}
            setFadeLength={setFadeLength}
            setFadeDelay={setFadeDelay}
            setFadeColor={setFadeColor}
            onAccept={onFadeAccept}
            onCancel={onFadeCancel}
          />
        ) : null}
      </Drawer>
    </Container>
  )
}
