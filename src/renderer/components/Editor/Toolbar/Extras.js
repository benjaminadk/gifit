import React, { useState, useRef } from 'react'
import PopupMenu from '../../Shared/PopupMenu'
import Svg from '../../Svg'
import { ExtrasWrapper } from './styles'

export default function Extras({ onOptionsClick }) {
  const [position, setPosition] = useState([])

  const container = useRef(null)

  function onShowMenu(e) {
    const { offsetLeft } = container.current
    setPosition([offsetLeft - 60, 30])
  }

  function onOptionsOpen() {
    setPosition([])
    onOptionsClick()
  }

  const menuItems = [
    { icon: <Svg name='settings' />, label: 'Options', click: onOptionsOpen },
    { icon: <Svg name='window' />, label: 'Feedback', click: () => {} },
    { icon: <Svg name='warning' />, label: 'Troubleshoot', click: () => {} },
    { icon: <Svg name='info' />, label: 'Help', click: () => {} }
  ]

  return (
    <>
      <ExtrasWrapper ref={container} onClick={onShowMenu}>
        <Svg name='editor' />
        <div className='text'>Extras</div>
      </ExtrasWrapper>
      <PopupMenu
        width={125}
        rows={4}
        position={position}
        menuItems={menuItems}
        onClose={() => setPosition([])}
      />
    </>
  )
}
