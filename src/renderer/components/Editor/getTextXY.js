// find the starting x,y coordinates for text input
// allows for multiple lines
export default (canvas, titleVertical, titleHorizontal, titleSize, text, lines, scale) => {
  const ctx = canvas.getContext('2d')
  var x
  var y

  if (titleVertical === 'Top') {
    y = 5 + (titleSize * scale) / 2
  } else if (titleVertical === 'Center') {
    y = canvas.height / 2 - (lines * titleSize * scale) / 2
  } else if (titleVertical === 'Bottom') {
    y = canvas.height - lines * titleSize * scale + (titleSize * scale) / 2
  }

  if (titleHorizontal === 'Left') {
    x = 0
  } else if (titleHorizontal === 'Center') {
    x = canvas.width / 2 - ctx.measureText(text).width / 2
  } else if (titleHorizontal === 'Right') {
    x = canvas.width - ctx.measureText(text).width
  }

  return { x, y }
}
