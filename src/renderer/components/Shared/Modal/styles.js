import styled, { keyframes } from 'styled-components'

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const Container = styled.div`
  display: ${p => (p.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
`

export const Wrapper = styled.div`
  position: fixed;
  max-width: 100%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: left center;
  animation: ${fade} 0.5s;
`
