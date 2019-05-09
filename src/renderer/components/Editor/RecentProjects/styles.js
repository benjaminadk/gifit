import styled from 'styled-components'
import { lighten, darken } from 'polished'

export const Table = styled.div`
  height: 100%;
  overflow-y: auto;
  border: ${p => p.theme.border};
  margin: 5px;
  .header {
    display: grid;
    grid-template-columns: 2fr 1.5fr;
    font-size: 1.2rem;
    border-bottom: ${p => p.theme.border};
    .left {
      height: 20px;
      display: grid;
      grid-template-columns: 1fr 20px;
      align-items: center;
      background: ${p => darken(0.2, p.theme.secondary)};
      border-right: ${p => p.theme.border};
      padding-left: 2px;
    }
    .right {
      height: 20px;
      display: grid;
      grid-template-columns: 1fr 20px;
      align-items: center;
      background: ${p => darken(0.2, p.theme.secondary)};
      padding-left: 2px;
    }
  }
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr;
  align-items: center;
  font-size: 1.2rem;
  border-bottom: ${p => p.theme.border};
  background: ${p =>
    p.selected ? darken(0.2, p.theme.primary) : 'transparent'};
  color: ${p => (p.selected ? '#FFF' : '#000')};
  &:nth-child(odd) {
    background: ${p =>
      p.selected
        ? darken(0.2, p.theme.primary)
        : lighten(0.4, p.theme.primary)};
  }
  .left {
    height: 20px;
    display: grid;
    align-items: center;
    border-right: ${p => p.theme.border};
    padding-left: 2px;
  }
  .right {
    height: 20px;
    display: grid;
    align-items: center;
    padding-left: 2px;
  }
`
