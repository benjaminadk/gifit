import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 50px;
  .main {
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 5px;
    .menu {
      display: grid;
      grid-template-rows: repeat(10, 30px);
      grid-gap: 2px;
      align-items: center;
    }
    .content {
    }
  }
  .bottom {
    display: grid;
    justify-items: flex-end;
    align-items: center;
    background: ${p => p.theme.grey[0]};
    padding-right: 10px;
  }
`

export const MenuItem = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 25px 1fr;
  align-items: center;
  background: ${p => (p.selected ? lighten(0.4, p.theme.primary) : 'transparent')};
  border: ${p => (p.selected ? p.theme.border : '1px solid transparent')};
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
    border: 1px solid ${p => p.theme.primary};
  }
  svg {
    justify-self: center;
    width: 20px;
    height: 20px;
  }
  .text {
    font-size: 1.6rem;
  }
`

export const Application = styled.div``

export const Section = styled.div`
  height: ${p => p.height}px;
  display: grid;
  grid-template-rows: 20px 1fr;
  .title {
    display: flex;
    .text {
      font-size: 1.2rem;
      white-space: nowrap;
      margin-left: 3px;
      margin-right: 3px;
    }
    .divider {
      width: 100%;
      height: 1px;
      background: ${p => p.theme.grey[2]};
      margin-top: 7px;
    }
  }
  .content {
    padding: 5px 10px;
  }
`

export const CountdownSize = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  margin-left: 30px;
  .text {
    font-size: 1.2rem;
    color: ${p => p.theme.grey[5]};
  }
`

export const PathInput = styled.div`
  display: grid;
  grid-template-rows: 20px 1fr;
  .title {
    display: flex;
    .text {
      font-size: 1.2rem;
      white-space: nowrap;
      margin-left: 3px;
      margin-right: 3px;
    }
    .divider {
      width: 100%;
      height: 1px;
      background: ${p => p.theme.grey[2]};
      margin-top: 7px;
    }
  }
  .input {
    display: grid;
    grid-template-columns: 1fr 30px;
    align-items: center;
    input {
      width: 98%;
      border: 1px solid ${p => p.theme.grey[5]};
      padding: 2px;
      margin-left: 10px;
      font-size: 1.2rem;
      &:hover {
        border: 1px solid ${p => lighten(0.2, p.theme.primary)};
      }
      &:focus {
        background: ${p => p.theme.grey[0]};
        border: 1px solid ${p => lighten(0.1, p.theme.primary)};
      }
      &::selection {
        background: ${p => p.theme.primary};
        color: #fff;
      }
    }
    svg {
      justify-self: center;
      width: 25px;
      height: 25px;
    }
  }
`
