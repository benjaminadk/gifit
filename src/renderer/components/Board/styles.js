import styled from 'styled-components'
import { lighten, darken } from 'polished'

export const Container = styled.div`
  display: grid;
  grid-template-rows: 30px 1fr 40px;
  padding-left: 2px;
  padding-right: 2px;
  overflow: hidden;
`

export const Top = styled.div`
  display: grid;
  grid-template-columns: 30px 30px 70px 70px 70px 30px 30px 80px 70px 1fr;
  align-items: center;
  justify-items: center;
`

export const Action = styled.div`
  width: 90%;
  height: 90%;
  display: grid;
  align-items: center;
  justify-items: center;
  background: ${p => (p.selected ? lighten(0.4, p.theme.primary) : 'transparent')};
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    width: 20px;
    height: 20px;
  }
`

export const Status = styled.div`
  display: ${p => (p.show ? 'block' : 'none')};
  font-size: 1.2rem;
  color: ${p => darken(0.1, p.theme.primary)};
`

export const Main = styled.div`
  justify-self: center;
  position: relative;
  border: ${p => p.theme.border};
  overflow: hidden;
`

export const Canvas1 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.2;
`

export const Canvas2 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`

export const Canvas3 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  opacity: ${p => p.opacity};
  cursor: none;
`

export const Bottom = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px 120px 115px ${p => p.discard && '80px'} 80px 60px;
  align-items: center;
  justify-items: center;
`

export const Dimensions = styled.div`
  display: grid;
  grid-template-columns: 40px 10px 40px 15px;
  align-items: center;
  .label {
    width: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
    font-size: 1.2rem;
  }
  input {
    width: 40px;
    height: 25px;
    border: ${p => p.theme.border};
    font-size: 1.2rem;
    text-align: center;
    &::selection {
      background: ${p => p.theme.primary};
      color: #fff;
    }
    &:focus {
      border: 1px solid ${p => lighten(0.3, p.theme.primary)};
      background: ${p => p.theme.grey[1]};
    }
  }
`

export const Discard = styled.div`
  width: 80px;
  height: 90%;
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  border-left: ${p => p.theme.border};
  border-right: ${p => p.theme.border};
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    justify-self: center;
    width: 15px;
    height: 15px;
  }
  .text {
    font-size: 1.2rem;
  }
`

export const Control = styled.div`
  align-self: center;
  width: ${p => p.width}px;
  height: 90%;
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    justify-self: center;
    width: 20px;
    height: 20px;
  }
  .text {
    display: grid;
    grid-template-rows: 2fr 1fr;
    .primary {
      align-self: flex-end;
      font-size: 1.2rem;
    }
    .secondary {
      align-self: flex-end;
      font-size: 1rem;
      color: ${p => p.theme.grey[5]};
    }
  }
`
