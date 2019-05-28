import styled from 'styled-components'
import { lighten } from 'polished'

export const Shapes = styled.div`
  width: 200px;
  height: 40px;
  display: grid;
  grid-template-columns: repeat(2, 40px);
  align-items: center;
  justify-items: center;
  border: ${p => p.theme.border};
  background: #ffffff;
  margin-left: 20px;
`

export const ShapeOption = styled.div`
  width: 90%;
  height: 90%;
  display: grid;
  align-items: center;
  justify-items: center;
  border: ${p => (p.selected ? `1px solid ${p.theme.primary}` : '1px solid #fff')};
  background: ${p => (p.selected ? lighten(0.4, p.theme.primary) : 'transparent')};
  &:hover {
    border: 1px solid ${p => p.theme.primary};
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    width: 30px;
    height: 30px;
  }
`

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
