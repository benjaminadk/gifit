import styled from 'styled-components'
import { lighten, darken } from 'polished'

export const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px;
  align-items: center;
  .text {
    font-size: 1.2rem;
    margin-left: 5px;
    color: ${p => darken(0.2, p.theme.primary)};
  }
  .close {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
    cursor: auto !important;
    &:hover {
      background: ${p => lighten(0.4, p.theme.primary)};
    }
    svg {
      width: 22px;
      height: 22px;
    }
  }
`

export const Bottom = styled.div`
  display: grid;
  grid-template-columns: 30px 40px 50px 20px 5px 40px 5px 30px 30px;
  align-items: center;
  cursor: auto !important;
  .label {
    justify-self: center;
    font-size: 1.1rem;
    color: ${p => p.theme.grey[10]};
  }
  .button {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
    &:hover {
      background: ${p => lighten(0.4, p.theme.primary)};
    }
    svg {
      justify-self: center;
      width: 25px;
      height: 25px;
    }
  }
  .divider {
    justify-self: center;
    width: 1px;
    height: 75%;
    background: ${p => p.theme.grey[3]};
  }
`

export const FpsDisplay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  .canvas1 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
  }
  .canvas2 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
  }
  .canvas3 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
  }
`

export const SourceSelect = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
  }
  .selected {
    width: 100%;
    height: 75%;
    display: grid;
    grid-template-columns: 25px 15px;
    justify-items: center;
    align-items: center;
    .icon {
      width: 100%;
      height: 100%;
      display: grid;
      justify-items: center;
      align-items: center;
      &:hover {
        background: ${p => lighten(0.4, p.theme.primary)};
      }
    }
    .arrow {
      width: 100%;
      height: 100%;
      display: grid;
      justify-items: center;
      align-items: center;
      &:hover {
        background: ${p => lighten(0.4, p.theme.primary)};
      }
    }
  }
  .options {
    position: absolute;
    top: 42px;
    left: 0;
    width: 100px;
    height: 60px;
    display: ${p => (p.show ? 'grid' : 'none')};
    grid-template-rows: 1fr 1fr;
    background: #ffffff;
    outline: 1px solid ${p => p.theme.grey[3]};
    .option {
      display: grid;
      grid-template-columns: 30px 1fr;
      align-items: center;
      border: 1px solid transparent;
      &:hover {
        background: ${p => lighten(0.4, p.theme.primary)};
        border: 1px solid ${p => p.theme.primary};
      }
      svg {
        justify-self: center;
      }
      .text {
        font-size: 1.4rem;
      }
    }
  }
`
