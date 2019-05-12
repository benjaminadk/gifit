import React, { useState, useContext } from 'react'
import { Check } from 'styled-icons/material/Check'
import { DesktopWindows } from 'styled-icons/material/DesktopWindows'
import styled from 'styled-components'
import { lighten } from 'polished'
import { AppContext } from '../App'
import Checkbox from '../Shared/Checkbox'
import Button from '../Shared/Button'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 50px;
  .main {
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 5px;
    .menu {
      display: grid;
      grid-template-rows: repeat(10, 30px);
      grid-gap: 2px;
      align-items: center;
    }
    .content {
    }
  }
  .bottom {
    display: grid;
    justify-items: flex-end;
    align-items: center;
    background: ${p => p.theme.grey[0]};
    padding-right: 10px;
  }
`

export const MenuItem = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 25px 1fr;
  align-items: center;
  background: ${p => (p.selected ? lighten(0.4, p.theme.primary) : 'transparent')};
  border: ${p => (p.selected ? p.theme.border : '1px solid transparent')};
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
    border: 1px solid ${p => p.theme.primary};
  }
  svg {
    justify-self: center;
    width: 20px;
    height: 20px;
  }
  .text {
    font-size: 1.6rem;
  }
`

export const Application = styled.div``

export const Section = styled.div`
  height: ${p => p.height}px;
  display: grid;
  grid-template-rows: 20px 1fr;
  .title {
    display: flex;
    .text {
      font-size: 1.2rem;
      white-space: nowrap;
      margin-left: 3px;
      margin-right: 3px;
    }
    .divider {
      width: 100%;
      height: 1px;
      background: ${p => p.theme.grey[2]};
      margin-top: 7px;
    }
  }
  .content {
    padding: 10px;
  }
`

const menu = [
  'Application',
  'Interface',
  'Automated Tasks',
  'Shortcuts',
  'Languages',
  'Temporary Files',
  'Upload Services',
  'Extras',
  'Donate',
  'About'
]

export default function Options() {
  const { state, dispatch } = useContext(AppContext)
  const { options } = state

  const [menuIndex, setMenuIndex] = useState(0)

  return (
    <Container>
      <div className='main'>
        <div className='menu'>
          {menu.map((el, i) => (
            <MenuItem key={i} selected={i === menuIndex} onClick={() => setMenuIndex(i)}>
              <DesktopWindows />
              <div className='text'>{el}</div>
            </MenuItem>
          ))}
        </div>
        <div className='content'>
          {menuIndex === 0 ? (
            <Application>
              <Section height={200}>
                <div className='title'>
                  <div className='text'>Screen Recorder</div>
                  <div className='divider' />
                </div>
                <div className='content'>
                  <Checkbox
                    value={options.get('showCursor')}
                    primary='Show the mouse cursor in the recording.'
                  />
                </div>
              </Section>
            </Application>
          ) : null}
        </div>
      </div>
      <div className='bottom'>
        <Button width={115}>
          <Check />
          <div className='text'>Save</div>
        </Button>
      </div>
    </Container>
  )
}
