import React from 'react'
import { remote } from 'electron'
import path from 'path'
import Svg from '../../Svg'
import Choice from '../../Shared/Choice'
import Checkbox from '../../Shared/Checkbox'
import Select from '../../Shared/Select'
import NumberInput from '../../Shared/NumberInput'
import RangeInput from '../../Shared/RangeInput'
import { Encoders, Encoder, RepeatCount, PathInput } from './styles'
import {
  Header,
  Main,
  Section,
  ChoiceRow,
  Property,
  Label,
  Footer,
  Button,
  PostLabel
} from '../Drawer/styles'

export default function SaveAs({
  drawerHeight,
  ffmpegPath,
  saveMode,
  gifEncoder,
  gifFolderPath,
  gifFilename,
  gifOverwrite,
  gifLooped,
  gifForever,
  gifLoops,
  gifOptimize,
  gifQuality,
  gifColors,
  setSaveMode,
  setGifFolderPath,
  setGifFilename,
  setGifOverwrite,
  setGifEncoder,
  setGifLooped,
  setGifForever,
  setGifLoops,
  setGifOptimize,
  setGifQuality,
  setGifColors,
  onAccept,
  onCancel
}) {
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
        const file = path.basename(filepath)
        setGifFolderPath(folder)
        setGifFilename(file)
      }
    }
    remote.dialog.showSaveDialog(win, opts, callback)
  }

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='save' />
          <div className='text'>Save As</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={90}>
          <div className='title'>
            <div className='text'>File type</div>
            <div className='divider' />
          </div>
          <div>
            <ChoiceRow>
              <Choice
                selected={saveMode === 'gif'}
                icon={<Svg name='object' />}
                label='Gif'
                onClick={() => setSaveMode('gif')}
              />
              <Choice
                selected={saveMode === 'video'}
                icon={<Svg name='image' />}
                label='Video'
                onClick={() => setSaveMode('video')}
              />
            </ChoiceRow>
            <ChoiceRow>
              <Choice
                selected={saveMode === 'images'}
                icon={<Svg name='image' />}
                label='Images'
                onClick={() => setSaveMode('images')}
              />
              <Choice
                selected={saveMode === 'project'}
                icon={<Svg name='image' />}
                label='Project'
                onClick={() => setSaveMode('project')}
              />
            </ChoiceRow>
          </div>
        </Section>
        {saveMode === 'gif' && (
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
              <Section height={180}>
                <div className='title'>
                  <div className='text'>Gif options</div>
                  <div className='divider' />
                </div>
                <div>ffmpeg</div>
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
                    <div className='action'>
                      <Svg name='insert' />
                    </div>
                    <div className='action'>
                      <Svg name='insert' />
                    </div>
                  </div>
                </PathInput>
              </div>
            </Section>
          </>
        )}
      </Main>
      <Footer>
        <Button width={115} onClick={onAccept}>
          <Svg name='save' />
          <div className='text'>Save</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Svg name='cancel' />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}
