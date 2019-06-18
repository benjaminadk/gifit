import React from 'react'
import Svg from '../../Svg'
import Choice from '../../Shared/Choice'
import Gif from './Gif'
import Images from './Images'
import Project from './Project'
import { Header, Main, Section, ChoiceRow, Footer, Button } from '../Drawer/styles'

export default function SaveAs({
  drawerHeight,
  ffmpegPath,
  saveMode,
  gifEncoder,
  gifFolderPath,
  gifFilename,
  gifOverwrite,
  gifOverwriteError,
  gifUpload,
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
  saveProjectFolderPath,
  saveProjectFilename,
  saveProjectOverwrite,
  saveProjectOverwriteError,
  setSaveMode,
  setGifFolderPath,
  setGifFilename,
  setGifOverwrite,
  setGifUpload,
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
  setSaveProjectFolderPath,
  setSaveProjectFilename,
  setSaveProjectOverwrite,
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
                icon={<Svg name='recent' />}
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
            gifUpload={gifUpload}
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
            setGifUpload={setGifUpload}
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
        ) : saveMode === 'project' ? (
          <Project
            saveProjectFolderPath={saveProjectFolderPath}
            saveProjectFilename={saveProjectFilename}
            saveProjectOverwrite={saveProjectOverwrite}
            saveProjectOverwriteError={saveProjectOverwriteError}
            setSaveProjectFolderPath={setSaveProjectFolderPath}
            setSaveProjectFilename={setSaveProjectFilename}
            setSaveProjectOverwrite={setSaveProjectOverwrite}
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
