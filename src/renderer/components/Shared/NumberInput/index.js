import React, { useRef, useState } from 'react'
import { Container } from './styles'

export default function NumberInput({
  width,
  value,
  onChange,
  onBlur,
  onArrowUpClick,
  onArrowDownClick
}) {
  const input = useRef(null)

  const [focused, setFocused] = useState(false)

  function onFocus() {
    setFocused(true)
    input.current.select()
  }

  function _onBlur(e) {
    setFocused(false)
    onBlur && onBlur(e)
  }

  return (
    <Container width={width} focused={focused}>
      <input ref={input} value={value} onChange={onChange} onFocus={onFocus} onBlur={_onBlur} />
      <div className='divider1' />
      <div className='arrows'>
        <div className='arrow up' onClick={onArrowUpClick}>
          {'\u2bc5'}
        </div>
        <div className='divider2' />
        <div className='arrow down' onClick={onArrowDownClick}>
          {'\u2bc6'}
        </div>
      </div>
    </Container>
  )
}
