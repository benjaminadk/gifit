import styled from 'styled-components'

export const BorderInputs = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 35px);
  .end {
    display: grid;
    align-items: center;
    margin-left: 30px;
  }
  .middle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }
`

export const BorderInput = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
  }
  .spacer {
    margin-right: 5px;
  }
`
