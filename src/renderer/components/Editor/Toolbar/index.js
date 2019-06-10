import React, { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown } from 'styled-icons/boxicons-regular/ChevronDown'
import NumberInput from '../../Shared/NumberInput'
import Svg from '../../Svg'
import Extras from './Extras'
import {
  Container,
  Tabs,
  Tab,
  Menu,
  Collapse,
  Section,
  SectionText,
  Shortcut,
  GenericGrid,
  Action,
  Zoom,
  ZoomInput,
  General,
  Statistic
} from './styles'

const tabs = [
  { icon: <Svg name='save' />, text: 'File' },
  { icon: <Svg name='editor' />, text: 'Home' },
  { icon: <Svg name='play' />, text: 'Playback' },
  { icon: <Svg name='pen' />, text: 'Edit' },
  { icon: <Svg name='image' />, text: 'Image' },
  { icon: <Svg name='fade' />, text: 'Transitions' },
  { icon: <Svg name='info' />, text: 'Statistics' }
]

const playback = [
  { icon: <Svg name='arrow-start' />, text: 'First' },
  { icon: <Svg name='arrow-prev' />, text: 'Previous' },
  { icon1: <Svg name='play' />, text1: 'Play', icon2: <Svg name='pause' />, text2: 'Pause' },
  { icon: <Svg name='arrow-next' />, text: 'Next' },
  { icon: <Svg name='arrow-end' />, text: 'Last' }
]

