import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div`
  position: relative;
`

export const Value = styled.div`
  width: ${p => p.width}px;
  height: 25px;
  display: grid;
  grid-template-columns: 1fr 20px;
  background: #fff;
  border: ${p => p.theme.border};
  &:hover {
    border: 1px solid ${p => p.theme.primary};
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  .text {
    align-self: center;
    font-size: 1.2rem;
    font-family: ${p => p.fontFamily || 'Segoe UI'};
    padding-left: 5px;
  }
  .arrow {
    justify-self: center;
    align-self: center;
  }
`

export const Options = styled.div`
  position: absolute;
  top: 25px;
  left: ${p => p.left}px;
  z-index: ${p => (p.show ? 2 : 1)};
  width: ${p => p.width}px;
  max-height: ${p => (p.show ? '250px' : '0px')};
  overflow: auto;
  display: flex;
  flex-direction: column;
  border: ${p => (p.show ? p.theme.border : `1px solid transparent`)};
  border-top: 0;
  background: #fff;
  transition: ${p => (p.show ? `max-height 0.2s` : '0')};
`

export const Option = styled.div`
  font-size: 1.2rem;
  font-family: ${p => p.fontFamily || 'Segoe UI'};
  padding: 2px;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${p => p.theme.primary};
    background: ${p => lighten(0.4, p.theme.primary)};
  }
`
