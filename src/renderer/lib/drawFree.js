// calculate the distance between two points
function distanceBetween(p1, p2) {
  return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
}
// calculate the angle in radians between two points
function angleBetween(p1, p2) {
  return Math.atan2(p2[0] - p1[0], p2[1] - p1[1])
}

export default (
  canvas3,
  canvas4,
  drawXY,
  x,
  y,
  drawHighlight,
  drawShape,
  drawPenColor,
  drawPenWidth,
  drawPenHeight
) => {
  const dist = distanceBetween(drawXY, [x, y])
  const angle = angleBetween(drawXY, [x, y])
  const ctx3 = canvas3.getContext('2d')
  const ctx4 = canvas4.getContext('2d')
  // fill in extra points
  for (var i = 0; i < dist; i += 5) {
    let x1 = drawXY[0] + Math.sin(angle) * i
    let y1 = drawXY[1] + Math.cos(angle) * i
    // draw to highlight layer
    if (drawHighlight) {
      ctx3.fillStyle = drawPenColor
      if (drawShape === 'rectangle') {
        ctx3.fillRect(x1 - drawPenWidth / 2, y1 - drawPenHeight / 2, drawPenWidth, drawPenHeight)
      } else if (drawShape === 'ellipsis') {
        ctx3.beginPath()
        ctx3.ellipse(
          x1 - drawPenWidth / 2,
          y1 - drawPenHeight / 2,
          drawPenWidth / 2,
          drawPenHeight / 2,
          0,
          0,
          Math.PI * 2
        )
        ctx3.fill()
      }
      // draw to pen layer
    } else {
      ctx4.fillStyle = drawPenColor
      if (drawShape === 'rectangle') {
        ctx4.fillRect(x1 - drawPenWidth / 2, y1 - drawPenHeight / 2, drawPenWidth, drawPenHeight)
      } else if (drawShape === 'ellipsis') {
        ctx4.beginPath()
        ctx4.ellipse(
          x1 - drawPenWidth / 2,
          y1 - drawPenHeight / 2,
          drawPenWidth / 2,
          drawPenHeight / 2,
          0,
          0,
          Math.PI * 2
        )
        ctx4.fill()
      }
    }
  }
}
