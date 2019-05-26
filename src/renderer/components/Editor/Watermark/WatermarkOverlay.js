import React from 'react'
import { Rnd } from 'react-rnd'
import { resizeHandleStyles } from './styles'
import styled from 'styled-components'

export const WatermarkImage = styled.img.attrs(p => ({
  style: {
    opacity: p.opacity
  }
}))``

export default function WatermarkOverlay({
  show,
  watermarkPath,
  watermarkWidth,
  watermarkHeight,
  watermarkX,
  watermarkY,
  watermarkOpacity,
  setWatermarkWidth,
  setWatermarkHeight,
  setWatermarkX,
  setWatermarkY
}) {
  if (show && watermarkPath && watermarkWidth && watermarkHeight) {
    return (
      <Rnd
        style={{ zIndex: 7, border: '1px dashed grey' }}
        bounds='parent'
        size={{ width: watermarkWidth, height: watermarkHeight }}
        position={{ x: watermarkX, y: watermarkY }}
        onDrag={(e, d) => {
          setWatermarkX(d.x)
          setWatermarkY(d.y)
        }}
        onResize={(e, direction, ref, delta, position) => {
          setWatermarkWidth(ref.offsetWidth)
          setWatermarkHeight(ref.offsetHeight)
          setWatermarkX(position.x)
          setWatermarkY(position.y)
        }}
        resizeHandleStyles={resizeHandleStyles}
      >
        <WatermarkImage
          src={watermarkPath}
          width={watermarkWidth}
          height={watermarkHeight}
          opacity={watermarkOpacity}
          draggable={false}
        />
      </Rnd>
    )
  } else {
    return null
  }
}
