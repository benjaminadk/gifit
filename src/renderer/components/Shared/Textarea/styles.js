import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.textarea.attrs(p => ({
  rows: 1,
  style: {
    width: p.width + 'px'
  }
}))`
  resize: none;
  margin-left: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.2rem;
  &:hover {
    border: 1px solid ${p => lighten(0.3, p.theme.primary)};
  }
  &:focus {
    border: 1px solid ${p => lighten(0.1, p.theme.primary)};
  }
  &::selection {
    background: ${p => p.theme.primary};
    color: #fff;
  }
`
