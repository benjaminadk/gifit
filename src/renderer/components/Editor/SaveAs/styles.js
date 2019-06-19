import styled from 'styled-components'
import { lighten } from 'polished'

export const Encoders = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  .divider {
    width: 1px;
    height: 14px;
    background: ${p => p.theme.grey[4]};
    margin-left: 1px;
    margin-right: 1px;
  }
`

export const Encoder = styled.div`
  font-size: 1.2rem;
  padding: 4px 4px;
  background: ${p => (p.selected ? lighten(0.35, p.theme.primary) : 'transparent')};
  &:hover {
    background: ${p =>
      p.selected ? lighten(0.35, p.theme.primary) : lighten(0.4, p.theme.primary)};
  }
`

export const RepeatCount = styled.div`
  display: flex;
  align-items: center;
  margin-left: 25px;
  margin-bottom: 10px;
`

export const PathInput = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 5px;
  input {
    width: 100%;
    border: 1px solid ${p => p.theme.grey[5]};
    padding: 2px;
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
  .top {
    justify-self: center;
    width: 95%;
    display: grid;
    grid-template-columns: 1fr 30px;
    grid-gap: 2px;
  }
  .bottom {
    justify-self: center;
    width: 95%;
    display: grid;
    justify-items: center;
    grid-template-columns: 1fr 70px 30px 30px;
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

export const Warning = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  margin-top: 5px;
  svg {
    justify-self: center;
    width: 20px;
    height: 20px;
  }
  .text {
    font-size: 1.1rem;
    font-style: italic;
    text-decoration: underline;
    color: blue;
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
`
