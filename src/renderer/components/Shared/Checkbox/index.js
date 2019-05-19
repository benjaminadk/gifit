import React from 'react'
import { CheckBox } from 'styled-icons/material/CheckBox'
import { CheckBoxOutlineBlank } from 'styled-icons/material/CheckBoxOutlineBlank'
import { Container } from './styles'

export default function Checkbox({ value, primary, secondary = '', style, onClick }) {
  return (
    <Container style={style} onClick={onClick}>
      {value ? <CheckBox /> : <CheckBoxOutlineBlank />}
      <div className='text'>
        <div className='primary'>{primary}</div>
        {secondary && <div className='secondary'>({secondary})</div>}
      </div>
    </Container>
  )
}
