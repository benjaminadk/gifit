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
