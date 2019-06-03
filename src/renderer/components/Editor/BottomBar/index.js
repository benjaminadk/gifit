import React, { useState, useEffect, useRef } from 'react'
import Svg from '../../Svg'
import { Container, Progress, Bar, Message, ZoomInput, Stats, Stat, Playback } from './styles'

const playback = [
  { icon: <Svg name='arrow-start' />, text: 'First' },
  { icon: <Svg name='arrow-prev' />, text: 'Previous' },
  { icon1: <Svg name='play' />, text1: 'Play', icon2: <Svg name='pause' />, text2: 'Pause' },
  { icon: <Svg name='arrow-next' />, text: 'Next' },
  { icon: <Svg name='arrow-end' />, text: 'Last' }
]

export default function BottomBar({
  loading,
  playing,
  total,
  selected,
  index,
  messageTemp,
  messagePerm,
  scale,
  setScale,
  setMessageTemp,
  onPlaybackClick
}) {
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showMessage, setShowMessage] = useState(false)

  const interval = useRef(null)
  const timeout = useRef(null)

  // when loading is set to true show progress bar
  useEffect(() => {
    if (loading) {
      setShowProgress(true)
      // increment 4% per second to simulate progress
      interval.current = setInterval(() => {
        setProgress(state => state + 1)
      }, 250)
    }
    // simulate progress complete when loading is done
    if (!loading && showProgress) {
      setProgress(100)
    }
    // clean up
    return () => {
      clearInterval(interval.current)
    }
  }, [loading])

  // when progress is set to 100% show bar for 2 more seconds
  useEffect(() => {
    if (progress === 100) {
      clearInterval(interval.current)
      timeout.current = setTimeout(() => {
        setProgress(0)
        setShowProgress(false)
      }, 2000)
    }

    return () => {
      clearTimeout(timeout.current)
    }
  }, [progress])

  // show message for 5 seconds
  useEffect(() => {
    var id
    if (messageTemp) {
      // if two messages happen quickly overwrite old settimeout
      clearTimeout(id)
      setShowMessage(true)
      id = setTimeout(() => {
        setShowMessage(false)
        setMessageTemp('')
      }, 5000)
    }

    return () => {
      clearTimeout(id)
    }
  }, [messageTemp])

  // make sure input is numeric and below 500
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

  // handle increment decrement arrows
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
      <Progress show={showProgress || loading}>
        <Bar value={progress >= 100 ? 100 : progress} />
      </Progress>
      <Message show={showMessage || messagePerm}>
        <Svg name='info' />
        <div className='text'>{messagePerm || messageTemp}</div>
      </Message>
      <ZoomInput show={scale !== null}>
        <div className='divider' />
        <Svg name='search' />
        <input value={Math.round(scale * 100)} onChange={onScaleChange} />
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
