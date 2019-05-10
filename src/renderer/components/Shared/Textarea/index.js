import React, { useEffect } from 'react'
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
`

export default function Textarea({ textarea, width, ...rest }) {
  useEffect(() => {
    function resize() {
      textarea.current.style.height = 'auto'
      textarea.current.style.height = textarea.current.scrollHeight + 5 + 'px'
    }

    textarea.current.addEventListener('input', resize)
    resize()
    textarea.current.focus()
    return () => {
      textarea.current.removeEventListener('input', resize)
    }
  }, [])

  return <Container ref={textarea} width={width} {...rest} />
}
