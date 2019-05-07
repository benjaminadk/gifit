import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 100px 1fr 100px;
`

export const Main = styled.div`
  position: absolute;
  top: 100px;
  left: 0;
  overflow: auto;
  width: ${p => (p.shift ? 'calc(100vw - 300px)' : '100vw')};
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
