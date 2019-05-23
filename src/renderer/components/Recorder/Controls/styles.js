import styled from 'styled-components'

export const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px;
  align-items: center;
  .text {
    font-size: 1rem;
    color: ${p => p.theme.primary};
  }
  svg {
    justify-self: center;
    width: 30px;
    height: 30px;
  }
`

export const Bottom = styled.div`
  display: grid;
  grid-template-columns: 30px 40px 50px 20px 1fr 30px 30px;
  align-items: center;
  cursor: auto !important;
  .label {
    justify-self: center;
    font-size: 1.1rem;
    color: ${p => p.theme.grey[10]};
  }
  svg {
    justify-self: center;
    width: 25px;
    height: 25px;
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
