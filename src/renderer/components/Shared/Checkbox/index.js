import React from 'react'
import Svg from '../../Svg'
import { Container } from './styles'

export default function Checkbox({ value, primary, secondary = '', style, onClick }) {
  return (
    <Container style={style} onClick={onClick}>
      {value ? <Svg name='check-checked' /> : <Svg name='check-outline' />}
      <div className='text'>
        <div className='primary'>{primary}</div>
        {secondary && <div className='secondary'>({secondary})</div>}
      </div>
    </Container>
  )
}
