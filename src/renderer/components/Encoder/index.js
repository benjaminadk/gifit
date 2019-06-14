import React, { useEffect, useState } from 'react'
import { remote, shell, ipcRenderer } from 'electron'
import { List } from 'immutable'
import path from 'path'
import encodeOctree from './encodeOctree'
import encodeNeuQuant from './encodeNeuQuant'
import encodeFFmpeg from './encodeFFmpeg'
import Svg from '../Svg'
import { RECORDINGS_DIRECTORY } from 'common/filepaths'
import config from 'common/config'
import { Container, Item, ProgressItem, BarWrapper, Bar } from './styles'

const {
  ipcActions: { ENCODER_READY, ENCODER_DATA }
} = config

export default function Encoder() {
  const [output, setOutput] = useState(List([]))

  useEffect(() => {
    ipcRenderer.send(ENCODER_READY, true)
  }, [])

  useEffect(() => {
    async function onEncoderData(e, encoderData) {
      remote.getCurrentWindow().focus()

      const {
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
      } = encoderData

      var repeat = !gifLooped ? 1 : gifForever ? 0 : gifLoops

      if (gifEncoder === '2.0') {
        await encodeOctree(images, filepath, gifData, gifOptimize, repeat, gifColors, setOutput)
      } else if (gifEncoder === '1.0') {
        await encodeNeuQuant(images, filepath, gifData, gifOptimize, repeat, gifQuality, setOutput)
      } else if (gifEncoder === 'ffmpeg' && ffmpegPath) {
        const cwd = path.join(RECORDINGS_DIRECTORY, gifData.relative)
        await encodeFFmpeg(images, filepath, cwd, ffmpegPath, setOutput)
      }
    }

    ipcRenderer.on(ENCODER_DATA, onEncoderData)

    return () => {
      ipcRenderer.removeListener(ENCODER_DATA, onEncoderData)
    }
  }, [output])

  function onEraseAll() {
    setOutput(List([]))
  }

  function onImageClick(filepath) {
    shell.openItem(filepath)
  }

  function onFolderClick(filepath) {
    shell.showItemInFolder(filepath)
  }

  return (
    <Container>
      <div className='header'>
        <div className='icon'>
          <Svg name='copy' />
        </div>
        <div>Encoder</div>
        <div className='action' onClick={onEraseAll}>
          <Svg name='eraser' />
        </div>
      </div>
      <div className='content'>
        {output.map((el, i) => {
          if (el.get('done')) {
            return (
              <Item key={i}>
                <div className='action'>
                  <Svg name='check-green' />
                </div>
                <div className='size'>{el.get('size')}</div>
                <div className='completed'>Completed</div>
                <div className='action' onClick={() => onImageClick(el.get('filepath'))}>
                  <Svg name='object' />
                </div>
                <div className='action' onClick={() => onFolderClick(el.get('filepath'))}>
                  <Svg name='folder' />
                </div>
              </Item>
            )
          } else {
            return (
              <ProgressItem key={i}>
                <Svg name='object' />
                <div className='percent'>{el.get('progress')}%</div>
                <div className='right'>
                  <div>Encoding images to GIF...</div>
                  <div className='bar'>
                    <BarWrapper>
                      <Bar progress={el.get('progress')} />
                    </BarWrapper>
                  </div>
                </div>
              </ProgressItem>
            )
          }
        })}
      </div>
    </Container>
  )
}
