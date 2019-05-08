import React from 'react'
import { Container, Thumbnail } from './styles'

export default function Thumbnails({ thumbnail, images, imageIndex, onClick }) {
  return (
    <Container columns={images.length}>
      {images.map((el, i) => (
        <Thumbnail
          key={i}
          ref={imageIndex === i ? thumbnail : null}
          selected={imageIndex === i}
          onClick={e => onClick(e, i)}
        >
          <img src={el.path} />
          <div className='bottom'>
            <div className='index'>{i + 1}</div>
            <div className='time'>{el.time}ms</div>
          </div>
        </Thumbnail>
      ))}
    </Container>
  )
}
