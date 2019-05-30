import styled from 'styled-components'
import config from 'common/config'

const {
  picker: { barWidth, squareSize, handleWidth, handleHeight, handleOffsetX }
} = config

export const Container = styled.div`
  width: 500px;
  height: 350px;
  display: grid;
  grid-template-rows: 25px 1fr;
  border: 1px solid #3d3d3d;
`

export const TitleBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  background: #3d3d3d;
  .left {
    display: grid;
    grid-template-columns: 25px 1fr;
    .icon {
    }
    .text {
      font-size: 1.2rem;
      color: white;
    }
  }
  .right {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 40px);
    .icon {
      width: 100%;
      height: 100%;
      display: grid;
      justify-items: center;
      align-items: center;
      svg {
        width: 15px;
        height: 15px;
      }
    }
  }
`

export const Main = styled.div`
  display: grid;
  grid-template-columns: 310px 40px 1fr;
  background: #ffffff;
  padding-top: 5px;
  .square {
    display: grid;
    justify-items: center;
  }
  .hue {
    display: grid;
    justify-items: center;
  }
`

export const Bar = styled.div`
  position: relative;
  width: ${barWidth + 'px'};
  height: ${squareSize + 'px'};
  outline: ${p => p.theme.outline};
  cursor: ns-resize;
`

export const Canvas = styled.canvas.attrs(p => ({
  width: barWidth,
  height: squareSize
}))``

export const Handle = styled.div.attrs(p => ({
  style: {
    top: p.top + 'px',
    transition: p.animate ? 'top .75s ease-out' : '0s'
  }
}))`
  position: absolute;
  left: ${handleOffsetX + 'px'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${handleWidth + 'px'};
  height: ${handleHeight + 'px'};
  pointer-events: none;
  svg {
    width: 20px;
    height: 20px;
  }
`
