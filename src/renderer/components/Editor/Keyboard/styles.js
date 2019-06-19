import styled from 'styled-components'
import { lighten, darken } from 'polished'

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

export const Table = styled.div`
  height: 415px;
  border: ${p => p.theme.border};
  margin: 5px;
  .header {
    display: grid;
    grid-template-columns: 100px 1fr;
    font-size: 1.2rem;
    border-bottom: ${p => p.theme.border};
    .left {
      height: 20px;
      display: grid;
      align-items: center;
      background: ${p => darken(0.2, p.theme.primary)};
      color: #fff;
      border-right: ${p => p.theme.border};
      padding-left: 2px;
    }
    .right {
      height: 20px;
      display: grid;
      align-items: center;
      background: ${p => darken(0.2, p.theme.primary)};
      color: #fff;
      padding-left: 2px;
    }
  }
  .content {
    height: 390px;
    overflow-y: auto;
  }
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  font-size: 1.2rem;
  border-bottom: ${p => p.theme.border};
  background: ${p => (p.selected ? p.theme.grey[8] : 'transparent')};
  color: ${p => (p.selected ? '#FFF' : '#000')};
  &:nth-child(odd) {
    background: ${p => (p.selected ? p.theme.grey[8] : lighten(0.4, p.theme.primary))};
  }
  .left {
    height: 25px;
    display: grid;
    align-items: center;
    border-right: ${p => p.theme.border};
    padding-left: 2px;
  }
  .right {
    height: 25px;
    display: grid;
    align-items: center;
    padding-left: 2px;
  }
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
