import config from 'common/config'

const {
  picker: { barWidth, squareSize }
} = config

export default canvas => {
  const ctx = canvas.current.getContext('2d')
  ctx.rect(0, 0, barWidth, squareSize)
  const gradient = ctx.createLinearGradient(0, 0, 0, squareSize)
  for (let i = 0; i <= 360; i += 30) {
    gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`)
  }
  ctx.fillStyle = gradient
  ctx.fill()
}
