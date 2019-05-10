import styled from 'styled-components'

export const Container = styled.div`
  width: ${p => p.width}px;
  height: 25px;
  background: ${p => p.color};
  outline: ${p => p.theme.border};
  cursor: pointer;
  &:hover {
    outline: 1px solid ${p => p.theme.primary};
  }
  input[type='color'] {
    display: none;
  }
`
