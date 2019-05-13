import React, { useState, useContext } from 'react'
import { Check } from 'styled-icons/material/Check'
import { DesktopWindows } from 'styled-icons/material/DesktopWindows'
import { AppContext } from '../App'
import Checkbox from '../Shared/Checkbox'
import Button from '../Shared/Button'
import { Container, MenuItem, Application, Section } from './styles'

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
