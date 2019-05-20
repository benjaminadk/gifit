// calculate the distance between two points
function distanceBetween(p1, p2) {
  return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
}
// calculate the angle in radians between two points
function angleBetween(p1, p2) {
  return Math.atan2(p2[0] - p1[0], p2[1] - p1[1])
}

export default (canvas3, canvas4, drawXY, x, y, drawEraserWidth, drawEraserHeight) => {
  const dist = distanceBetween(drawXY, [x, y])
  const angle = angleBetween(drawXY, [x, y])
  const ctx3 = canvas3.getContext('2d')
  const ctx4 = canvas4.getContext('2d')

  for (var i = 0; i < dist; i += 5) {
    let x1 = drawXY[0] + Math.sin(angle) * i
    let y1 = drawXY[1] + Math.cos(angle) * i
    ctx3.clearRect(
      x1 - drawEraserWidth / 2,
      y1 - drawEraserHeight / 2,
      drawEraserWidth,
      drawEraserHeight
    )
    ctx4.clearRect(
      x1 - drawEraserWidth / 2,
      y1 - drawEraserHeight / 2,
      drawEraserWidth,
      drawEraserHeight
    )
  }
}
