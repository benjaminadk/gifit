import React, { useEffect } from 'react'
import { Container } from './styles'

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
