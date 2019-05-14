import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 20px;
  display: grid;
  grid-template-columns: 250px 1fr 75px 200px;
  justify-items: center;
  align-items: center;
  background: ${p => p.theme.grey[1]};
  border-top: 2px solid #fff;
`

export const Progress = styled.div`
  width: 200px;
  height: 10px;
  visibility: ${p => (p.show ? 'visible' : 'hidden')};
  border: 1px solid ${p => p.theme.grey[5]};
  background: #fff;
`

export const Bar = styled.div.attrs(p => ({
  style: {
    width: p.value + '%'
  }
}))`
  height: 100%;
  background: ${p => p.theme.primary};
`

export const Numbers = styled.div`
  width: 100%;
  visibility: ${p => (p.show ? 'visible' : 'hidden')};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-left: ${p => p.theme.border};
  border-right: ${p => p.theme.border};
`

export const Number = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  color: ${p => darken(0.1, p.color)};
  font-size: 1.2rem;
`

export const Playback = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 40px);
  .icon {
    display: grid;
    justify-items: center;
    align-items: center;
  }
  svg {
    width: 15px;
    height: 15px;
  }
`
