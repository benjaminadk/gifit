import React, { useRef, useState, useEffect } from 'react'
import { format } from 'date-fns'
import styled from 'styled-components'
import { Main, Section } from '../Drawer/styles'

export const Table = styled.div`
  height: 100%;
  overflow-y: auto;
  border: ${p => p.theme.border};
  margin: 5px;
  .header {
    display: grid;
    grid-template-columns: 2fr 1.5fr;
    font-size: 1.2rem;
    border-bottom: ${p => p.theme.border};
    .left {
      height: 20px;
      display: grid;
      grid-template-columns: 1fr 20px;
      align-items: center;
      background: lightskyblue;
      border-right: ${p => p.theme.border};
      padding-left: 2px;
    }
    .right {
      height: 20px;
      display: grid;
      grid-template-columns: 1fr 20px;
      align-items: center;
      background: lightskyblue;
      padding-left: 2px;
    }
  }
  .row {
    display: grid;
    grid-template-columns: 2fr 1.5fr;
    align-items: center;
    font-size: 1.2rem;
    border-bottom: ${p => p.theme.border};
    &:nth-child(odd) {
      background: pink;
    }
    .left {
      height: 20px;
      display: grid;
      align-items: center;
      border-right: ${p => p.theme.border};
      padding-left: 2px;
    }
    .right {
      height: 20px;
      display: grid;
      align-items: center;
      padding-left: 2px;
    }
  }
`

export default function RecentProjects({ recentProjects }) {
  const [projects, setProjects] = useState([])
  const [projectIndex, setProjectIndex] = useState(0)
  const [sortMode, setSortMode] = useState(2)
  const [sectionHeight, setSectionHeight] = useState(0)

  const main = useRef(null)

  useEffect(() => {
    setSectionHeight(main.current.clientHeight - 50)
  }, [])

  useEffect(() => {
    const sortedProjects = recentProjects.sort((a, b) => {
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
    setProjects(sortedProjects)
  }, [sortMode])

  return (
    <Main ref={main}>
      <Section height={sectionHeight}>
        <div className='title'>
          <div className='text'>Recent Projects</div>
          <div className='divider' />
        </div>
        <div>
          <Table>
            <div className='header'>
              <div className='left'>
                <div>Creation date</div>
                <div>
                  {sortMode === 0 ? '\u2bc6' : sortMode === 1 ? '\u2bc5' : ''}
                </div>
              </div>
              <div className='right'>
                <div>Frame count</div>
                <div>
                  {sortMode === 2 ? '\u2bc6' : sortMode === 3 ? '\u2bc5' : ''}
                </div>
              </div>
            </div>
            {projects.map((el, i) => (
              <div key={i} className='row'>
                <div className='left'>
                  {format(new Date(el.date), 'MM/dd/yyyy K:mm:ss a')}
                </div>
                <div className='right'>{el.frames.length}</div>
              </div>
            ))}
          </Table>
        </div>
      </Section>
    </Main>
  )
}
