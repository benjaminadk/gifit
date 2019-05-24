import styled from 'styled-components'
import { lighten } from 'polished'
import config from 'common/config'

const {
  recorder: { zoomSize }
} = config

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  justify-items: center;
  align-items: flex-start;
  background: none;
  cursor: ${p => (p.crosshair ? 'crosshair' : p.noCursor ? 'none' : 'normal')};
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
  width: 225px;
  height: 40px;
  grid-template-columns: repeat(3, 75px);
  outline: 1px solid ${p => p.theme.grey[3]};
`

export const Option = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 25px 1fr;
  align-items: center;
  justify-items: center;
  background: ${p => p.theme.grey[0]};
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    width: 20px;
    height: 20px;
  }
  .text {
    font-size: 1.3rem;
  }
`

export const ZoomOverlay = styled.div.attrs(p => ({
  style: {
    display: p.show ? 'grid' : 'none',
    top: p.top + 'px',
    left: p.left + 'px'
  }
}))`
  position: absolute;
  z-index: 3;
  width: ${zoomSize}px;
  height: ${zoomSize + 20}px;
  grid-template-rows: 1fr 20px;
  .wrapper {
    position: relative;
  }
  .canvas1 {
    position: absolute;
    z-index: 4;
  }
  .canvas2 {
    position: absolute;
    z-index: 5;
  }
  .text {
    width: 100%;
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
    font-size: 1.2rem;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
  }
`

export const Outline = styled.div.attrs(p => ({
  style: {
    top: p.top + 'px',
    left: p.left + 'px',
    width: p.width + 'px',
    height: p.height + 'px',
    display: p.show ? 'block' : 'none'
  }
}))`
  position: absolute;
  outline: 2px dashed grey;
`
