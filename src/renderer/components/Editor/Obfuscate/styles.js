import styled from 'styled-components'

export const Container = styled.div.attrs(p => ({
  style: {
    width: p.width + 'px',
    height: p.height + 'px'
  }
}))`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  cursor: crosshair;
`

export const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export const Dimensions = styled.div`
  display: ${p => (p.show ? 'inline' : 'none')};
  font-size: 2rem;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  padding: 5px;
`
