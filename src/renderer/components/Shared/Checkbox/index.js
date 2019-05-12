import React from 'react'
import { CheckBox } from 'styled-icons/material/CheckBox'
import { CheckBoxOutlineBlank } from 'styled-icons/material/CheckBoxOutlineBlank'
import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 25px 1fr;
  align-items: center;
  svg {
    justify-self: center;
    width: 15px;
    height: 15px;
    color: ${p => p.theme.grey[10]};
  }
  .text {
    display: flex;
    font-size: 1.2rem;
    .primary {
      color: #000;
    }
    .secondary {
      color: ${p => p.theme.grey[5]};
    }
  }
`

export default function Checkbox({ value, primary, secondary = '' }) {
  return (
    <Container>
      {value ? <CheckBox /> : <CheckBoxOutlineBlank />}
      <div className='text'>
        <div className='primary'>{primary}</div>
        {secondary && <div className='secondary'>({secondary})</div>}
      </div>
    </Container>
  )
}
