import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div`
  display: grid;
  grid-template-rows: 40px 1fr;
  .header {
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    align-items: center;
    font-size: 1.8rem;
    background: ${p => p.theme.grey[1]};
    color: ${p => p.theme.primary};
    .icon {
      width: 100%;
      height: 100%;
      display: grid;
      align-items: center;
      justify-items: center;
      svg {
        width: 30px;
        height: 30px;
      }
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
      width: 30px;
      height: 30px;
    }
  }
  .content {
    height: 100%;
    overflow-y: auto;
  }
`

export const ProgressItem = styled.div`
  width: 100%;
  height: 35px;
  display: grid;
  grid-template-columns: 40px 30px 1fr;
  align-items: center;
  svg {
    justify-self: center;
    width: 30px;
    height: 30px;
  }
  .percent {
    justify-self: center;
    font-size: 1.2rem;
    color: ${p => p.theme.grey[5]};
  }
  .right {
    display: grid;
    grid-template-rows: 1fr 1fr;
    font-size: 1.2rem;
  }
  .bar {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
  }
`

export const BarWrapper = styled.div`
  position: relative;
  width: 98%;
  height: 5px;
  border: ${p => p.theme.border};
`

export const Bar = styled.div.attrs(p => ({
  style: {
    width: p.progress + '%'
  }
}))`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: ${p => p.theme.secondary};
`

export const Item = styled.div`
  width: 100%;
  height: 35px;
  display: grid;
  grid-template-columns: 40px 60px 1fr 30px 30px;
  align-items: center;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${p => p.theme.primary};
    background: ${p => lighten(0.45, p.theme.primary)};
  }
  .check {
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
  .size {
    font-size: 1.2rem;
    color: ${p => p.theme.grey[5]};
  }
  .completed {
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
    svg {
      width: 20px;
      height: 20px;
    }
  }
`
