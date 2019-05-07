import React, { useRef, useEffect, useState, useContext } from 'react'
import { remote } from 'electron'
import styled from 'styled-components'
import { AngleDoubleLeft } from 'styled-icons/fa-solid/AngleDoubleLeft'
import { AngleLeft } from 'styled-icons/fa-solid/AngleLeft'
import { AngleDoubleRight } from 'styled-icons/fa-solid/AngleDoubleRight'
import { AngleRight } from 'styled-icons/fa-solid/AngleRight'
import { Play } from 'styled-icons/fa-solid/Play'
import { Save } from 'styled-icons/fa-solid/Save'
import { FolderOpen } from 'styled-icons/fa-solid/FolderOpen'
import { BorderOuter } from 'styled-icons/material/BorderOuter'
import { lighten } from 'polished'
import path from 'path'
import { readFile, writeFile } from 'fs'
import { promisify } from 'util'
import { spawn } from 'child_process'
import createRandomString from '../../lib/createRandomString'
import { AppContext } from '../App'
import Drawer from './Drawer'
import Border from './Border'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const {
  constants: { IMAGE_TYPE }
} = config

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 100px 1fr 100px;
`

export const Toolbar = styled.div`
  display: grid;
  grid-template-rows: 20px 1fr;
  border-bottom: ${p => p.theme.border};
`

export const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 100px);
`

export const Tab = styled.div`
  background: ${p => (p.selected ? p.theme.grey[1] : 'transparent')};
`

export const FileTab = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 100px);
  .action {
    display: flex;
    flex-direction: column;
    align-items: center;
    svg {
      width: 20px;
      height: 20px;
    }
    .text {
    }
  }
`

export const PlaybackTab = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 50px);
  .action {
    display: grid;
    justify-items: center;
    align-items: center;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`

export const ImageTab = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 50px);
  .action {
    display: flex;
    flex-direction: column;
    align-items: center;
    svg {
      width: 20px;
      height: 20px;
    }
    .text {
    }
  }
`

export const Main = styled.div`
  position: absolute;
  top: 100px;
  left: 0;
  overflow: auto;
  width: ${p => (p.shift ? 'calc(100vw - 300px)' : '100vw')};
  display: grid;
  justify-items: center;
  align-items: center;
  transition: 0.5s;
`

export const Wrapper = styled.div`
  position: relative;
`

export const Canvas1 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`

export const Canvas2 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`

export const Thumbnails = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100px;
  display: grid;
  grid-template-columns: ${p => `repeat(${p.columns}, 110px)`};
  overflow-y: auto;
  border-top: ${p => p.theme.border};
  padding-top: 2px;
`

