import React, { useState, useEffect, useRef } from 'react'
import { AngleDoubleLeft } from 'styled-icons/fa-solid/AngleDoubleLeft'
import { AngleLeft } from 'styled-icons/fa-solid/AngleLeft'
import { AngleDoubleRight } from 'styled-icons/fa-solid/AngleDoubleRight'
import { AngleRight } from 'styled-icons/fa-solid/AngleRight'
import { PlayArrow } from 'styled-icons/material/PlayArrow'
import { Pause } from 'styled-icons/material/Pause'
import { Container, Progress, Bar, Numbers, Number, Playback } from './styles'

const playback = [
  { icon: <AngleDoubleLeft />, text: 'First' },
  { icon: <AngleLeft />, text: 'Previous' },
  { icon1: <PlayArrow />, text1: 'Play', icon2: <Pause />, text2: 'Pause' },
  { icon: <AngleRight />, text: 'Next' },
  { icon: <AngleDoubleRight />, text: 'Last' }
]

export default function BottomBar({ loading, playing, total, selected, index, onPlaybackClick }) {
  const [show, setShow] = useState(false)
  const [value, setValue] = useState(0)

  const timer = useRef(null)

  useEffect(() => {
    if (loading) {
      setShow(true)
    }
    if (!loading && show) {
      setValue(100)
    }
  }, [loading])

  useEffect(() => {
    var id
    if (show) {
      id = setInterval(() => {
        setValue(state => state + 1)
      }, 250)
      timer.current = id
    }
  }, [show])

  useEffect(() => {
    if (value === 100) {
      clearInterval(timer.current)
      setTimeout(() => {
        setValue(0)
        setShow(false)
      }, 1000)
    }
  }, [value])

  return (
    <Container>
      <Progress show={show || loading}>
        <Bar value={value} />
      </Progress>
      <div />
      <Numbers show={total}>
        <Number color='#00FF00'>{total}</Number>
        <Number color='#FF0000'>{selected}</Number>
        <Number color='#0000FF'>{index}</Number>
      </Numbers>
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
