import styled from 'styled-components'

export const Container = styled.div.attrs(p => ({
  style: {
    right: p.show ? '0' : `-${p.width}px`
  }
}))`
  position: absolute;
  top: 100px;
  bottom: 100px;
  width: ${p => p.width}px;
  border-left: ${p => p.theme.border};
  transition: right 0.5s;
`
