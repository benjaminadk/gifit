import styled from 'styled-components'
import { lighten } from 'polished'

const shade = 0.3

export const Container = styled.div`
  width: ${p => p.width}px;
  height: 25px;
  display: grid;
  grid-template-columns: 1fr 1px 25px;
  outline: ${p => (p.focused ? `1px solid ${lighten(shade, p.theme.primary)}` : p.theme.border)};
  &:hover {
    outline: 1px solid ${p => lighten(shade, p.theme.primary)};
  }
  &:hover > .divider1 {
    background: ${p => lighten(shade, p.theme.primary)};
  }
  input {
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
    padding: 0;
    background: ${p => (p.focused ? p.theme.grey[1] : '#FFF')};
    &::selection {
      background: ${p => p.theme.primary};
      color: #fff;
    }
  }
  .divider1 {
    width: 1px;
    height: 25px;
    background: ${p => (p.focused ? lighten(shade, p.theme.primary) : 'transparent')};
  }
  .arrows {
    display: grid;
    grid-template-rows: 1fr 1px 1fr;
    justify-items: center;
    align-items: center;
    .arrow {
      width: 100%;
      height: 100%;
      display: grid;
      justify-items: center;
      align-items: center;
      background: ${p => (p.focused ? p.theme.grey[1] : '#FFF')};
      &:hover {
        background: ${p => p.theme.grey[1]};
      }
    }
    .divider2 {
      width: 25px;
      height: 1px;
      background: ${p => (p.focused ? lighten(shade, p.theme.primary) : 'transparent')};
    }
    &:hover .divider2 {
      background: ${p => lighten(shade, p.theme.primary)};
    }
  }
`
