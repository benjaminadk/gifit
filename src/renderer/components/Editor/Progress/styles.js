import styled from 'styled-components'
import { lighten } from 'polished'

export const Choices = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
`

export const Choice = styled.div`
  width: 80%;
  display: grid;
  grid-template-columns: 25px 1fr;
  justify-items: center;
  align-items: center;
  background: ${p => (p.selected ? lighten(0.3, p.theme.primary) : 'transparent')};
  font-size: 1.2rem;
  padding: 5px;
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    width: 20px;
    height: 20px;
  }
`
