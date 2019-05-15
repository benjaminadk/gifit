import React, { useEffect, useState } from 'react'
import { Container, Value, Options, Option } from './styles'

export default function Select({ type, width, value, options, onClick }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) {
      document.body.addEventListener('click', () => setShow(false))
    } else {
      document.body.removeEventListener('click', () => setShow(false))
    }
  }, [show])

  return (
    <Container>
      <Value
        width={width}
        fontFamily={type === 'family' ? value : null}
        onClick={() => setShow(true)}
      >
        <div className='text'>{value}</div>
        <div className='arrow'>{'\u2bc6'}</div>
      </Value>
      <Options width={width} show={show}>
        {options.map((el, i) => (
          <Option key={i} fontFamily={type === 'family' ? el : null} onClick={() => onClick(el)}>
            {el}
          </Option>
        ))}
      </Options>
    </Container>
  )
}
