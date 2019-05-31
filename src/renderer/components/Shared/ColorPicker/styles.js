import styled from 'styled-components'
import { darken, lighten } from 'polished'
import config from 'common/config'

const {
  picker: { barWidth, squareSize, handleWidth, handleHeight, handleOffsetX }
} = config

export const Container = styled.div`
  width: 550px;
  height: 340px;
  display: grid;
  grid-template-rows: 25px 1fr;
  border: 1px solid #4d4d4d;
  border-top: 0;
  background: #ffffff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5), -2px -2px 10px rgba(0, 0, 0, 0.5);
`

export const TitleBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 40px;
  background: #4d4d4d;
  .left {
    display: grid;
    grid-template-columns: 25px 1fr;
    align-items: center;
    .icon {
      width: 100%;
      height: 100%;
      display: grid;
      align-items: center;
      justify-items: center;
      svg {
        width: 20px;
        height: 20px;
      }
    }
    .text {
      padding-left: 5px;
      font-size: 1.2rem;
      color: white;
    }
  }
  .right {
    align-self: center;
    justify-self: center;
    width: 90%;
    height: 90%;
    display: grid;
    justify-items: center;
    align-items: center;
    &:hover {
      background: #eb3737;
    }
    svg {
      width: 12px;
      height: 12px;
    }
  }
`

export const Main = styled.div`
  display: grid;
  grid-template-columns: 310px 45px 40px 1fr;
  background: #ffffff;
  padding-top: 5px;
  .square {
    display: grid;
    justify-items: center;
  }
  .alpha {
    display: grid;
    justify-items: flex-start;
  }
  .hue {
    display: grid;
    justify-items: flex-start;
  }
  .controls {
    display: grid;
    grid-template-rows: 20px repeat(4, 40px) 1px 40px 1fr 40px;
    align-items: center;
    .divider {
      height: 1px;
      background: ${p => p.theme.grey[5]};
    }
    .buttons {
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      justify-items: center;
      background: ${p => p.theme.grey[0]};
    }
  }
`

export const Heading = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: ${p => darken(0.1, p.theme.primary)};
  padding-left: 5px;
`

export const ColorProperty = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  .text {
    font-size: 1.2rem;
    padding-left: 5px;
  }
  .hex {
    width: 75px;
    height: 25px;
    display: grid;
    align-items: center;
    justify-items: center;
    border: ${p => p.theme.border};
    font-size: 1.2rem;
  }
`

function createCheckerboard(color) {
  return `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(-45deg, ${color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color} 75%), linear-gradient(-45deg, transparent 75%, ${color} 75%)`
}

export const ColorDisplay = styled.div.attrs(p => ({
  style: {
    backgroundImage: createCheckerboard('#e0e0e0'),
    backgroundSize: `10px 10px`,
    backgroundPosition: `0 0, 0 5px, 5px -5px, -5px 0px`
  }
}))`
  width: 100px;
  height: 25px;
  justify-self: center;
  display: grid;
  grid-template-columns: 1fr 1fr;
  outline: ${p => p.theme.border};
  .initial {
    width: 100%;
    height: 100%;
    background: ${p => p.initial};
  }
  .current {
    width: 100%;
    height: 100%;
    background: ${p => p.current};
  }
`

export const MiniButton = styled.div`
  width: 65px;
  height: 30px;
  display: grid;
  grid-template-columns: 20px 1fr;
  justify-items: center;
  align-items: center;
  background: #fff;
  border: ${p => p.theme.border};
  &:hover {
    border: 1px solid ${p => p.theme.primary};
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    width: 15px;
    height: 15px;
  }
  .text {
    font-size: 1.2rem;
  }
`

export const Bar = styled.div`
  position: relative;
  width: ${barWidth + 'px'};
  height: ${squareSize + 'px'};
  cursor: ns-resize;
  box-shadow: -1px 1px 2px rgba(0, 0, 0, 0.5);
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
