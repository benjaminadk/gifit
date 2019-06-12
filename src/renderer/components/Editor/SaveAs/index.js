import React, { useRef } from 'react'
import { remote, shell } from 'electron'
import path from 'path'
import Svg from '../../Svg'
import Choice from '../../Shared/Choice'
import Checkbox from '../../Shared/Checkbox'
import Select from '../../Shared/Select'
import NumberInput from '../../Shared/NumberInput'
import RangeInput from '../../Shared/RangeInput'
import Textarea from '../../Shared/Textarea'
import { Encoders, Encoder, RepeatCount, PathInput, Warning } from './styles'
import Gif from './Gif'
import Images from './Images'
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
import config from 'common/config'

const {
  editor: { drawerWidth }
} = config

export default function SaveAs({
  drawerHeight,
  ffmpegPath,
  saveMode,
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
  imagesFolderPath,
  imagesFilename,
  imagesZip,
  imagesOverwrite,
  imagesOverwriteError,
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
  setImagesFolderPath,
  setImagesFilename,
  setImagesZip,
  setImagesOverwrite,
  onAccept,
  onCancel
}) {
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
        {saveMode === 'gif' ? (
          <Gif
            ffmpegPath={ffmpegPath}
            gifEncoder={gifEncoder}
            gifFolderPath={gifFolderPath}
            gifFilename={gifFilename}
            gifOverwrite={gifOverwrite}
            gifOverwriteError={gifOverwriteError}
            gifLooped={gifLooped}
            gifForever={gifForever}
            gifLoops={gifLoops}
            gifOptimize={gifOptimize}
            gifQuality={gifQuality}
            gifColors={gifColors}
            setGifEncoder={setGifEncoder}
            setGifFolderPath={setGifFolderPath}
            setGifFilename={setGifFilename}
            setGifOverwrite={setGifOverwrite}
            setGifLooped={setGifLooped}
            setGifForever={setGifForever}
            setGifLoops={setGifLoops}
            setGifOptimize={setGifOptimize}
            setGifQuality={setGifQuality}
            setGifColors={setGifColors}
          />
        ) : saveMode === 'images' ? (
          <Images
            imagesFolderPath={imagesFolderPath}
            imagesFilename={imagesFilename}
            imagesZip={imagesZip}
            imagesOverwrite={imagesOverwrite}
            imagesOverwriteError={imagesOverwriteError}
            setImagesFolderPath={setImagesFolderPath}
            setImagesFilename={setImagesFilename}
            setImagesZip={setImagesZip}
            setImagesOverwrite={setImagesOverwrite}
          />
        ) : null}
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
