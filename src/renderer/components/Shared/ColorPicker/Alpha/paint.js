import config from 'common/config'

const {
  picker: { barWidth, squareSize, checkerSize, checkerFill }
} = config

export default (canvas, hue) => {
  const ctx = canvas.current.getContext('2d')
  ctx.clearRect(0, 0, barWidth, squareSize)

  const cols = Math.round(barWidth / checkerSize)
  const rows = Math.round(squareSize / checkerSize)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols / 2; j++) {
      const x = j * checkerSize * 2 + (i % 2 ? 0 : checkerSize)
      const y = i * checkerSize
      ctx.rect(x, y, checkerSize, checkerSize)
    }
  }
  ctx.fillStyle = checkerFill
  ctx.fill()

  const gradient = ctx.createLinearGradient(0, 0, 0, squareSize)
  gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 1)`)
  gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, barWidth, squareSize)
}
