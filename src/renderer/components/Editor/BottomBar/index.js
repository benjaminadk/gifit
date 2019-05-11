import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 20px;
  display: grid;
  grid-template-columns: 250px 1fr;
  justify-items: center;
  align-items: center;
  background: ${p => p.theme.grey[1]};
  border-top: 2px solid #fff;
`

export const Progress = styled.div`
  width: 200px;
  height: 10px;
  display: ${p => (p.show ? 'block' : 'none')};
  border: 1px solid ${p => p.theme.grey[5]};
  background: #fff;
`

export const Bar = styled.div.attrs(p => ({
  style: {
    width: p.value + '%'
  }
}))`
  height: 100%;
  background: ${p => p.theme.primary};
`

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
      <Progress show={show}>
        <Bar value={value} />
      </Progress>
      <div />
    </Container>
  )
}
