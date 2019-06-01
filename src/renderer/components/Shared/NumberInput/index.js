import React, { useRef, useState } from 'react'
import { Container } from './styles'

export default function NumberInput({ width, value, max, min, fallback, disabled, setter }) {
  const input = useRef(null)

  const [focused, setFocused] = useState(false)

  function onFocus() {
    if (disabled) {
      return
    }
    setFocused(true)
    input.current.select()
  }

  function onBlur(e) {
    if (disabled) {
      return
    }
    if (e.target.value === '') {
      setter(fallback)
    } else if (e.target.value < min) {
      setter(min)
    }
    setFocused(false)
  }

  function onChange(e) {
    if (disabled) {
      return
    }
    const isDigit = /^\d*$/
    var newValue
    if (isDigit.test(e.target.value)) {
      if (Number(e.target.value) > max) {
        newValue = max
      } else {
        newValue = Number(e.target.value)
      }
    } else {
      newValue = fallback
    }
    setter(newValue)
  }

  function onArrowClick(inc) {
    if (disabled) {
      return
    }
    var currentValue = value
    var newValue
    if (inc) {
      if (currentValue < max) {
        newValue = currentValue + 1
      } else {
        newValue = max
      }
    } else {
      if (currentValue > min) {
        newValue = currentValue - 1
      } else {
        newValue = min
      }
    }
    setter(newValue)
  }

  return (
    <Container width={width} focused={focused}>
      <input
        ref={input}
        value={value}
        readOnly={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        autoFocus={false}
      />
      <div className='divider1' />
      <div className='arrows'>
        <div className='arrow up' onClick={() => onArrowClick(true)}>
          {'\u2bc5'}
        </div>
        <div className='divider2' />
        <div className='arrow down' onClick={() => onArrowClick(false)}>
          {'\u2bc6'}
        </div>
      </div>
    </Container>
  )
}
