import styled from 'styled-components'

function createCheckerboard(color) {
  return `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(-45deg, ${color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color} 75%), linear-gradient(-45deg, transparent 75%, ${color} 75%)`
}

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 100px 1fr 100px;
`

export const Main = styled.div.attrs(p => ({
  style: {
    width: p.shift ? 'calc(100vw - 300px)' : '100vw',
    backgroundImage: createCheckerboard(p.color),
    backgroundSize: `${p.size}px ${p.size}px`,
    backgroundPosition: `0 0, 0 ${p.size / 2}px, ${p.size / 2}px -${p.size /
      2}px, -${p.size / 2}px 0px`
  }
}))`
  position: absolute;
  top: 100px;
  left: 0;
  overflow: auto;
  display: grid;
  justify-items: center;
  align-items: center;
  transition: 0.5s;
`

export const Wrapper = styled.div`
  position: relative;
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
`
