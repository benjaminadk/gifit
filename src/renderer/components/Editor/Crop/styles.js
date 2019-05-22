import styled from 'styled-components'

export const Preview = styled.div`
  display: grid;
  grid-template-rows: 200px 20px;
  justify-items: center;
  align-items: center;
  canvas {
    box-shadow: 1px 1px 2px -2px rgba(0, 0, 0, 1), -1px 0 2px -2px rgba(0, 0, 0, 1);
  }
  .text {
    font-size: 1.2rem;
  }
`

export const Background = styled.div.attrs(p => ({
  style: {
    width: p.width === 'full' ? '100%' : p.width + 'px',
    height: p.height === 'full' ? '100%' : p.height + 'px',
    top: p.top + 'px',
    left: p.left + 'px'
  }
}))`
  position: absolute;
  z-index: 6;
  background: rgba(0, 0, 0, 0.5);
`

const handleStyle = {
  width: 10,
  height: 10,
  background: '#FFF',
  border: '1px solid grey'
}

export const resizeHandleStyles = {
  top: {
    ...handleStyle,
    left: '50%',
    cursor: 'n-resize'
  },
  topRight: {
    ...handleStyle,
    right: '-5px',
    top: '-5px'
  },
  right: {
    ...handleStyle,
    top: '50%',
    cursor: 'e-resize'
  },
  bottomRight: {
    ...handleStyle,
    right: '-5px',
    bottom: '-5px'
  },
  bottom: {
    ...handleStyle,
    left: '50%',
    cursor: 'n-resize'
  },
  bottomLeft: {
    ...handleStyle,
    left: '-5px',
    bottom: '-5px'
  },
  left: {
    ...handleStyle,
    top: '50%',
    cursor: 'e-resize'
  },
  topLeft: {
    ...handleStyle,
    left: '-5px',
    top: '-5px'
  }
}
