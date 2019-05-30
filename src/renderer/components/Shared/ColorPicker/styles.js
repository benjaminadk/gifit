import styled from 'styled-components'
import config from 'common/config'

const {
  picker: { barWidth, squareSize, handleWidth, handleHeight, handleOffsetX }
} = config

export const Container = styled.div`
  position: relative;
  width: ${barWidth + 'px'};
  height: ${squareSize + 'px'};
  outline: ${p => p.theme.outline};
  cursor: ns-resize;
`

export const Canvas = styled.canvas.attrs(props => ({
  width: barWidth,
  height: squareSize
}))``

export const Handle = styled.div.attrs(props => ({
  style: {
    top: props.top + 'px',
    transition: props.animate ? 'top .75s ease-out' : '0s'
  }
}))`
  position: absolute;
  left: ${handleOffsetX + 'px'};
  display: flex;
  align-items: center;
  width: ${handleWidth + 'px'};
  height: ${handleHeight + 'px'};
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  pointer-events: none;
`
