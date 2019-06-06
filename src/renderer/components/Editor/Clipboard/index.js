import React, { useState } from 'react'
import { shell } from 'electron'
import path from 'path'
import Svg from '../../Svg'
import PopupMenu from '../../Shared/PopupMenu'
import { List, Item, Radios } from './styles'
import { Header, Main, Section } from '../Drawer/styles'
import config from 'common/config'

const {
  editor: { drawerWidth }
} = config

export default function Clipboard({
  drawerHeight,
  clipboardDirectory,
  clipboardItems,
  clipboardIndex,
  clipboardPaste,
  setClipboardItems,
  setClipboardIndex,
  setClipboardPaste,
  onCancel
}) {
  const [position, setPosition] = useState([])
  const [menuIndex, setMenuIndex] = useState(null)

  function onContextMenu(e, i) {
    var x, y
    const { layerX } = e.nativeEvent
    x = layerX > drawerWidth - 125 ? layerX - 125 : layerX
    y = i * 30 + 75
    setPosition([x, y])
    setMenuIndex(i)
  }

  function onExploreFolder() {
    setPosition([])
    shell.showItemInFolder(path.join(clipboardDirectory, menuIndex))
  }

  function onRemove() {
    setPosition([])
    setClipboardItems(clipboardItems.delete(menuIndex))
    setClipboardIndex(menuIndex === clipboardItems.size - 1 ? menuIndex - 1 : menuIndex)
  }

  const menuItems = [
    { icon: <Svg name='paste' />, label: 'Clipboard Entry', click: () => {} },
    { icon: <Svg name='folder' />, label: 'Explore Folder', click: onExploreFolder },
    { icon: <Svg name='close' />, label: 'Remove', click: onRemove }
  ]

  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='paste' />
          <div className='text'>Clipboard</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={drawerHeight - 30}>
          <div className='title'>
            <div className='text'>Clipboard Entries</div>
            <div className='divider' />
          </div>
          <div>
            <List>
              {clipboardItems.map((el, i) => (
                <Item
                  key={i}
                  selected={i === clipboardIndex}
                  onClick={() => setClipboardIndex(i)}
                  onContextMenu={e => onContextMenu(e, i)}
                >
                  <Svg name={el.items.length === 1 ? 'image' : 'copy'} />
                  <div>
                    {el.items.length} Image{el.items.length === 1 ? '' : 's'}
                  </div>
                  <div className='time'>{el.time}</div>
                  <Svg name='check' className='check' />
                </Item>
              ))}
            </List>
          </div>
        </Section>
      </Main>
      <Section style={{ transform: 'translateY(-15px)' }} height={70}>
        <div className='title'>
          <div className='text'>Paste Behavior</div>
          <div className='divider' />
        </div>
        <Radios>
          <div className='option' onClick={() => setClipboardPaste('before')}>
            <Svg name={clipboardPaste === 'before' ? 'radio-true' : 'radio-false'} />
            <div>Before selected frame</div>
          </div>
          <div className='option' onClick={() => setClipboardPaste('after')}>
            <Svg name={clipboardPaste === 'after' ? 'radio-true' : 'radio-false'} />
            <div>After selected frame</div>
          </div>
        </Radios>
      </Section>
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
