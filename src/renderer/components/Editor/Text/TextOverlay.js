import React, { useRef, useEffect } from 'react'
import { Rnd } from 'react-rnd'

export default function TextOverlay({
  show,
  textText,
  textFont,
  textStyle,
  textSize,
  textColor,
  textWidth,
  textHeight,
  textX,
  textY,
  setTextWidth,
  setTextHeight,
  setTextX,
  setTextY
}) {
  const canvas = useRef(null)

  useEffect(() => {
    if (show) {
      const ctx = canvas.current.getContext('2d')
      ctx.font = `${textStyle} ${textSize}px ${textFont}`

      const textArray = textText.split('\n')

      var longest = 0
      var longestIndex
      for (const [i, text] of textArray.entries()) {
        const len = text.length
        if (len > longest) {
          longestIndex = i
          longest = len
        }
      }

      const width = Math.ceil(ctx.measureText(textArray[longestIndex]).width)
      canvas.current.width = width
      canvas.current.height = textSize * textArray.length

      setTextWidth(width + 5)
      setTextHeight(textSize * textArray.length + 5)

      ctx.textBaseline = 'top'
      ctx.fillStyle = textColor
      ctx.font = `${textStyle} ${textSize}px ${textFont}`

      for (const [i, text] of textArray.entries()) {
        ctx.fillText(text, 0, i * textSize)
      }
    }
  }, [show, textText, textStyle, textSize, textFont, textColor])

  if (show) {
    return (
      <Rnd
        style={{
          zIndex: 7,
          display: 'grid',
          alignItems: 'center',
          justifyItems: 'center',
          border: '2px dashed lightgrey'
        }}
        bounds='parent'
        size={{ width: textWidth, height: textHeight }}
        position={{ x: textX, y: textY }}
        onDrag={(e, d) => {
          setTextX(d.x)
          setTextY(d.y)
        }}
        enableResizing={false}
        minWidth={20}
        minHeight={20}
      >
        <canvas ref={canvas} />
      </Rnd>
    )
  } else {
    return null
  }
}
