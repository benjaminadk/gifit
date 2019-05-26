export default (canvas, x, y, drawShape, drawPenColor, drawPenWidth, drawPenHeight) => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = drawPenColor
  if (drawShape === 'rectangle') {
    ctx.fillRect(x - drawPenWidth / 2, y - drawPenHeight / 2, drawPenWidth, drawPenHeight)
  } else if (drawShape === 'ellipsis') {
    ctx.beginPath()
    ctx.ellipse(
      x - drawPenWidth / 2,
      y - drawPenHeight / 2,
      drawPenWidth / 2,
      drawPenHeight / 2,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }
}
