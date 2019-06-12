import React, { useRef } from 'react'
import { remote, shell } from 'electron'
import path from 'path'
import Svg from '../../Svg'
import Checkbox from '../../Shared/Checkbox'
import Select from '../../Shared/Select'
import NumberInput from '../../Shared/NumberInput'
import RangeInput from '../../Shared/RangeInput'
import Textarea from '../../Shared/Textarea'
import { Encoders, Encoder, RepeatCount, PathInput, Warning } from './styles'
import { Section, Property, Label, PostLabel } from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { drawerWidth }
} = config

export default function Gif({
  ffmpegPath,
  gifEncoder,
  gifFolderPath,
  gifFilename,
  gifOverwrite,
  gifOverwriteError,
  gifLooped,
  gifForever,
  gifLoops,
  gifOptimize,
  gifQuality,
  gifColors,
  setGifFolderPath,
  setGifFilename,
  setGifOverwrite,
  setGifEncoder,
  setGifLooped,
  setGifForever,
  setGifLoops,
  setGifOptimize,
  setGifQuality,
  setGifColors
}) {
  const textarea = useRef(null)

  function onGifQualityChange(values) {
    setGifQuality(values[0])
  }

  function onInputChange({ target: { name, value } }) {
    if (name === 'gifFolderPath') {
      setGifFolderPath(value)
    } else if (name === 'gifFilename') {
      setGifFilename(value)
    }
  }

  function onGifFolderClick() {
    const win = remote.getCurrentWindow()
    const opts = {
      title: 'Save As',
      defaultPath: remote.app.getPath('desktop'),
      buttonLabel: 'Save',
      filters: [
        {
          name: 'GIF Animation',
          extensions: ['gif']
        }
      ]
    }
    const callback = filepath => {
      if (filepath) {
        const folder = path.dirname(filepath)
        const file = path.basename(filepath).slice(0, -4)
        setGifFolderPath(folder)
        setGifFilename(file)
      }
    }
    remote.dialog.showSaveDialog(win, opts, callback)
  }

  function onPlusMinusClick(button) {
    const re = /\((-?\d+)\)(?!.*\(-?\d+\))/g
    if (!gifFilename) {
      setGifFilename('Animation')
      return
    }
    if (re.test(gifFilename)) {
      const filename = gifFilename.replace(re, (match, val) => {
        const x = button === 'plus' ? Number(val) + 1 : Number(val) - 1
        return `(${x})`
      })
      setGifFilename(filename)
    } else {
      setGifFilename(gifFilename + ' (0)')
    }
  }

  function onShowOverwriteFile() {
    const filepath = path.join(gifFolderPath, gifFilename + '.gif')
    shell.openExternal(filepath)
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
            <Encoder selected={gifEncoder === '2.0'} onClick={() => setGifEncoder('2.0')}>
              2.0
            </Encoder>
            <div className='divider' />
            <Encoder selected={gifEncoder === '1.0'} onClick={() => setGifEncoder('1.0')}>
              1.0
            </Encoder>
            <div className='divider' />
            <Encoder
              selected={gifEncoder === 'ffmpeg'}
              onClick={() => !!ffmpegPath && setGifEncoder('ffmpeg')}
            >
              FFmpeg
            </Encoder>
          </Encoders>
        </div>
      </Section>
      {gifEncoder === '2.0' ? (
        <Section height={170}>
          <div className='title'>
            <div className='text'>Gif options</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={50}>Colors:</Label>
              <NumberInput
                width={70}
                value={gifColors}
                max={256}
                min={32}
                fallback={256}
                setter={setGifColors}
              />
            </Property>
            <Checkbox
              value={gifLooped}
              primary='Looped Gif.'
              style={{ marginLeft: '10px' }}
              onClick={() => setGifLooped(!gifLooped)}
            />
            {gifLooped && (
              <>
                <Checkbox
                  value={gifForever}
                  primary='Repeat Forever.'
                  style={{ marginLeft: '20px' }}
                  onClick={() => setGifForever(!gifForever)}
                />
                <RepeatCount>
                  <NumberInput
                    width={60}
                    value={gifLoops}
                    max={100}
                    min={2}
                    fallback={2}
                    setter={setGifLoops}
                  />
                  <PostLabel>Repeat Count.</PostLabel>
                </RepeatCount>
              </>
            )}
            <Checkbox
              value={gifOptimize}
              primary='Detect unchanged pixels'
              style={{ marginLeft: '10px' }}
              onClick={() => setGifOptimize(!gifOptimize)}
            />
          </div>
        </Section>
      ) : gifEncoder === '1.0' ? (
        <Section height={180}>
          <div className='title'>
            <div className='text'>Gif options</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={50}>Quality:</Label>
              <RangeInput
                domain={[1, 30]}
                values={[gifQuality]}
                tickCount={30}
                onChange={onGifQualityChange}
              />
            </Property>
            <Checkbox
              value={gifLooped}
              primary='Looped Gif.'
              style={{ marginLeft: '10px' }}
              onClick={() => setGifLooped(!gifLooped)}
            />
            {gifLooped && (
              <>
                <Checkbox
                  value={gifForever}
                  primary='Repeat Forever.'
                  style={{ marginLeft: '20px' }}
                  onClick={() => setGifForever(!gifForever)}
                />
                <RepeatCount>
                  <NumberInput
                    width={60}
                    value={gifLoops}
                    max={100}
                    min={2}
                    fallback={2}
                    setter={setGifLoops}
                  />
                  <PostLabel>Repeat Count.</PostLabel>
                </RepeatCount>
              </>
            )}
            <Checkbox
              value={gifOptimize}
              primary='Detect unchanged pixels.'
              style={{ marginLeft: '10px' }}
              onClick={() => setGifOptimize(!gifOptimize)}
            />
          </div>
        </Section>
      ) : gifEncoder === 'ffmpeg' ? (
        <Section height={100}>
          <div className='title'>
            <div className='text'>Gif options</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={30}>Extras:</Label>
              <Textarea
                width={drawerWidth - 70}
                textarea={textarea}
                readOnly={true}
                value='-lavfi palettegen=stats_mode=diff[pal],[0:v][pal]paletteuse=new=1:diff_mode=rectangle'
                onChange={() => {}}
              />
            </Property>
          </div>
        </Section>
      ) : (
        <div />
      )}
      <Section height={70}>
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
            value={gifOverwrite}
            primary='Overwrite (if already exists).'
            style={{ marginLeft: '20px' }}
            onClick={() => setGifOverwrite(!gifOverwrite)}
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
                name='gifFolderPath'
                value={gifFolderPath}
                onChange={onInputChange}
                spellCheck={false}
              />
              <div className='action' onClick={onGifFolderClick}>
                <Svg name='folder' />
              </div>
            </div>
            <div className='bottom'>
              <input
                type='text'
                name='gifFilename'
                value={gifFilename}
                onChange={onInputChange}
                spellCheck={false}
              />
              <Select width={50} value='.gif' options={['.gif']} onClick={() => {}} />
              <div className='action' onClick={() => onPlusMinusClick('plus')}>
                <Svg name='insert' />
              </div>
              <div className='action' onClick={() => onPlusMinusClick('minus')}>
                <Svg name='minus' />
              </div>
            </div>
          </PathInput>
          {gifOverwriteError && (
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
