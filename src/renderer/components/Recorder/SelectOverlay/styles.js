import styled from 'styled-components'

export const Background = styled.div.attrs(p => ({
  style: {
    width: p.width === 'full' ? '100%' : p.width + 'px',
    height: p.height === 'full' ? '100%' : p.height + 'px',
    top: p.top + 'px',
    left: p.left + 'px'
  }
}))`
  position: absolute;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
`

export const Dimensions = styled.div`
  display: ${p => (p.show ? 'inline' : 'none')};
  background: rgba(255, 255, 255, 0.75);
  color: #000000;
  font-size: 2rem;
  padding: 5px;
`
