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
import { FolderOpen } from 'styled-icons/fa-solid/FolderOpen'
import { BorderOuter } from 'styled-icons/material/BorderOuter'
import { MediaRecord } from 'styled-icons/typicons/MediaRecord'
import { Delete } from 'styled-icons/material/Delete'
import {
  Container,
  Tabs,
  Tab,
  Menu,
  Section,
  SectionText,
  Action,
  New,
  File,
  Playback,
  ImageTab
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
  playing,
  onSaveClick,
  onPlaybackClick,
  onOpenBorderDrawer
}) {
  const [menuIndex, setMenuIndex] = useState(0)
  return (
    <Container>
      <Tabs>
        {tabs.map((el, i) => (
          <Tab
            key={i}
            selected={i === menuIndex}
            onClick={() => setMenuIndex(i)}
          >
            {el.icon}
            <div className='text'>{el.text}</div>
            <div className='divider' />
          </Tab>
        ))}
      </Tabs>
      {menuIndex === 0 ? (
        <Menu>
          <Section width={75}>
            <New>
              <Action>
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
              <Action>
                <FolderOpen />
                <div className='text'>Recent Projects</div>
              </Action>
              <Action>
                <Delete />
                <div className='text'>Discard Project</div>
              </Action>
            </File>
            <SectionText>File</SectionText>
          </Section>
        </Menu>
      ) : menuIndex === 2 ? (
        <Menu>
          <Section width={250}>
            <Playback>
              {playback.map((el, i) => (
                <Action key={i} onClick={() => onPlaybackClick(i)}>
                  {i !== 2 ? el.icon : playing ? el.icon2 : el.icon1}
                  <div className='text'>
                    {i !== 2 ? el.text : playing ? el.text2 : el.text1}
                  </div>
                </Action>
              ))}
            </Playback>
            <SectionText>Playback</SectionText>
          </Section>
        </Menu>
      ) : menuIndex === 4 ? (
        <ImageTab>
          <Action onClick={onOpenBorderDrawer}>
            <BorderOuter />
            <div className='text'>Border</div>
          </Action>
        </ImageTab>
      ) : (
        <div />
      )}
    </Container>
  )
}
