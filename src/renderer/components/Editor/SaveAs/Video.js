import React, { useRef } from 'react'
import { remote } from 'electron'
import path from 'path'
import Svg from '../../Svg'
import Checkbox from '../../Shared/Checkbox'
import Select from '../../Shared/Select'
import Textarea from '../../Shared/Textarea'
import { Encoders, Encoder, PathInput, Warning } from './styles'
import { Section, Property, Label } from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { drawerWidth }
} = config

export default function Video({
  ffmpegPath,
  videoEncoder,
  videoFolderPath,
  videoFilename,
  videoExtension,
  videoOverwrite,
  videoOverwriteError,
  setVideoEncoder,
  setVideoFolderPath,
  setVideoFilename,
  setVideoExtension,
  setVideoOverwrite
}) {
  const textarea = useRef(null)

  function onInputChange({ target: { name, value } }) {
    if (name === 'videoFolderPath') {
      setVideoFolderPath(value)
    } else if (name === 'videoFilename') {
      setVideoFilename(value)
    }
  }

  function onVideoFolderClick() {
    const win = remote.getCurrentWindow()
    const filters =
      videoExtension === '.webm'
        ? [
            {
              name: 'WebM Video',
              extensions: ['webm']
            }
          ]
        : [
            {
              name: 'MP4 Video',
              extensions: ['mp4']
            }
          ]
    const opts = {
      title: 'Save As',
      defaultPath: remote.app.getPath('desktop'),
      buttonLabel: 'Save',
      filters
    }
    const callback = filepath => {
      if (filepath) {
        const folder = path.dirname(filepath)
        const file = path.basename(filepath).slice(0, videoExtension === '.webm' ? -5 : -4)
        setVideoFolderPath(folder)
        setVideoFilename(file)
      }
    }
    remote.dialog.showSaveDialog(win, opts, callback)
  }

  function onPlusMinusClick(button) {
    const re = /\((-?\d+)\)(?!.*\(-?\d+\))/g
    if (!videoFilename) {
      setVideoFilename('Animation')
      return
    }
    if (re.test(videoFilename)) {
      const filename = videoFilename.replace(re, (match, val) => {
        const x = button === 'plus' ? Number(val) + 1 : Number(val) - 1
        return `(${x})`
      })
      setVideoFilename(filename)
    } else {
      setVideoFilename(videoFilename + ' (0)')
    }
  }

  function onShowOverwriteFile() {
    const filepath = path.join(videoFolderPath, videoFilename + videoExtension)
    shell.openExternal(filepath)
  }

  function onVideoExtensionSelect(x) {
    if (videoEncoder === 'system') {
      return
    } else {
      setVideoExtension(x)
    }
  }

  return (
    <>
      <Section height={50}>
        <div className='title'>
          <div className='text'>Encoder</div>
          <div className='divider' />
        </div>
        <div>
          <Encoders>
            <Encoder selected={videoEncoder === 'system'} onClick={() => setVideoEncoder('system')}>
              System
            </Encoder>
            <div className='divider' />
            <Encoder
              selected={videoEncoder === 'ffmpeg'}
              onClick={() => !!ffmpegPath && setVideoEncoder('ffmpeg')}
            >
              FFmpeg
            </Encoder>
          </Encoders>
        </div>
      </Section>
      {videoEncoder === 'ffmpeg' && (
        <Section height={100}>
          <div className='title'>
            <div className='text'>Video options</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={30}>Extras:</Label>
              <Textarea
                width={drawerWidth - 70}
                textarea={textarea}
                readOnly={true}
                value='-c:v libx264 -pix_fmt yuv420p -vf "pad=width={W}:height={H}:x=0:y=0:color=black"'
                onChange={() => {}}
              />
            </Property>
          </div>
        </Section>
      )}
      <Section height={80}>
        <div className='title'>
          <div className='text'>Save options</div>
          <div className='divider' />
        </div>
        <div>
          <Checkbox
            value={true}
            primary='Save to a folder of your choice.'
            style={{ marginLeft: '10px' }}
          />
          <Checkbox
            value={videoOverwrite}
            primary='Overwrite (if already exists).'
            style={{ marginLeft: '20px' }}
            onClick={() => setVideoOverwrite(!videoOverwrite)}
          />
        </div>
      </Section>
      <Section height={100}>
        <div className='title'>
          <div className='text'>File</div>
          <div className='divider' />
        </div>
        <div>
          <PathInput>
            <div className='top'>
              <input
                type='text'
                name='videoFolderPath'
                value={videoFolderPath}
                onChange={onInputChange}
                spellCheck={false}
              />
              <div className='action' onClick={onVideoFolderClick}>
                <Svg name='folder' />
              </div>
            </div>
            <div className='bottom'>
              <input
                type='text'
                name='videoFilename'
                value={videoFilename}
                onChange={onInputChange}
                spellCheck={false}
              />
              <Select
                width={60}
                value={videoEncoder === 'system' ? '.webm' : videoExtension}
                options={videoEncoder === 'system' ? ['.webm'] : ['.webm', '.mp4']}
                onClick={onVideoExtensionSelect}
              />
              <div className='action' onClick={() => onPlusMinusClick('plus')}>
                <Svg name='insert' />
              </div>
              <div className='action' onClick={() => onPlusMinusClick('minus')}>
                <Svg name='minus' />
              </div>
            </div>
          </PathInput>
          {videoOverwriteError && (
            <Warning onClick={onShowOverwriteFile}>
              <Svg name='warning' />
              <div className='text'>A file with the same name already exists.</div>
            </Warning>
          )}
        </div>
      </Section>
    </>
  )
}
