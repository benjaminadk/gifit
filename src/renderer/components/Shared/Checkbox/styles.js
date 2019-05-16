import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 25px 1fr;
  align-items: center;
  margin-bottom: 10px;
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
      margin-right: 5px;
    }
    .secondary {
      color: ${p => p.theme.grey[5]};
    }
  }
`
