import React, { useRef, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { FileArchive } from 'styled-icons/fa-solid/FileArchive'
import { Check } from 'styled-icons/material/Check'
import { Close } from 'styled-icons/material/Close'
import { Header, Main, Section, Footer, Button } from '../Drawer/styles'
import { Table, Row } from './styles'

export default function RecentProjects({ recentProjects, onAccept, onCancel }) {
  const [projects, setProjects] = useState([])
  const [projectIndex, setProjectIndex] = useState(0)
  const [sortMode, setSortMode] = useState(0)
  const [sectionHeight, setSectionHeight] = useState(0)

  const main = useRef(null)

  useEffect(() => {
    setSectionHeight(main.current.clientHeight - 20)
  }, [])

  useEffect(() => {
    recentProjects.sort((a, b) => {
      if (sortMode === 0) {
        return b.date - a.date
      } else if (sortMode === 1) {
        return a.date - b.date
      } else if (sortMode === 2) {
        return b.frames.length - a.frames.length
      } else {
        return a.frames.length - b.frames.length
      }
    })
    setProjects(recentProjects.slice())
  }, [recentProjects, sortMode])

  function onHeaderClick(left) {
    if (left) {
      setSortMode(state => (state === 0 ? 1 : 0))
    } else {
      setSortMode(state => (state === 2 ? 3 : 2))
    }
  }

  return (
    <>
      <Header>
        <div className='left'>
          <FileArchive />
          <div className='text'>Recent Projects</div>
        </div>
        <div className='right'>
          <Close onClick={onCancel} />
        </div>
      </Header>
      <Main ref={main}>
        <Section height={sectionHeight}>
          <div className='title'>
            <div className='text'>Recent Projects</div>
            <div className='divider' />
          </div>
          <div>
            <Table>
              <div className='header'>
                <div className='left' onClick={() => onHeaderClick(true)}>
                  <div>Creation date</div>
                  <div>
                    {sortMode === 0 ? '\u2bc6' : sortMode === 1 ? '\u2bc5' : ''}
                  </div>
                </div>
                <div className='right' onClick={() => onHeaderClick(false)}>
                  <div>Frame count</div>
                  <div>
                    {sortMode === 2 ? '\u2bc6' : sortMode === 3 ? '\u2bc5' : ''}
                  </div>
                </div>
              </div>
              {projects.map((el, i) => (
                <Row
                  key={i}
                  selected={projectIndex === i}
                  onClick={() => setProjectIndex(i)}
                >
                  <div className='left'>
                    {format(new Date(el.date), 'MM/dd/yyyy K:mm:ss a')}
                  </div>
                  <div className='right'>{el.frames.length}</div>
                </Row>
              ))}
            </Table>
          </div>
        </Section>
      </Main>
      <Footer>
        <Button
          width={115}
          onClick={() => onAccept(projects[projectIndex].relative)}
        >
          <Check />
          <div className='text'>Open</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Close />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}
