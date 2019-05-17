import React from 'react'
import { remote, shell } from 'electron'
import { Container, Thumbnail } from './styles'

export default function Thumbnails({
  thumbnail,
  thumbWidth,
  thumbHeight,
  selected,
  images,
  imageIndex,
  onClick
}) {
  function onContextMenu() {
    const template = [
      {
        label: 'Explore Folder',
        click: () => shell.showItemInFolder(images[imageIndex].path)
      }
    ]
    const menu = remote.Menu.buildFromTemplate(template)
    menu.popup()
  }

  return (
    <Container thumbWidth={thumbWidth} thumbHeight={thumbHeight} columns={images.length}>
      {thumbWidth
        ? images.map((el, i) => (
            <Thumbnail
              key={i}
              ref={imageIndex === i ? thumbnail : null}
              selected={selected.get(i)}
              thumbWidth={thumbWidth}
              thumbHeight={thumbHeight}
              onClick={e => onClick(e, i)}
              onContextMenu={onContextMenu}
            >
              <img src={el.path} />
              <div className='bottom'>
                <div className='index'>{i + 1}</div>
                <div className='time'>{el.time}ms</div>
              </div>
            </Thumbnail>
          ))
        : null}
    </Container>
  )
}
