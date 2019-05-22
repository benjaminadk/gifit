import styled, { keyframes } from 'styled-components'
import { lighten } from 'polished'

const slideDown = keyframes`
  from {
    transform: translateY(-50px);
  }
  to {
    transform: translate(0px);
  }
`

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-items: center;
  align-items: flex-start;
  /* background: ${p => (p.transparent ? 'transparent' : 'rgba(0, 0, 0, 0.25)')}; */
  cursor: ${p => (p.crosshair ? 'crosshair' : p.noCursor ? 'none' : 'normal')};
`

export const Toolbar = styled.div`
  width: 150px;
  height: 50px;
  display: ${p => (p.show ? 'grid' : 'none')};
  grid-template-columns: repeat(3, 50px);
  outline: 1px solid ${p => p.theme.grey[10]};
  transform: translateY(-50px);
  animation: ${slideDown} 1s linear 0.5s forwards;
`

export const Option = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  background: ${p => p.theme.grey[0]};
  border: 1px solid ${p => p.theme.grey[0]};
  color: ${p => p.theme.black};
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
    border: 1px solid ${p => p.theme.primary};
  }
  svg {
    width: 20px;
    height: 20px;
  }
`

export const Rectangle = styled.div.attrs(p => ({
  style: {
    top: p.top + 'px',
    left: p.left + 'px',
    width: p.width + 'px',
    height: p.height + 'px',
    display: p.show ? 'block' : 'none',
    border: p.width || p.height ? `2px solid ${p.theme.primary}` : 0
  }
}))`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
`

export const Confirm = styled.div.attrs(p => ({
  style: {
    top: p.top + 'px',
    left: p.left + 'px',
    display: p.show ? 'grid' : 'none'
  }
}))`
  position: absolute;
  z-index: 3;
  width: 150px;
  height: 50px;
  grid-template-columns: repeat(3, 50px);
  outline: 1px solid ${p => p.theme.grey[10]};
`

export const Countdown = styled.div`
  justify-self: center;
  align-self: center;
  display: ${p => (p.show ? 'block' : 'none')};
  font-size: 4rem;
  color: #fff;
`
