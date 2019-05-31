export default (canvas, x, y, drawEraserWidth, drawEraserHeight) => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(x - drawEraserWidth / 2, y - drawEraserHeight / 2, drawEraserWidth, drawEraserHeight)
  ctx.strokeStyle = '#000000'
  ctx.strokeRect(
    x - drawEraserWidth / 2,
    y - drawEraserHeight / 2,
    drawEraserWidth,
    drawEraserHeight
  )
}
