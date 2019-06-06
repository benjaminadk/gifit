import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div.attrs(p => ({
  style: {
    top: p.top + 'px',
    left: p.left + 'px',
    display: p.show ? 'block' : 'none'
  }
}))`
  position: absolute;
  z-index: 11;
`

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  display: ${p => (p.show ? 'block' : 'none')};
  background: transparent;
`

export const Menu = styled.div`
  width: ${p => p.width}px;
  height: ${p => p.rows * 25}px;
  display: grid;
  grid-template-rows: ${p => `repeat(${p.rows}, 25px)`};
  background: #ffffff;
  outline: ${p => p.theme.border};
`

export const MenuItem = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  border: 1px solid transparent;
  &:hover {
    background: ${p => (p.inactive ? 'transparent' : lighten(0.4, p.theme.primary))};
    border: 1px solid ${p => (p.inactive ? 'transparent' : p.theme.primary)};
  }
  svg {
    justify-self: center;
    width: 20px;
    height: 20px;
  }
  .text {
    font-size: 1.2rem;
  }
`
