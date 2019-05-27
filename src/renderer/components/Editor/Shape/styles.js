import styled from 'styled-components'

export const Container = styled.div`
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

export const Shape = styled.div.attrs(p => ({
  style: {
    border: `${p.strokeWidth}px solid ${p.strokeColor}`,
    borderRadius: p.shape === 'ellipsis' ? '50%' : 0,
    background: p.fillColor
  }
}))`
  width: 100%;
  height: 100%;
`

const handleStyle = {
  width: '10px',
  height: '10px',
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