export default function Toolbar({
  showToolbar,
  totalFrames,
  totalDuration,
  averageDuration,
  gifData,
  scale,
  zoomToFit,
  playing,
  setShowToolbar,
  setScale,
  onOpenDrawer,
  onNewRecordingClick,
  onNewWebcamClick,
  onNewBoardClick,
  onSaveClick,
  onDiscardProjectClick,
  onCutClick,
  onCopyClick,
  onPasteClick,
  onPlaybackClick,
  onFrameDeleteClick,
  onReverseClick,
  onYoyoClick,
  onMoveFrameLeft,
  onMoveFrameRight,
  onOptionsClick,
  onSelectClick
}) {
  const [menuIndex, setMenuIndex] = useState(0)

  function onZoomChange(x) {
    setScale(x / 100)
  }

  return (
    <Container show={showToolbar}>
      <Tabs onClick={() => setShowToolbar(true)}>
        {tabs.map((el, i) => (
          <Tab key={i} selected={showToolbar && i === menuIndex} onClick={() => setMenuIndex(i)}>
            {el.icon}
            <div className='text'>{el.text}</div>
            <div className='divider' />
          </Tab>
        ))}
        <div />
        <Extras onOptionsClick={onOptionsClick} />
      </Tabs>
      <Menu show={showToolbar}>
        <Collapse onClick={() => setShowToolbar(false)}>
          <ChevronDown />
        </Collapse>
        {menuIndex === 0 ? (
          <>
            <Section width={225}>
              <GenericGrid columns={3}>
                <Action onClick={onNewRecordingClick}>
                  <Svg name='record-new' />
                  <div className='text'>Recording</div>
                </Action>
                <Action onClick={onNewWebcamClick}>
                  <Svg name='camera-new' />
                  <div className='text'>Webcam</div>
                </Action>
                <Action onClick={onNewBoardClick}>
                  <Svg name='board-new' />
                  <div className='text'>Board</div>
                </Action>
              </GenericGrid>
              <SectionText>New</SectionText>
            </Section>
            <Section width={300}>
              <GenericGrid columns={4}>
                <Action onClick={onSaveClick}>
                  <Svg name='save' />
                  <div className='text'>Save</div>
                </Action>
                <Action onClick={() => onOpenDrawer('save')}>
                  <Svg name='save' />
                  <div className='text'>Save As</div>
                </Action>
                <Action onClick={() => onOpenDrawer('recent')}>
                  <Svg name='recent' />
                  <div className='text'>Recent Projects</div>
                </Action>
                <Action onClick={onDiscardProjectClick}>
                  <Svg name='close' />
                  <div className='text'>Discard Project</div>
                </Action>
              </GenericGrid>
              <SectionText>File</SectionText>
            </Section>
          </>
        ) : menuIndex === 1 ? (
          <>
            <Section width={225}>
              <GenericGrid columns={3}>
                <Action onClick={onCutClick}>
                  <Svg name='cut' />
                  <div className='text'>Cut</div>
                </Action>
                <Action onClick={onCopyClick}>
                  <Svg name='copy' />
                  <div className='text'>Copy</div>
                </Action>
                <Action onClick={onPasteClick}>
                  <Svg name='paste' />
                  <div className='text'>Paste</div>
                </Action>
              </GenericGrid>
              <SectionText>Clipboard</SectionText>
              <Shortcut onClick={() => onOpenDrawer('clipboard')}>
                <Svg name='shortcut' />
              </Shortcut>
            </Section>
            <Section width={300}>
              <Zoom>
                <Action onClick={() => setScale(1)}>
                  <Svg name='zoom-100' />
                  <div className='text'>100%</div>
                </Action>
                <Action onClick={() => setScale(zoomToFit)}>
                  <Svg name='zoom-fit' />
                  <div className='text'>Fit Image</div>
                </Action>
                <ZoomInput>
                  <Svg name='search' />
                  <NumberInput
                    width={80}
                    value={Math.round(scale * 100)}
                    min={10}
                    max={500}
                    fallback={100}
                    setter={onZoomChange}
                  />
                  <div className='text'>%</div>
                </ZoomInput>
              </Zoom>
              <SectionText>Zoom</SectionText>
            </Section>
            <Section width={300}>
              <GenericGrid columns={3}>
                <Action onClick={() => onSelectClick(0)}>
                  <Svg name='cursor' />
                  <div className='text'>Select All</div>
                </Action>
                <Action onClick={() => onSelectClick(1)}>
                  <Svg name='inverse' />
                  <div className='text'>Inverse</div>
                </Action>
                <Action onClick={() => onSelectClick(2)}>
                  <Svg name='deselect' />
                  <div className='text'>Deselect</div>
                </Action>
              </GenericGrid>
              <SectionText>Select</SectionText>
            </Section>
          </>
        ) : menuIndex === 2 ? (
          <>
            <Section width={375}>
              <GenericGrid columns={5}>
                {playback.map((el, i) => (
                  <Action key={i} onClick={() => onPlaybackClick(i)}>
                    {i !== 2 ? el.icon : playing ? el.icon2 : el.icon1}
                    <div className='text'>{i !== 2 ? el.text : playing ? el.text2 : el.text1}</div>
                  </Action>
                ))}
              </GenericGrid>
              <SectionText>Playback</SectionText>
            </Section>
          </>
        ) : menuIndex === 3 ? (
          <>
            <Section width={375}>
              <GenericGrid columns={5}>
                <Action onClick={() => onFrameDeleteClick('selection')}>
                  <Svg name='delete' />
                  <div className='text'>Delete</div>
                </Action>
                <Action onClick={() => onOpenDrawer('duplicate')}>
                  <Svg name='delete' />
                  <div className='text'>Remove Duplicates</div>
                </Action>
                <Action onClick={() => onOpenDrawer('reduce')}>
                  <Svg name='delete' />
                  <div className='text'>Reduce Frames</div>
                </Action>
                <Action onClick={() => onFrameDeleteClick('previous')}>
                  <Svg name='delete-prev' />
                  <div className='text'>Delete All Previous</div>
                </Action>
                <Action onClick={() => onFrameDeleteClick('next')}>
                  <Svg name='delete-next' />
                  <div className='text'>Delete All Next</div>
                </Action>
              </GenericGrid>
              <SectionText>Frames</SectionText>
            </Section>
            <Section width={300}>
              <GenericGrid columns={4}>
                <Action onClick={onReverseClick}>
                  <Svg name='reverse' />
                  <div className='text'>Reverse</div>
                </Action>
                <Action onClick={onYoyoClick}>
                  <Svg name='yoyo' />
                  <div className='text'>Yoyo</div>
                </Action>
                <Action onClick={onMoveFrameLeft}>
                  <Svg name='move-left' />
                  <div className='text'>Move Left</div>
                </Action>
                <Action onClick={onMoveFrameRight}>
                  <Svg name='move-right' />
                  <div className='text'>Move Right</div>
                </Action>
              </GenericGrid>
              <SectionText>Reordering</SectionText>
            </Section>
            <Section width={225}>
              <GenericGrid columns={3}>
                <Action onClick={() => onOpenDrawer('override')}>
                  <Svg name='clock-override' />
                  <div className='text'>Override</div>
                </Action>
                <Action onClick={() => onOpenDrawer('increase')}>
                  <Svg name='clock-increase' />
                  <div className='text'>Increase or Decrease</div>
                </Action>
              </GenericGrid>
              <SectionText>Delay (Duration)</SectionText>
            </Section>
          </>
        ) : menuIndex === 4 ? (
          <>
            <Section width={225}>
              <GenericGrid columns={3}>
                <Action onClick={() => onOpenDrawer('resize')}>
                  <Svg name='scale' />
                  <div className='text'>Resize</div>
                </Action>
                <Action onClick={() => onOpenDrawer('crop')}>
                  <Svg name='crop' />
                  <div className='text'>Crop</div>
                </Action>
                <Action onClick={() => onOpenDrawer('flip')}>
                  <Svg name='flip-h' />
                  <div className='text'>Flip/Rotate</div>
                </Action>
              </GenericGrid>
              <SectionText>Size and Rotation</SectionText>
            </Section>
            <Section width={225}>
              <GenericGrid columns={3}>
                <Action onClick={() => onOpenDrawer('title')}>
                  <Svg name='title-frame' />
                  <div className='text'>Title Frame</div>
                </Action>
                <Action onClick={() => onOpenDrawer('keyboard')}>
                  <Svg name='keyboard' />
                  <div className='text'>Key Strokes</div>
                </Action>
                <Action onClick={() => onOpenDrawer('text')}>
                  <Svg name='text' />
                  <div className='text'>Free Text</div>
                </Action>
              </GenericGrid>
              <SectionText>Text</SectionText>
            </Section>
            <Section width={525}>
              <GenericGrid columns={7}>
                <Action onClick={() => onOpenDrawer('drawing')}>
                  <Svg name='draw' />
                  <div className='text'>Free Drawing</div>
                </Action>
                <Action onClick={() => onOpenDrawer('shape')}>
                  <Svg name='shape' />
                  <div className='text'>Shape</div>
                </Action>
                <Action onClick={() => onOpenDrawer('progress')}>
                  <Svg name='progress' />
                  <div className='text'>Progress</div>
                </Action>
                <Action onClick={() => onOpenDrawer('clicks')}>
                  <Svg name='cursor' />
                  <div className='text'>Mouse Clicks</div>
                </Action>
                <Action onClick={() => onOpenDrawer('border')}>
                  <Svg name='border' />
                  <div className='text'>Border</div>
                </Action>
                <Action onClick={() => onOpenDrawer('obfuscate')}>
                  <Svg name='obfuscate' />
                  <div className='text'>Obfuscate</div>
                </Action>
                <Action onClick={() => onOpenDrawer('watermark')}>
                  <Svg name='watermark' />
                  <div className='text'>Watermark</div>
                </Action>
              </GenericGrid>
              <SectionText>Overlay</SectionText>
            </Section>
          </>
        ) : menuIndex === 5 && gifData ? (
          <>
            <Section width={150}>
              <GenericGrid columns={2}>
                <Action onClick={() => onOpenDrawer('fade')}>
                  <Svg name='fade' />
                  <div className='text'>Fade</div>
                </Action>
                <Action onClick={() => onOpenDrawer('slide')}>
                  <Svg name='slide' />
                  <div className='text'>Slide</div>
                </Action>
              </GenericGrid>
              <SectionText>Styles</SectionText>
            </Section>
          </>
        ) : menuIndex === 6 && gifData ? (
          <>
            <Section width={450}>
              <General>
                <Statistic>
                  <div className='top'>
                    <Svg name='count' />
                    <div>Frame count</div>
                  </div>
                  <div className='bottom'>{totalFrames}</div>
                </Statistic>
                <Statistic>
                  <div className='top'>
                    <Svg name='size' />
                    <div>Frame size</div>
                  </div>
                  <div className='bottom'>{gifData.width + ' x ' + gifData.height}</div>
                </Statistic>
                <Statistic>
                  <div className='top'>
                    <Svg name='clock' />
                    <div>Total duration</div>
                  </div>
                  <div className='bottom'>{format(new Date(totalDuration), 'mm:ss.SS')} m</div>
                </Statistic>
                <Statistic>
                  <div className='top'>
                    <Svg name='clock-average' />
                    <div>Average duration</div>
                  </div>
                  <div className='bottom'>{averageDuration} ms</div>
                </Statistic>
              </General>
              <SectionText>General</SectionText>
            </Section>
          </>
        ) : (
          <div />
        )}
      </Menu>
    </Container>
  )
}
