import React, { useState, useEffect, useRef } from 'react'
import { Container, Progress, Bar } from './styles'

export default function BottomBar({ loading }) {
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
    </Container>
  )
}
