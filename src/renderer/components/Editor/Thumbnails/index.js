import React from 'react'
import { remote, shell } from 'electron'
import { Container, Thumbnail } from './styles'

export default function Thumbnails({ thumbnail, selected, images, imageIndex, onClick }) {
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
    <Container columns={images.length}>
      {images.map((el, i) => (
        <Thumbnail
          key={i}
          ref={imageIndex === i ? thumbnail : null}
          selected={selected.get(i)}
          onClick={e => onClick(e, i)}
          onContextMenu={onContextMenu}
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
