export default (
  canvas,
  text,
  textSize,
  textColor,
  textFont,
  textStyle,
  textBackground,
  textHorizontal,
  textVertical
) => {
  const ctx = canvas.getContext('2d')
  const paddingX = 20
  const paddingY = textSize < 30 ? 5 : 10

  ctx.font = `${textStyle} ${textSize}px ${textFont}`

  const textWidth = Math.round((ctx.measureText(text).width + paddingX) / 10) * 10

  var x1, y1, x2, y2

  if (textHorizontal === 'Left') {
    x1 = 0
    x2 = x1 + paddingX / 2
  } else if (textHorizontal === 'Center') {
    x1 = canvas.width / 2 - textWidth / 2
    x2 = x1 + paddingX / 2
  } else if (textHorizontal === 'Right') {
    x1 = canvas.width - textWidth
    x2 = x1 + paddingX / 2
  }

  if (textVertical === 'Top') {
    y1 = 0
    y2 = 0 + textSize / 2 + paddingY / 2
  } else if (textVertical === 'Center') {
    y1 = canvas.height / 2 - textSize / 2
    y2 = canvas.height / 2 + paddingY / 2
  } else if (textVertical === 'Bottom') {
    y1 = canvas.height - textSize - paddingY
    y2 = canvas.height - textSize / 2
  }

  ctx.fillStyle = textBackground
  ctx.fillRect(x1, y1, textWidth, textSize + paddingY)

  ctx.textBaseline = 'middle'
  ctx.fillStyle = textColor
  ctx.fillText(text, x2, y2)
}
