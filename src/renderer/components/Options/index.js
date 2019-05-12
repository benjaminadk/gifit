import React, { useContext } from 'react'
import { Check } from 'styled-icons/material/Check'
import styled from 'styled-components'
import { AppContext } from '../App'
import Button from '../Shared/Button'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 50px;
  .bottom {
    display: grid;
    justify-items: flex-end;
    align-items: center;
    background: ${p => p.theme.grey[0]};
    padding-right: 10px;
  }
`

export default function Options() {
  const { state, dispatch } = useContext(AppContext)
  const { options } = state

  return (
    <Container>
      <div />
      <div className='bottom'>
        <Button width={115}>
          <Check />
          <div className='text'>Save</div>
        </Button>
      </div>
    </Container>
  )
}
