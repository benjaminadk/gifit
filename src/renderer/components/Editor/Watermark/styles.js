import styled from 'styled-components'
import { lighten } from 'polished'

export const Filename = styled.div`
  width: 240px;
  font-size: 1.2rem;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 3px;
  padding-bottom: 3px;
`

export const FileInput = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  .button {
    width: 100px;
    height: 35px;
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    background: #ffffff;
    border: ${p => p.theme.border};
    &:hover {
      border: 1px solid ${p => p.theme.primary};
      background: ${p => lighten(0.4, p.theme.primary)};
    }
    svg {
      justify-self: center;
      width: 20px;
      height: 20px;
    }
    .text {
      font-size: 1.2rem;
    }
  }
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
