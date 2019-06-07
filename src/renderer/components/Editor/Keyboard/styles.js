import styled from 'styled-components'
import { lighten } from 'polished'

export const KeyStrokes = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  .button {
    width: 160px;
    height: 30px;
    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: center;
    background: #ffffff;
    border: ${p => p.theme.border};
    &:hover {
      border: 1px solid ${p => p.theme.primary};
      background: ${p => lighten(0.4, p.theme.primary)};
    }
    svg {
      justify-self: center;
      width: 15px;
      height: 15px;
    }
    .text {
      font-size: 1.2rem;
    }
  }
`

export const Container = styled.div`
  width: 400px;
  height: 500px;
  display: grid;
  grid-template-rows: 25px 1fr 50px;
  background: #ffffff;
  border: 1px solid #4d4d4d;
  border-top: 0;
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
  padding: 5px;
`

export const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 120px;
  align-items: center;
  justify-items: center;
  background: ${p => p.theme.grey[1]};
`

export const Button = styled.div`
  width: ${p => p.width}px;
  height: 35px;
  display: grid;
  grid-template-columns: 40px 1fr;
  justify-items: center;
  align-items: center;
  background: #fff;
  border: ${p => p.theme.border};
  &:hover {
    border: 1px solid ${p => p.theme.primary};
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    width: 25px;
    height: 25px;
  }
  .text {
    font-size: 1.2rem;
  }
`
