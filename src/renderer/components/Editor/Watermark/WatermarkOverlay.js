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
  watermarkRealWidth,
  watermarkWidth,
  watermarkHeight,
  watermarkX,
  watermarkY,
  watermarkOpacity,
  setWatermarkWidth,
  setWatermarkHeight,
  setWatermarkX,
  setWatermarkY,
  setWatermarkScale
}) {
  if (show && watermarkPath && watermarkWidth && watermarkHeight) {
    return (
      <Rnd
        style={{ zIndex: 7, border: '1px dashed grey' }}
        bounds='parent'
        size={{ width: watermarkWidth, height: watermarkHeight }}
        position={{ x: watermarkX, y: watermarkY }}
        lockAspectRatio={true}
        onDrag={(e, d) => {
          setWatermarkX(d.x)
          setWatermarkY(d.y)
        }}
        onResize={(e, direction, ref, delta, position) => {
          const scale = Math.round((ref.offsetWidth / watermarkRealWidth) * 100) / 100
          setWatermarkScale(scale)
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
