import styled from 'styled-components'
import { lighten, darken } from 'polished'

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 20px;
  display: grid;
  grid-template-columns: 250px 1fr 80px 75px 200px;
  justify-items: center;
  align-items: center;
  background: ${p => p.theme.grey[1]};
  border-top: 2px solid #fff;
`

export const Progress = styled.div`
  width: 200px;
  height: 10px;
  visibility: ${p => (p.show ? 'visible' : 'hidden')};
  border: 1px solid ${p => p.theme.grey[5]};
  background: #fff;
`

export const Bar = styled.div.attrs(p => ({
  style: {
    width: p.value + '%'
  }
}))`
  height: 100%;
  background: ${p => p.theme.primary};
`

export const Message = styled.div`
  visibility: ${p => (p.show ? 'visible' : 'hidden')};
  display: grid;
  grid-template-columns: 25px 1fr;
  svg {
    width: 15px;
    height: 15px;
  }
  .text {
    font-size: 1.3rem;
    color: ${darken(0.2, '#00FF00')};
  }
`

export const ZoomInput = styled.div`
  visibility: ${p => (p.show ? 'visible' : 'hidden')};
  display: grid;
  grid-template-columns: 5px 15px 25px 20px 15px;
  align-items: center;
  .divider {
    width: 1px;
    height: 12px;
    background: ${p => p.theme.grey[5]};
  }
  svg {
    width: 15px;
    height: 15px;
  }
  input {
    font-size: 1.2rem;
    text-align: center;
    background: ${p => p.theme.grey[1]};
    &::selection {
      background: ${p => p.theme.primary};
      color: #fff;
    }
  }
  .arrows {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 1fr;
    .arrow {
      width: 100%;
      height: 100%;
      display: grid;
      align-items: center;
      justify-items: center;
      line-height: 0.75;
      &:hover {
        background: ${p => p.theme.grey[2]};
      }
    }
  }
  .label {
    font-size: 1.2rem;
  }
`

export const Stats = styled.div`
  width: 100%;
  visibility: ${p => (p.show ? 'visible' : 'hidden')};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-left: ${p => p.theme.border};
  border-right: ${p => p.theme.border};
`

export const Stat = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  color: ${p => darken(0.1, p.color)};
  font-size: 1.2rem;
`

export const Playback = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 40px);
  .icon {
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
    &:hover {
      background: ${p => lighten(0.4, p.theme.primary)};
    }
  }
  svg {
    width: 15px;
    height: 15px;
  }
`
