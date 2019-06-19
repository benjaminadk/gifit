import styled from 'styled-components'
import { lighten, darken } from 'polished'

export const Container = styled.div`
  width: 300px;
  height: 155px;
  display: grid;
  grid-template-rows: 25px 1fr;
  border: 1px solid #4d4d4d;
  border-top: 0;
  background: #ffffff;
  box-shadow: ${p => p.theme.modalShadow};
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
  grid-template-rows: 30px 1fr 50px;
  align-items: center;
  .text {
    font-size: 1.3rem;
    color: ${p => darken(0.1, p.theme.primary)};
    margin-left: 10px;
  }
  .content {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
  }
  .actions {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    background: ${p => p.theme.grey[0]};
  }
`

export const Button = styled.div`
  width: 80px;
  height: 35px;
  display: grid;
  grid-template-columns: 30px 1fr;
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
  .label {
    font-size: 1.4rem;
  }
`
