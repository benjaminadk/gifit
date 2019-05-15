export default (
  canvas,
  progress,
  progressBackground,
  progressHorizontal,
  progressVertical,
  progressOrientation,
  progressThickness
) => {
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = progressBackground

  var x, y, progressLength

  if (progressOrientation === 'Horizontal') {
    progressLength = canvas.width * (progress / 100)
    if (progressHorizontal === 'Left') {
      x = 0
    } else if (progressHorizontal === 'Center') {
      x = canvas.width / 2 - progressLength / 2
    } else if (progressHorizontal === 'Right') {
      x = canvas.width - progressLength
    }
    if (progressVertical === 'Top') {
      y = 0
    } else if (progressVertical === 'Center') {
      y = canvas.height / 2 - progressThickness / 2
    } else if (progressVertical === 'Bottom') {
      y = canvas.height - progressThickness
    }
    ctx.fillRect(x, y, progressLength, progressThickness)
  } else if (progressOrientation === 'Vertical') {
    progressLength = canvas.height * (progress / 100)
    if (progressHorizontal === 'Left') {
      x = 0
    } else if (progressHorizontal === 'Center') {
      x = canvas.width / 2 - progressThickness / 2
    } else if (progressHorizontal === 'Right') {
      x = canvas.width - progressThickness
    }
    if (progressVertical === 'Top') {
      y = 0
    } else if (progressVertical === 'Center') {
      y = canvas.height / 2 - progressLength / 2
    } else if (progressVertical === 'Bottom') {
      y = canvas.height - progressLength
    }
    ctx.fillRect(x, y, progressThickness, progressLength)
  }
}
