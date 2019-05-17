import styled from 'styled-components'
import { lighten } from 'polished'

export const Container = styled.div.attrs(p => ({
  style: {
    height: p.thumbHeight ? p.thumbHeight + 40 + 'px' : '100px'
  }
}))`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100vw;
  display: grid;
  grid-template-columns: ${p => `repeat(${p.columns}, ${p.thumbWidth + 10}px)`};
  overflow-y: auto;
  border-top: ${p => p.theme.border};
  padding-top: 2px;
`

export const Thumbnail = styled.div.attrs(p => ({
  style: {
    width: '100%',
    height: '100%',
    background: p.selected ? lighten(0.4, p.theme.primary) : 'transparent',
    border: `1px solid ${p.selected ? p.theme.primary : 'transparent'}`
  }
}))`
  display: grid;
  grid-template-rows: ${p => p.thumbHeight + 'px'} 1fr;
  img {
    justify-self: center;
    align-self: center;
    width: ${p => p.thumbWidth + 'px'};
    height: ${p => p.thumbHeight + 'px'};
    padding-top: 2px;
    box-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1);
  }
  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 1.1rem;
    .index {
      align-self: center;
      justify-self: center;
    }
    .time {
      align-self: center;
      justify-self: center;
      font-style: italic;
    }
  }
`
