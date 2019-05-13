import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 40px 1fr;
  .top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    .title {
      font-size: 2.4rem;
    }
    .options {
      justify-self: flex-end;
      display: grid;
      grid-template-columns: 20px 1fr;
      align-items: center;
      font-size: 1.4rem;
      padding: 10px 5px;
      &:hover {
        background: ${p => lighten(0.4, p.theme.primary)};
      }
      svg {
        width: 15px;
        height: 15px;
      }
    }
  }
  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
  }
`

export const Action = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.theme.grey[0]};
  border: ${p => p.theme.border};
  font-size: 2rem;
  &:hover {
    background: ${p => lighten(0.4, p.theme.primary)};
    border: 1px solid ${p => p.theme.primary};
  }
  svg {
    width: 30px;
    height: 30px;
  }
`
