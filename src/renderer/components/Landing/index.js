import React, { useEffect, useContext } from 'react'
import { remote } from 'electron'
import { Settings } from 'styled-icons/material/Settings'
import { MediaRecord } from 'styled-icons/typicons/MediaRecord'
import { Image as ImageIcon } from 'styled-icons/material/Image'
import { AppContext } from '../App'
import initializeGifit from '../Gifit/initializeGifit'
import initializeOptions from '../Options/initializeOptions'
import config from 'common/config'
import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 40px 1fr;
  .top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    .title {
      font-size: 2.4rem;
    }
    .options {
      justify-self: flex-end;
      display: grid;
      grid-template-columns: 20px 1fr;
      align-items: center;
      font-size: 1.4rem;
      padding: 10px 5px;
      &:hover {
        background: ${p => lighten(0.4, p.theme.primary)};
      }
      svg {
        width: 15px;
        height: 15px;
      }
    }
  }
  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
  }
`

export const Action = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.theme.grey[0]};
  border: ${p => p.theme.border};
  font-size: 2rem;
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
    border: 1px solid ${p => p.theme.primary};
  }
  svg {
    width: 30px;
    height: 30px;
  }
`

const {
  mainWindow,
  appActions: { SET_APP_MODE }
} = config

export default function Landing() {
  const { state, dispatch } = useContext(AppContext)

  useEffect(() => {
    const [width, height] = remote.getCurrentWindow().getSize()
    if (width !== mainWindow.width || height !== mainWindow.height) {
      remote.getCurrentWindow().setSize(mainWindow.width, mainWindow.height)
      remote.getCurrentWindow().center()
    }
  }, [])

  function onOptionsClick() {
    initializeOptions(remote.getCurrentWindow())
  }

  function onRecordingClick() {
    initializeGifit(state, dispatch)
  }

  function onEditorClick() {
    dispatch({ type: SET_APP_MODE, payload: 1 })
  }

  return (
    <Container>
      <div className='top'>
        <div className='title'>GifIt</div>
        <div className='options' onClick={onOptionsClick}>
          <Settings />
          <div>Options</div>
        </div>
      </div>
      <div className='bottom'>
        <Action onClick={onRecordingClick}>
          <MediaRecord />
          <div>Recording</div>
        </Action>
        <Action onClick={onEditorClick}>
          <ImageIcon />
          <div>Editor</div>
        </Action>
      </div>
    </Container>
  )
}
