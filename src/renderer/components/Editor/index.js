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
import { lighten } from 'polished'
import { List } from 'immutable'
import path from 'path'
import { readFile } from 'fs'
import { promisify } from 'util'
import { spawn } from 'child_process'
import createRandomString from '../../lib/createRandomString'
import { AppContext } from '../App'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 100px 1fr calc(calc(100px * 9 / 16) + 40px);
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

export const File = styled.div`
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

export const Playback = styled.div`
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

export const Main = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
`

export const Wrapper = styled.div`
  position: relative;
`

export const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`

export const Thumbnails = styled.div`
  width: 100vw;
  height: 100%;
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

const tabs = ['File', 'Home', 'Playback', 'Edit', 'Image']

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)
  const { gifFolder } = state

  const [images, setImages] = useState([])
  const [gifData, setGifData] = useState(null)
  const [menuIndex, setMenuIndex] = useState(0)
  const [scale, setScale] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const main = useRef(null)
  const wrapper = useRef(null)
  const canvas = useRef(null)
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
      const { clientHeight } = main.current
      const heightRatio =
        Math.round((clientHeight / project.height) * 100) / 100
      setScale(heightRatio < 1 ? heightRatio : 1)
    }

    initialize()
  }, [])

  useEffect(() => {
    if (images.length && scale) {
      wrapper.current.style.width = gifData.width * scale + 'px'
      wrapper.current.style.height = gifData.height * scale + 'px'
      canvas.current.width = gifData.width * scale
      canvas.current.height = gifData.height * scale

      const ctx = canvas.current.getContext('2d')
      const image = new Image()
      image.onload = () => {
        ctx.scale(scale, scale)
        ctx.drawImage(image, 0, 0)
      }
      image.src = images[imageIndex].path
    }
  }, [images, imageIndex, scale])

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

  return (
    <Container>
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
          <File>
            <div className='action' onClick={onSaveClick}>
              <Save />
              <div className='text'>Save As</div>
            </div>
            <div className='action'>
              <FolderOpen />
              <div className='text'>Recent Projects</div>
            </div>
          </File>
        ) : menuIndex === 2 ? (
          <Playback>
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
          </Playback>
        ) : (
          <div />
        )}
      </Toolbar>
      <Main ref={main}>
        <Wrapper ref={wrapper}>
          <Canvas ref={canvas} />
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
    </Container>
  )
}