export const Thumbnail = styled.div.attrs(p => ({
  style: {
    background: p.selected ? lighten(0.4, p.theme.primary) : 'transparent',
    border: `1px solid ${p.selected ? p.theme.primary : 'transparent'}`
  }
}))`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: calc(100px * 9 / 16) 1fr;
  img {
    justify-self: center;
    width: 100px;
    height: calc(100px * 9 / 16);
  }
  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 1.1rem;
    .index {
      align-self: center;
      justify-self: center;
    }
    .time {
      align-self: center;
      justify-self: center;
      font-style: italic;
    }
  }
`

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const tabs = ['File', 'Home', 'Playback', 'Edit', 'Image']

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)
  const { gifFolder } = state

  const [images, setImages] = useState([])
  const [gifData, setGifData] = useState(null)
  const [menuIndex, setMenuIndex] = useState(0)
  const [scale, setScale] = useState(null)
  const [zoomToFit, setZoomToFit] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const [showDrawer, setShowDrawer] = useState(0)
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
    if (showDrawer === 1) {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
      ctx2.strokeStyle = borderColor

      if (borderLeft) {
        ctx2.beginPath()
        ctx2.lineWidth = borderLeft
        ctx2.moveTo(borderLeft / 2, 0)
        ctx2.lineTo(borderLeft / 2, canvas2.current.height)
        ctx2.stroke()
      }

      if (borderRight) {
        ctx2.beginPath()
        ctx2.lineWidth = borderRight
        ctx2.moveTo(canvas2.current.width - borderRight / 2, 0)
        ctx2.lineTo(
          canvas2.current.width - borderRight / 2,
          canvas2.current.height
        )
        ctx2.stroke()
      }

      if (borderTop) {
        ctx2.beginPath()
        ctx2.lineWidth = borderTop
        ctx2.moveTo(0, borderTop / 2)
        ctx2.lineTo(canvas2.current.width, borderTop / 2)
        ctx2.stroke()
      }

      if (borderBottom) {
        ctx2.beginPath()
        ctx2.lineWidth = borderBottom
        ctx2.moveTo(0, canvas2.current.height - borderBottom / 2)
        ctx2.lineTo(
          canvas2.current.width,
          canvas2.current.height - borderBottom / 2
        )
        ctx2.stroke()
      }
    } else {
      const ctx2 = canvas2.current.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    }
  }, [
    showDrawer,
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
    setShowDrawer(1)
    setScale(1)
  }

  function onBorderAccept() {
    const reader = new FileReader()

    reader.onload = () => {
      const buffer = Buffer.from(reader.result)
      writeFileAsync(images[imageIndex].path, buffer).then(() => {
        thumbnail.current.children[0].src =
          images[imageIndex].path + `#${new Date().getTime()}`
        setShowDrawer(0)
      })
    }

    const canvas3 = document.createElement('canvas')
    canvas3.width = gifData.width
    canvas3.height = gifData.height
    const ctx3 = canvas3.getContext('2d')
    const image = new Image()
    image.onload = () => {
      ctx3.drawImage(image, 0, 0)
      ctx3.strokeStyle = borderColor

      if (borderLeft) {
        ctx3.beginPath()
        ctx3.lineWidth = borderLeft
        ctx3.moveTo(borderLeft / 2, 0)
        ctx3.lineTo(borderLeft / 2, canvas3.height)
        ctx3.stroke()
      }

      if (borderRight) {
        ctx3.beginPath()
        ctx3.lineWidth = borderRight
        ctx3.moveTo(canvas3.width - borderRight / 2, 0)
        ctx3.lineTo(canvas3.width - borderRight / 2, canvas3.height)
        ctx3.stroke()
      }

      if (borderTop) {
        ctx3.beginPath()
        ctx3.lineWidth = borderTop
        ctx3.moveTo(0, borderTop / 2)
        ctx3.lineTo(canvas3.width, borderTop / 2)
        ctx3.stroke()
      }

      if (borderBottom) {
        ctx3.beginPath()
        ctx3.lineWidth = borderBottom
        ctx3.moveTo(0, canvas3.height - borderBottom / 2)
        ctx3.lineTo(canvas3.width, canvas3.height - borderBottom / 2)
        ctx3.stroke()
      }
      canvas3.toBlob(blob => reader.readAsArrayBuffer(blob), IMAGE_TYPE)
    }
    image.src = images[imageIndex].path
  }

  function onBorderCancel() {
    const ctx2 = canvas2.current.getContext('2d')
    ctx2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    setShowDrawer(0)
    setScale(zoomToFit)
  }

  return (
    <Container ref={container}>
      <Toolbar>
        <Tabs>
          {tabs.map((el, i) => (
            <Tab
              key={i}
              selected={i === menuIndex}
              onClick={() => setMenuIndex(i)}
            >
              {el}
            </Tab>
          ))}
        </Tabs>
        {menuIndex === 0 ? (
          <FileTab>
            <div className='action' onClick={onSaveClick}>
              <Save />
              <div className='text'>Save As</div>
            </div>
            <div className='action'>
              <FolderOpen />
              <div className='text'>Recent Projects</div>
            </div>
          </FileTab>
        ) : menuIndex === 2 ? (
          <PlaybackTab>
            <div className='action' onClick={() => onPlaybackClick(0)}>
              <AngleDoubleLeft />
            </div>
            <div className='action' onClick={() => onPlaybackClick(1)}>
              <AngleLeft />
            </div>
            <div className='action' onClick={() => onPlaybackClick(2)}>
              <Play />
            </div>
            <div className='action' onClick={() => onPlaybackClick(3)}>
              <AngleRight />
            </div>
            <div className='action' onClick={() => onPlaybackClick(4)}>
              <AngleDoubleRight />
            </div>
          </PlaybackTab>
        ) : menuIndex === 4 ? (
          <ImageTab>
            <div className='action' onClick={onOpenBorderDrawer}>
              <BorderOuter />
              <div className='text'>Border</div>
            </div>
          </ImageTab>
        ) : (
          <div />
        )}
      </Toolbar>
      <Main ref={main} shift={showDrawer}>
        <Wrapper ref={wrapper}>
          <Canvas1 ref={canvas1} />
          <Canvas2 ref={canvas2} />
        </Wrapper>
      </Main>
      <Thumbnails columns={images.length}>
        {images.map((el, i) => (
          <Thumbnail
            key={i}
            ref={imageIndex === i ? thumbnail : null}
            selected={imageIndex === i}
            onClick={() => setImageIndex(i)}
          >
            <img src={el.path} />
            <div className='bottom'>
              <div className='index'>{i + 1}</div>
              <div className='time'>{el.time}ms</div>
            </div>
          </Thumbnail>
        ))}
      </Thumbnails>
      <Drawer width={300} show={!!showDrawer}>
        {showDrawer === 1 ? (
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
            onBorderAccept={onBorderAccept}
            onBorderCancel={onBorderCancel}
          />
        ) : null}
      </Drawer>
    </Container>
  )
}
