import styled from 'styled-components'

export const Container = styled.textarea.attrs(p => ({
  rows: 1,
  style: {
    width: p.width + 'px'
  }
}))`
  resize: none;
  margin-left: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.2rem;
`
