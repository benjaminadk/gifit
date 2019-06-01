// calculate the distance between two points
function distanceBetween(p1, p2) {
  return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
}
// calculate the angle in radians between two points
function angleBetween(p1, p2) {
  return Math.atan2(p2[0] - p1[0], p2[1] - p1[1])
}

export default (
  canvas1,
  canvas2,
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
  const ctx1 = canvas1.getContext('2d')
  const ctx2 = canvas2.getContext('2d')
  // fill in extra points
  for (var i = 0; i < dist; i += 1) {
    let x1 = drawXY[0] + Math.sin(angle) * i
    let y1 = drawXY[1] + Math.cos(angle) * i
    // draw to highlight layer
    if (drawHighlight) {
      ctx1.fillStyle = drawPenColor
      if (drawShape === 'rectangle') {
        ctx1.fillRect(x1 - drawPenWidth / 2, y1 - drawPenHeight / 2, drawPenWidth, drawPenHeight)
      } else if (drawShape === 'ellipsis') {
        ctx1.beginPath()
        ctx1.ellipse(
          x1 - drawPenWidth / 2,
          y1 - drawPenHeight / 2,
          drawPenWidth / 2,
          drawPenHeight / 2,
          0,
          0,
          Math.PI * 2
        )
        ctx1.fill()
      }
      // draw to pen layer
    } else {
      ctx2.fillStyle = drawPenColor
      if (drawShape === 'rectangle') {
        ctx2.fillRect(x1 - drawPenWidth / 2, y1 - drawPenHeight / 2, drawPenWidth, drawPenHeight)
      } else if (drawShape === 'ellipsis') {
        ctx2.beginPath()
        ctx2.ellipse(
          x1 - drawPenWidth / 2,
          y1 - drawPenHeight / 2,
          drawPenWidth / 2,
          drawPenHeight / 2,
          0,
          0,
          Math.PI * 2
        )
        ctx2.fill()
      }
    }
  }
}
