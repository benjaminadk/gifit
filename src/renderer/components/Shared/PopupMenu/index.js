import React from 'react'
import { Backdrop, Container, Menu, MenuItem } from './styles'

export default function PopupMenu({ width, rows, position, menuItems, onClose }) {
  return (
    <>
      <Backdrop show={position.length} onClick={onClose} />
      <Container
        show={position.length}
        top={position.length && position[1]}
        left={position.length && position[0]}
      >
        <Menu width={width} rows={rows}>
          {menuItems.map((el, i) => (
            <MenuItem
              key={i}
              inactive={el.label === 'Clipboard Entry'}
              onClick={e => el.click(e, i)}
            >
              {el.icon}
              <div className='text'>{el.label}</div>
            </MenuItem>
          ))}
        </Menu>
      </Container>
    </>
  )
}
