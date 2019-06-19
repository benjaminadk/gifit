import React, { useState } from 'react'
import { shell } from 'electron'
import PopupMenu from '../../Shared/PopupMenu'
import Svg from '../../Svg'
import { Container, Thumbnail } from './styles'

export default function Thumbnails({
  thumbnail,
  thumbWidth,
  thumbHeight,
  containerWidth,
  containerHeight,
  selected,
  images,
  imageIndex,
  hashModifier,
  onClick,
  onThumbnailExportImage
}) {
  const [position, setPosition] = useState([])

  function onContextMenu(e) {
    var x, y

    if (containerWidth - e.clientX <= 130) {
      x = e.clientX - 130
    } else {
      x = e.clientX
    }

    if (containerHeight - e.clientY <= 80) {
      y = e.clientY - 80
    } else {
      y = e.clientY
    }

    setPosition([x, y])
  }

  function onOpenImage() {
    setPosition([])
    shell.openExternal(images[imageIndex].path)
  }

  function onExploreFolder() {
    setPosition([])
    shell.showItemInFolder(images[imageIndex].path)
  }

  function onExportImage() {
    setPosition([])
    onThumbnailExportImage()
  }

  const menuItems = [
    {
      icon: <Svg name='image' />,
      label: 'Open Image',
      click: onOpenImage
    },
    {
      icon: <Svg name='folder' />,
      label: 'Explore Folder',
      click: onExploreFolder
    },
    { icon: <Svg name='save' />, label: 'Export Image', click: onExportImage }
  ]

  return (
    <>
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
                <img src={el.path + hashModifier} />
                <div className='bottom'>
                  <div className='index'>{i + 1}</div>
                  <div className='time'>{el.time}ms</div>
                </div>
              </Thumbnail>
            ))
          : null}
      </Container>
      <PopupMenu
        width={125}
        rows={3}
        position={position}
        menuItems={menuItems}
        onClose={() => setPosition([])}
      />
    </>
  )
}
