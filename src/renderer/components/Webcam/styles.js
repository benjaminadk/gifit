import styled from 'styled-components'

export const Container = styled.div.attrs(p => ({}))`
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr 50px;
`

export const Video = styled.video.attrs(p => ({
  width: p.width,
  height: p.height
}))`
  object-fit: contain;
`

export const Controls = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px 60px 60px;
`

export const Action = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  .text {
    font-size: 1.2rem;
  }
  svg {
    width: 15px;
    height: 15px;
  }
`
