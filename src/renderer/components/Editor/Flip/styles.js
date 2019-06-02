import styled from 'styled-components'

export const ChoiceColumn = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: repeat(4, 30px);
  justify-items: center;
  align-items: center;
  .row {
    width: 50%;
  }
`
