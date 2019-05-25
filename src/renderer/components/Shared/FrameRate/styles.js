import styled from 'styled-components'

export const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 40px 50px 20px;
  align-items: center;
`

export const Display = styled.div`
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

export const Label = styled.div`
  justify-self: center;
  font-size: 1.1rem;
  color: ${p => p.theme.grey[10]};
`
