import React, { useState } from 'react'
import { format } from 'date-fns'
import { AngleDoubleLeft } from 'styled-icons/fa-solid/AngleDoubleLeft'
import { AngleLeft } from 'styled-icons/fa-solid/AngleLeft'
import { AngleDoubleRight } from 'styled-icons/fa-solid/AngleDoubleRight'
import { AngleRight } from 'styled-icons/fa-solid/AngleRight'
import { PlayArrow } from 'styled-icons/material/PlayArrow'
import { Pause } from 'styled-icons/material/Pause'
import { Save } from 'styled-icons/fa-solid/Save'
import { Home } from 'styled-icons/material/Home'
import { Edit } from 'styled-icons/material/Edit'
import { Image as ImageIcon } from 'styled-icons/material/Image'
import { FileArchive } from 'styled-icons/fa-solid/FileArchive'
import { BorderOuter } from 'styled-icons/material/BorderOuter'
import { MediaRecord } from 'styled-icons/typicons/MediaRecord'
import { Delete } from 'styled-icons/material/Delete'
import { Search } from 'styled-icons/material/Search'
import { Expand } from 'styled-icons/boxicons-regular/Expand'
import { Title } from 'styled-icons/material/Title'
import { MousePointer } from 'styled-icons/fa-solid/MousePointer'
import { Collections } from 'styled-icons/material/Collections'
import { FilterNone } from 'styled-icons/material/FilterNone'
import { Transfer } from 'styled-icons/boxicons-regular/Transfer'
import { Stats } from 'styled-icons/boxicons-regular/Stats'
import { Hashtag } from 'styled-icons/fa-solid/Hashtag'
import { PhotoSizeSelectLarge } from 'styled-icons/material/PhotoSizeSelectLarge'
import { AccessTime } from 'styled-icons/material/AccessTime'
import { RemoveFromQueue } from 'styled-icons/material/RemoveFromQueue'
import { PenFancy } from 'styled-icons/fa-solid/PenFancy'
import { Crop } from 'styled-icons/material/Crop'
import { ChevronDown } from 'styled-icons/boxicons-regular/ChevronDown'
import NumberInput from '../../Shared/NumberInput'
import Svg from '../../Svg'
import {
  Container,
  Tabs,
  Tab,
  Extras,
  Menu,
  Collapse,
  Section,
  SectionText,
  GenericGrid,
  Action,
  Zoom,
  ZoomInput,
  General,
  Statistic
} from './styles'

const tabs = [
  { icon: <Save />, text: 'File' },
  { icon: <Home />, text: 'Home' },
  { icon: <PlayArrow />, text: 'Playback' },
  { icon: <Edit />, text: 'Edit' },
  { icon: <ImageIcon />, text: 'Image' },
  { icon: <Transfer />, text: 'Transitions' },
  { icon: <Stats />, text: 'Statistics' }
]

