export default (canvas, titleVertical, titleHorizontal, titleSize, titleText, scale) => {
  const ctx = canvas.getContext('2d')
  var x
  var y

  if (titleVertical === 'Top') {
    y = 0 + (titleSize * scale) / 2
  } else if (titleVertical === 'Center') {
    y = canvas.height / 2
  } else if (titleVertical === 'Bottom') {
    y = canvas.height - (titleSize * scale) / 2
  }

  if (titleHorizontal === 'Left') {
    x = 0
  } else if (titleHorizontal === 'Center') {
    x = canvas.width / 2 - ctx.measureText(titleText).width / 2
  } else if (titleHorizontal === 'Right') {
    x = canvas.width - ctx.measureText(titleText).width
  }

  return { x, y }
}
