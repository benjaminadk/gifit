import styled from 'styled-components'

function createCheckerboard(color) {
  return `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(-45deg, ${color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color} 75%), linear-gradient(-45deg, transparent 75%, ${color} 75%)`
}

export const Container = styled.div.attrs(p => ({
  style: {
    backgroundImage: createCheckerboard('#e0e0e0'),
    backgroundSize: `10px 10px`,
    backgroundPosition: `0 0, 0 5px, 5px -5px, -5px 0px`
  }
}))`
  width: ${p => p.width}px;
  height: 25px;

  outline: ${p => p.theme.border};
  cursor: pointer;
  &:hover {
    outline: 1px solid ${p => p.theme.primary};
  }
  .inner {
    width: 100%;
    height: 100%;
    background: ${p => p.color};
  }
  input[type='color'] {
    display: none;
  }
`
