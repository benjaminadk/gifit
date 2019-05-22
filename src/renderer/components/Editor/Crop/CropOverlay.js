import React from 'react'
import { Rnd } from 'react-rnd'
import { Background, resizeHandleStyles } from './styles'

export default function CropOverlay({
  drawerMode,
  gifData,
  cropWidth,
  cropHeight,
  cropX,
  cropY,
  setCropWidth,
  setCropHeight,
  setCropX,
  setCropY
}) {
  if (drawerMode === 'crop' && gifData) {
    return (
      <>
        <Rnd
          style={{ zIndex: 7 }}
          bounds='parent'
          size={{ width: cropWidth, height: cropHeight }}
          position={{ x: cropX, y: cropY }}
          onDrag={(e, d) => {
            setCropX(d.x)
            setCropY(d.y)
          }}
          onResize={(e, direction, ref, delta, position) => {
            setCropWidth(ref.offsetWidth)
            setCropHeight(ref.offsetHeight)
            setCropX(position.x)
            setCropY(position.y)
          }}
          minWidth={100}
          minHeight={100}
          resizeHandleStyles={resizeHandleStyles}
        />
        <Background top={0} left={0} width='full' height={cropY} />
        <Background top={cropY} left={0} width={cropX} height={cropHeight} />
        <Background
          top={cropHeight + cropY}
          left={0}
          width='full'
          height={gifData.height - cropHeight - cropY}
        />
        <Background
          top={cropY}
          left={cropWidth + cropX}
          width={gifData.width - cropWidth - cropX}
          height={cropHeight}
        />
      </>
    )
  } else {
    return null
  }
}
