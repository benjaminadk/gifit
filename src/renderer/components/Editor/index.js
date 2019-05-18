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
import drawBorder from './drawBorder'
import drawProgressBar from './drawProgressBar'
import drawProgressText from './drawProgressText'
import createGIFFfmpeg from './createGIFFfmpeg'
import createGIFEncoder from './createGIFEncoder'
import getTextXY from './getTextXY'
import { AppContext } from '../App'
import Drawer from './Drawer'
import TitleFrame from './TitleFrame'
import FreeDrawing from './FreeDrawing'
import Border from './Border'
import Progress from './Progress'
import RecentProjects from './RecentProjects'
import Toolbar from './Toolbar'
import Thumbnails from './Thumbnails'
import BottomBar from './BottomBar'
import { Container, Main, Wrapper, Canvas1, Canvas2, Canvas3 } from './styles'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  mainWindow,
  appActions: { SET_APP_MODE, SET_PROJECT_FOLDER },
  constants: { IMAGE_TYPE }
} = config

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const readdirAsync = promisify(readdir)
const rmdirAsync = promisify(rmdir)
const unlinkAsync = promisify(unlink)

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)
  const { options, fontOptions, projectFolder } = state

  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [imageIndex, setImageIndex] = useState(null)
  const [selected, setSelected] = useState(List())

  const [gifData, setGifData] = useState(null)
  const [originalPaths, setOriginalPaths] = useState(null)
  const [totalDuration, setTotalDuration] = useState(null)
  const [averageDuration, setAverageDuration] = useState(null)

  const [thumbWidth, setThumbWidth] = useState(null)
  const [thumbHeight, setThumbHeight] = useState(null)

  const [scale, setScale] = useState(null)
  const [zoomToFit, setZoomToFit] = useState(null)

  const [recentProjects, setRecentProjects] = useState(null)
  const [playing, setPlaying] = useState(false)

  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState('')
  const [drawerHeight, setDrawerHeight] = useState(null)

  const [optionsOpen, setOptionsOpen] = useState(false)

  const [drawing, setDrawing] = useState(false)
  const [drawType, setDrawType] = useState('pen')
  const [drawPenWidth, setDrawPenWidth] = useState(50)
  const [drawPenHeight, setDrawPenHeight] = useState(50)
  const [drawPenColor, setDrawPenColor] = useState('#FFFF00')

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

  const [titleText, setTitleText] = useState('Title Frame')
  const [titleColor, setTitleColor] = useState('#000000')
  const [titleSize, setTitleSize] = useState(40)
  const [titleFont, setTitleFont] = useState('Segoe UI')
  const [titleStyle, setTitleStyle] = useState('Normal')
  const [titleDelay, setTitleDelay] = useState(500)
  const [titleVertical, setTitleVertical] = useState('Center')
  const [titleHorizontal, setTitleHorizontal] = useState('Center')
  const [titleBackground, setTitleBackground] = useState('#FFFF00')

  const container = useRef(null)
  const main = useRef(null)
  const wrapper = useRef(null)
  const canvas1 = useRef(null)
  const canvas2 = useRef(null)
  const canvas3 = useRef(null)
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
        const mainHeight = container.current.clientHeight - 120 - tHeight - 40 - 20
        main.current.style.height = mainHeight + 'px'
        // drawer height = main height - drawer header height - drawer buttons height
        const drawerHeight = mainHeight - 40 - 50
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
        setDrawerHeight(drawerHeight)
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
    if (!showDrawer) {
      setDrawerMode('')
    }
  }, [showDrawer])

  useEffect(() => {
    const ctx2 = canvas2.current.getContext('2d')
    const ctx3 = canvas3.current.getContext('2d')

    function onMouseMove(e) {
      const x = e.offsetX
      const y = e.offsetY
      ctx3.clearRect(0, 0, canvas3.current.width, canvas3.current.height)
      ctx3.fillStyle = drawPenColor
      ctx3.fillRect(x - drawPenWidth / 2, y - drawPenHeight / 2, drawPenWidth, drawPenHeight)
      if (drawing) {
        // use points here instead
        ctx2.fillStyle = drawPenColor
        ctx2.fillRect(x - drawPenWidth / 2, y - drawPenHeight / 2, drawPenWidth, drawPenHeight)
      }
    }

    function onMouseLeave() {
      ctx3.clearRect(0, 0, canvas3.current.width, canvas3.current.height)
    }

    function onMouseDown() {
      setDrawing(true)
    }

    function onMouseUp() {
      setDrawing(false)
    }

    if (drawerMode === 'drawing') {
      canvas3.current.addEventListener('mousedown', onMouseDown)
      canvas3.current.addEventListener('mouseup', onMouseUp)
      canvas3.current.addEventListener('mousemove', onMouseMove)
      canvas3.current.addEventListener('mouseleave', onMouseLeave)
    } else {
      canvas3.current.removeEventListener('mousedown', onMouseDown)
      canvas3.current.removeEventListener('mouseup', onMouseUp)
      canvas3.current.removeEventListener('mousemove', onMouseMove)
      canvas3.current.removeEventListener('mouseleave', onMouseLeave)
    }
    return () => {
      canvas3.current.removeEventListener('mousedown', onMouseDown)
      canvas3.current.removeEventListener('mouseup', onMouseUp)
      canvas3.current.removeEventListener('mousemove', onMouseMove)
      canvas3.current.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [drawerMode, drawing, drawPenWidth, drawPenHeight, drawPenColor])

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

  // navigate back to Landing page
  function onNewRecordingClick() {
    dispatch({
      type: SET_APP_MODE,
      payload: 0
    })
    remote.getCurrentWindow().setSize(mainWindow.width, mainWindow.height)
    remote.getCurrentWindow().center()
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

  // playback interface
  // index refers to button order 0=first 1=previous 2=play/pause 3=next 4=last
  function onPlaybackClick(index) {
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
    // parent window
    const win = remote.getCurrentWindow()
    // dialog options
    const opts = {
      type: 'question',
      buttons: ['Delete', 'Cancel'],
      defaultId: 0,
      title: `Delete Frames`,
      message: `Are you sure you want to delete?`,
      detail: `Action will delete ${count} selected frame${count === 1 ? '' : 's'}.`
    }
    // callback after user clicks button
    const callback = result => {
      // if user clicks Delete
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

  // zoom input keyboard entry
  function onZoomChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 500) {
        newValue = 500
      } else if (Number(value) < 10) {
        newValue = 10
      } else {
        newValue = value
      }
    } else {
      newValue = 100
    }
    setScale(newValue / 100)
  }

  // zoom input arrows
  function onZoomArrowClick(inc) {
    var currentValue = scale * 100
    var newValue
    if (inc) {
      if (currentValue < 500) {
        newValue = currentValue + 1
      }
    } else {
      if (currentValue > 10) {
        newValue = currentValue - 1
      }
    }
    setScale(newValue / 100)
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

  // open drawer
  function onOpenDrawer(drawer) {
    if (drawer === 'recent') {
    } else if (drawer === 'title') {
      setScale(zoomToFit)
    } else if (drawer === 'border') {
      setScale(1)
    } else if (drawer === 'progress') {
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
    } else if (drawer === 'drawing') {
      setScale(1)
    }
    setDrawerMode(drawer)
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

  // create a new title frame image file and update project.json
  function onTitleAccept() {
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
    })
  }

  // cancel title frame creation
  function onTitleCancel() {
    setShowDrawer(false)
    setTitleText('Title Frame')
  }

  function onDrawAccept() {
    setShowDrawer(false)
  }

  function onDrawCancel() {
    setShowDrawer(false)
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

  // open options window
  function onOptionsClick() {
    console.log(optionsOpen)
    if (!optionsOpen) {
      setOptionsOpen(true)
      initializeOptions(remote.getCurrentWindow(), dispatch, setOptionsOpen)
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
        totalFrames={images.length}
        totalDuration={totalDuration}
        averageDuration={averageDuration}
        gifData={gifData}
        scale={scale}
        zoomToFit={zoomToFit}
        playing={playing}
        setScale={setScale}
        onOpenDrawer={onOpenDrawer}
        onZoomChange={onZoomChange}
        onZoomArrowClick={onZoomArrowClick}
        onNewRecordingClick={onNewRecordingClick}
        onSaveClick={onSaveClick}
        onDiscardProjectClick={onDiscardProjectClick}
        onPlaybackClick={onPlaybackClick}
        onFrameDeleteClick={onFrameDeleteClick}
        onOptionsClick={onOptionsClick}
        onSelectClick={onSelectClick}
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
          <Canvas3 ref={canvas3} show={drawerMode === 'drawing'} />
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
        onPlaybackClick={onPlaybackClick}
      />
      <Drawer show={showDrawer} thumbHeight={thumbHeight}>
        {drawerMode === 'recent' ? (
          <RecentProjects
            drawerHeight={drawerHeight}
            recentProjects={recentProjects}
            onAccept={onRecentAccept}
            onCancel={onRecentCancel}
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
            setDrawType={setDrawType}
            setDrawPenWidth={setDrawPenWidth}
            setDrawPenHeight={setDrawPenHeight}
            setDrawPenColor={setDrawPenColor}
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
        ) : null}
      </Drawer>
    </Container>
  )
}
