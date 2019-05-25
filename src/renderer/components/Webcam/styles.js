import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div.attrs(p => ({
  style: {
    width: p.width + 'px',
    height: p.height + 'px'
  }
}))`
  overflow: hidden !important;
  display: grid;
  grid-template-rows: 1fr 40px;
`

export const Video = styled.video`
  object-fit: contain;
`

export const Controls = styled.div.attrs(p => ({
  style: {
    width: p.width + 'px'
  }
}))`
  height: 40px;
  display: grid;
  grid-template-columns: 1fr 30px 30px 110px 70px 60px;
  align-items: center;
  overflow: hidden;
  .count {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
    font-size: 1.2rem;
  }
  .action {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
    &:hover {
      background: ${p => lighten(0.4, p.theme.primary)};
    }
  }
  svg {
    width: 25px;
    height: 25px;
  }
`

export const Action = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  .icon {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
    svg {
      width: 25px;
      height: 25px;
    }
  }
  .text {
    font-size: 1.1rem;
  }
`
