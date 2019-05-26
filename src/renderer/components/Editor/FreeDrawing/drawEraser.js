export default (canvas, x, y, drawEraserWidth, drawEraserHeight) => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#FFC2D4'
  ctx.fillRect(x - drawEraserWidth / 2, y - drawEraserHeight / 2, drawEraserWidth, drawEraserHeight)
  ctx.strokeStyle = '#FFBE1A'
  ctx.strokeRect(
    x - drawEraserWidth / 2,
    y - drawEraserHeight / 2,
    drawEraserWidth,
    drawEraserHeight
  )
}
