import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'styled-icons/octicons/Search'
import { AngleDoubleLeft } from 'styled-icons/fa-solid/AngleDoubleLeft'
import { AngleLeft } from 'styled-icons/fa-solid/AngleLeft'
import { AngleDoubleRight } from 'styled-icons/fa-solid/AngleDoubleRight'
import { AngleRight } from 'styled-icons/fa-solid/AngleRight'
import { PlayArrow } from 'styled-icons/material/PlayArrow'
import { Pause } from 'styled-icons/material/Pause'
import { Container, Progress, Bar, ZoomInput, Stats, Stat, Playback } from './styles'

const playback = [
  { icon: <AngleDoubleLeft />, text: 'First' },
  { icon: <AngleLeft />, text: 'Previous' },
  { icon1: <PlayArrow />, text1: 'Play', icon2: <Pause />, text2: 'Pause' },
  { icon: <AngleRight />, text: 'Next' },
  { icon: <AngleDoubleRight />, text: 'Last' }
]

export default function BottomBar({
  loading,
  playing,
  total,
  selected,
  index,
  scale,
  setScale,
  onPlaybackClick
}) {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(0)

  const timer = useRef(null)

  useEffect(() => {
    var id
    if (loading) {
      setShow(true)
      id = setInterval(() => {
        setProgress(state => state + 1)
      }, 250)
      timer.current = id
    }
    if (!loading && show) {
      setProgress(100)
    }
  }, [loading])

  useEffect(() => {
    if (progress === 100) {
      clearInterval(timer.current)
      setTimeout(() => {
        setProgress(0)
        setShow(false)
      }, 1000)
    }
  }, [progress])

  function onScaleChange({ target: { value } }) {
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(value)) {
      if (Number(value) > 500) {
        newValue = 500
      } else {
        newValue = Number(value)
      }
    } else {
      newValue = 100
    }
    setScale(newValue / 100)
  }

  function onScaleArrowClick(inc) {
    var currentValue = scale * 100
    var newValue
    if (inc) {
      if (currentValue < 500) {
        newValue = currentValue + 1
      } else {
        newValue = 500
      }
    } else {
      if (currentValue > 0) {
        newValue = currentValue - 1
      } else {
        newValue = 0
      }
    }
    setScale(newValue / 100)
  }

  return (
    <Container>
      <Progress show={show || loading}>
        <Bar value={progress} />
      </Progress>
      <div />
      <ZoomInput show={scale !== null}>
        <div className='divider' />
        <Search />
        <input value={scale * 100} onChange={onScaleChange} />
        <div className='arrows'>
          <div className='arrow' onClick={() => onScaleArrowClick(true)}>
            {'\u2bc5'}
          </div>
          <div className='arrow' onClick={() => onScaleArrowClick(false)}>
            {'\u2bc6'}
          </div>
        </div>
        <div className='label'>%</div>
      </ZoomInput>
      <Stats show={total}>
        <Stat color='#00FF00'>{total}</Stat>
        <Stat color='#FF0000'>{selected}</Stat>
        <Stat color='#0000FF'>{index}</Stat>
      </Stats>
      <Playback>
        {playback.map((el, i) => (
          <div key={i} className='icon' onClick={() => onPlaybackClick(i)}>
            {i !== 2 ? el.icon : playing ? el.icon2 : el.icon1}
          </div>
        ))}
      </Playback>
    </Container>
  )
}
