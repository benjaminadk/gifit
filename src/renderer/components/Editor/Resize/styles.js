import styled from 'styled-components'

export const Dimension = styled.div`
  margin-left: 10px;
  margin-top: 5px;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${p => p.theme.primary};
`

export const LockRatio = styled.div`
  position: absolute;
  top: 40px;
  left: 190px;
  svg {
    width: 20px;
    height: 20px;
    color: ${p => p.theme.grey[10]};
  }
`
