import styled from 'styled-components'
import config from 'common/config'

const {
  picker: { squareSize, crossSize }
} = config

export const Container = styled.div`
  position: relative;
  width: ${squareSize + 'px'};
  height: ${squareSize + 'px'};
  outline: ${p => p.theme.outline};
  cursor: crosshair;
`

export const Canvas = styled.canvas.attrs(props => ({
  width: squareSize,
  height: squareSize
}))``

export const Cross = styled.div.attrs(props => ({
  style: {
    top: props.top + 'px',
    left: props.left + 'px',
    width: crossSize + 'px',
    height: crossSize + 'px',
    transition: props.animate ? 'top .75s ease-out, left .75s ease-out' : '0s'
  }
}))`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  pointer-events: none;
  svg {
    width: ${crossSize + 'px'};
    height: ${crossSize + 'px'};
    color: ${p => p.theme.black};
  }
`