const playback = [
  { icon: <AngleDoubleLeft />, text: 'First' },
  { icon: <AngleLeft />, text: 'Previous' },
  { icon1: <PlayArrow />, text1: 'Play', icon2: <Pause />, text2: 'Pause' },
  { icon: <AngleRight />, text: 'Next' },
  { icon: <AngleDoubleRight />, text: 'Last' }
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
  onSaveClick,
  onDiscardProjectClick,
  onPlaybackClick,
  onFrameDeleteClick,
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
        <Extras onClick={onOptionsClick}>Extras</Extras>
      </Tabs>
      <Menu show={showToolbar}>
        <Collapse onClick={() => setShowToolbar(false)}>
          <ChevronDown />
        </Collapse>
        {menuIndex === 0 ? (
          <>
            <Section width={75}>
              <GenericGrid columns={1}>
                <Action onClick={onNewRecordingClick}>
                  <MediaRecord />
                  <div className='text'>Recording</div>
                </Action>
              </GenericGrid>
              <SectionText>New</SectionText>
            </Section>
            <Section width={225}>
              <GenericGrid columns={3}>
                <Action onClick={onSaveClick}>
                  <Save />
                  <div className='text'>Save As</div>
                </Action>
                <Action onClick={() => onOpenDrawer('recent')}>
                  <FileArchive />
                  <div className='text'>Recent Projects</div>
                </Action>
                <Action onClick={onDiscardProjectClick}>
                  <Delete />
                  <div className='text'>Discard Project</div>
                </Action>
              </GenericGrid>
              <SectionText>File</SectionText>
            </Section>
          </>
        ) : menuIndex === 1 ? (
          <>
            <Section width={300}>
              <Zoom>
                <Action onClick={() => setScale(1)}>
                  <Expand className='expand' />
                  <div className='text'>100%</div>
                </Action>
                <Action onClick={() => setScale(zoomToFit)}>
                  <ImageIcon className='fit' />
                  <div className='text'>Fit Image</div>
                </Action>
                <ZoomInput>
                  <Search />
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
                  <MousePointer />
                  <div className='text'>Select All</div>
                </Action>
                <Action onClick={() => onSelectClick(1)}>
                  <Collections />
                  <div className='text'>Inverse</div>
                </Action>
                <Action onClick={() => onSelectClick(2)}>
                  <FilterNone />
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
            <Section width={225}>
              <GenericGrid columns={3}>
                <Action onClick={() => onFrameDeleteClick('selection')}>
                  <Delete />
                  <div className='text'>Delete</div>
                </Action>
                <Action onClick={() => onFrameDeleteClick('previous')}>
                  <Svg name='delete-next' />
                  <div className='text'>Delete All Previous</div>
                </Action>
                <Action onClick={() => onFrameDeleteClick('next')}>
                  <Svg name='delete-next' />
                  <div className='text'>Delete All Next</div>
                </Action>
              </GenericGrid>
              <SectionText>Frames</SectionText>
            </Section>
          </>
        ) : menuIndex === 4 ? (
          <>
            <Section width={150}>
              <GenericGrid columns={2}>
                <Action onClick={() => onOpenDrawer('resize')}>
                  <Expand />
                  <div className='text'>Resize</div>
                </Action>
                <Action onClick={() => onOpenDrawer('crop')}>
                  <Crop />
                  <div className='text'>Crop</div>
                </Action>
              </GenericGrid>
              <SectionText>Size and Rotation</SectionText>
            </Section>
            <Section width={150}>
              <GenericGrid columns={1}>
                <Action onClick={() => onOpenDrawer('title')}>
                  <Title />
                  <div className='text'>Title Frame</div>
                </Action>
              </GenericGrid>
              <SectionText>Text</SectionText>
            </Section>
            <Section width={225}>
              <GenericGrid columns={3}>
                <Action onClick={() => onOpenDrawer('drawing')}>
                  <PenFancy />
                  <div className='text'>Free Drawing</div>
                </Action>
                <Action onClick={() => onOpenDrawer('border')}>
                  <BorderOuter />
                  <div className='text'>Border</div>
                </Action>
                <Action onClick={() => onOpenDrawer('progress')}>
                  <RemoveFromQueue />
                  <div className='text'>Progress</div>
                </Action>
              </GenericGrid>
              <SectionText>Overlay</SectionText>
            </Section>
          </>
        ) : menuIndex === 6 && gifData ? (
          <>
            <Section width={450}>
              <General>
                <Statistic>
                  <div className='top'>
                    <Hashtag />
                    <div>Frame count</div>
                  </div>
                  <div className='bottom'>{totalFrames}</div>
                </Statistic>
                <Statistic>
                  <div className='top'>
                    <PhotoSizeSelectLarge />
                    <div>Frame size</div>
                  </div>
                  <div className='bottom'>{gifData.width + ' x ' + gifData.height}</div>
                </Statistic>
                <Statistic>
                  <div className='top'>
                    <AccessTime />
                    <div>Total duration</div>
                  </div>
                  <div className='bottom'>{format(new Date(totalDuration), 'mm:ss.SS')} m</div>
                </Statistic>
                <Statistic>
                  <div className='top'>
                    <AccessTime />
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
