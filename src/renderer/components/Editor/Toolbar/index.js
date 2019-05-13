import React, { useState } from 'react'
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
import NumberInput from '../../Shared/NumberInput'
import {
  Container,
  Tabs,
  Tab,
  Extras,
  Menu,
  Section,
  SectionText,
  Action,
  New,
  File,
  Zoom,
  ZoomInput,
  Selection,
  Playback,
  Frames,
  Text,
  Overlay
} from './styles'

const tabs = [
  { icon: <Save />, text: 'File' },
  { icon: <Home />, text: 'Home' },
  { icon: <PlayArrow />, text: 'Playback' },
  { icon: <Edit />, text: 'Edit' },
  { icon: <ImageIcon />, text: 'Image' }
]

const playback = [
  { icon: <AngleDoubleLeft />, text: 'First' },
  { icon: <AngleLeft />, text: 'Previous' },
  { icon1: <PlayArrow />, text1: 'Play', icon2: <Pause />, text2: 'Pause' },
  { icon: <AngleRight />, text: 'Next' },
  { icon: <AngleDoubleRight />, text: 'Last' }
]

export default function Toolbar({
  scale,
  zoomToFit,
  playing,
  setScale,
  onOpenTitleDrawer,
  onOpenBorderDrawer,
  onOpenRecentDrawer,
  onZoomChange,
  onZoomArrowClick,
  onNewRecordingClick,
  onSaveClick,
  onDiscardProjectClick,
  onPlaybackClick,
  onFrameDeleteClick,
  onOptionsClick,
  onSelectClick
}) {
  const [menuIndex, setMenuIndex] = useState(0)

  return (
    <Container>
      <Tabs>
        {tabs.map((el, i) => (
          <Tab key={i} selected={i === menuIndex} onClick={() => setMenuIndex(i)}>
            {el.icon}
            <div className='text'>{el.text}</div>
            <div className='divider' />
          </Tab>
        ))}
        <div />
        <Extras onClick={onOptionsClick}>Extras</Extras>
      </Tabs>
      {menuIndex === 0 ? (
        <Menu>
          <Section width={75}>
            <New>
              <Action onClick={onNewRecordingClick}>
                <MediaRecord />
                <div className='text'>Recording</div>
              </Action>
            </New>
            <SectionText>New</SectionText>
          </Section>
          <Section width={225}>
            <File>
              <Action onClick={onSaveClick}>
                <Save />
                <div className='text'>Save As</div>
              </Action>
              <Action onClick={onOpenRecentDrawer}>
                <FileArchive />
                <div className='text'>Recent Projects</div>
              </Action>
              <Action onClick={onDiscardProjectClick}>
                <Delete />
                <div className='text'>Discard Project</div>
              </Action>
            </File>
            <SectionText>File</SectionText>
          </Section>
        </Menu>
      ) : menuIndex === 1 ? (
        <Menu>
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
                  onChange={onZoomChange}
                  onArrowUpClick={() => onZoomArrowClick(true)}
                  onArrowDownClick={() => onZoomArrowClick(false)}
                />
                <div className='text'>%</div>
              </ZoomInput>
            </Zoom>
            <SectionText>Zoom</SectionText>
          </Section>
          <Section width={300}>
            <Selection>
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
            </Selection>
            <SectionText>Select</SectionText>
          </Section>
        </Menu>
      ) : menuIndex === 2 ? (
        <Menu>
          <Section width={250}>
            <Playback>
              {playback.map((el, i) => (
                <Action key={i} onClick={() => onPlaybackClick(i)}>
                  {i !== 2 ? el.icon : playing ? el.icon2 : el.icon1}
                  <div className='text'>{i !== 2 ? el.text : playing ? el.text2 : el.text1}</div>
                </Action>
              ))}
            </Playback>
            <SectionText>Playback</SectionText>
          </Section>
        </Menu>
      ) : menuIndex === 3 ? (
        <Menu>
          <Section width={100}>
            <Frames>
              <Action onClick={onFrameDeleteClick}>
                <Delete />
                <div className='text'>Delete</div>
              </Action>
            </Frames>
            <SectionText>Frames</SectionText>
          </Section>
        </Menu>
      ) : menuIndex === 4 ? (
        <Menu>
          <Section width={200}>
            <Text>
              <Action onClick={onOpenTitleDrawer}>
                <Title />
                <div className='text'>Title Frame</div>
              </Action>
            </Text>
            <SectionText>Text</SectionText>
          </Section>
          <Section width={200}>
            <Overlay>
              <Action onClick={onOpenBorderDrawer}>
                <BorderOuter />
                <div className='text'>Border</div>
              </Action>
            </Overlay>
            <SectionText>Overlay</SectionText>
          </Section>
        </Menu>
      ) : (
        <div />
      )}
    </Container>
  )
}
