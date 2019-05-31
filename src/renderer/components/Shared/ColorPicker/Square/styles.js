import styled from 'styled-components'
import config from 'common/config'

const {
  picker: { squareSize, crossSize }
} = config

export const Container = styled.div`
  position: relative;
  width: ${squareSize + 'px'};
  height: ${squareSize + 'px'};
  cursor: crosshair;
  box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.5);
`

export const Canvas = styled.canvas.attrs(p => ({
  width: squareSize,
  height: squareSize
}))``

export const Cross = styled.div.attrs(p => ({
  style: {
    top: p.top + 'px',
    left: p.left + 'px',
    width: crossSize + 'px',
    height: crossSize + 'px',
    transition: p.animate ? 'top .75s ease-out, left .75s ease-out' : '0s'
  }
}))`
  position: absolute;
  display: grid;
  justify-items: center;
  align-items: center;
  svg {
    width: 15px;
    height: 15px;
  }
`
