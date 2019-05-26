export default (canvas, left, right, top, bottom, color) => {
  const ctx = canvas.getContext('2d')
  ctx.strokeStyle = color

  if (left) {
    ctx.beginPath()
    ctx.lineWidth = left
    ctx.moveTo(left / 2, 0)
    ctx.lineTo(left / 2, canvas.height)
    ctx.stroke()
  }

  if (right) {
    ctx.beginPath()
    ctx.lineWidth = right
    ctx.moveTo(canvas.width - right / 2, 0)
    ctx.lineTo(canvas.width - right / 2, canvas.height)
    ctx.stroke()
  }

  if (top) {
    ctx.beginPath()
    ctx.lineWidth = top
    ctx.moveTo(0, top / 2)
    ctx.lineTo(canvas.width, top / 2)
    ctx.stroke()
  }

  if (bottom) {
    ctx.beginPath()
    ctx.lineWidth = bottom
    ctx.moveTo(0, canvas.height - bottom / 2)
    ctx.lineTo(canvas.width, canvas.height - bottom / 2)
    ctx.stroke()
  }
}
