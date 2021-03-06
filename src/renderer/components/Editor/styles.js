import styled from 'styled-components'

function createCheckerboard(color) {
  return `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(-45deg, ${color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color} 75%), linear-gradient(-45deg, transparent 75%, ${color} 75%)`
}

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

export const Main = styled.div.attrs(p => ({
  style: {
    top: p.shiftUp ? '120px' : '25px',
    width: p.shiftLeft ? 'calc(100vw - 300px)' : '100vw',
    height: p.height + 'px',
    backgroundImage: createCheckerboard(p.color),
    backgroundSize: `${p.size}px ${p.size}px`,
    backgroundPosition: `0 0, 0 ${p.size / 2}px, ${p.size / 2}px -${p.size / 2}px, -${p.size /
      2}px 0px`
  }
}))`
  position: absolute;
  left: 0;
  overflow: auto;
  display: grid;
  justify-items: center;
  align-items: center;
  transition: 0.25s;
`

export const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`

export const Canvas1 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`

export const Canvas2 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: ${p => p.opacity};
`

export const Canvas3 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  opacity: 0.2;
`

export const Canvas4 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
`

export const Canvas5 = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  display: ${p => (p.show ? 'block' : 'none')};
  opacity: ${p => p.opacity};
  cursor: none;
`
