import { format } from 'date-fns'

export default (
  canvas,
  time,
  totalDuration,
  progressBackground,
  progressHorizontal,
  progressVertical,
  progressFont,
  progressSize,
  progressStyle,
  progressColor
) => {
  var x1, y1, x2, y2
  const paddingX = 20
  const paddingY = progressSize < 30 ? 5 : 10
  const text = `${time}/${format(new Date(totalDuration), 's.SS')} s`
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'middle'

  ctx.font = `${progressStyle} ${progressSize}px ${progressFont}`
  const progressWidth = ctx.measureText(text).width + paddingX

  ctx.fillStyle = progressBackground

  if (progressHorizontal === 'Left') {
    x1 = 0
    x2 = x1 + paddingX / 2
  } else if (progressHorizontal === 'Center') {
    x1 = canvas.width / 2 - progressWidth / 2
    x2 = x1 + paddingX / 2
  } else if (progressHorizontal === 'Right') {
    x1 = canvas.width - progressWidth
    x2 = x1 + paddingX / 2
  }

  if (progressVertical === 'Top') {
    y1 = 0
    y2 = 0 + progressSize / 2 + paddingY / 2
  } else if (progressVertical === 'Center') {
    y1 = canvas.height / 2 - progressSize / 2
    y2 = canvas.height / 2 + paddingY / 2
  } else if (progressVertical === 'Bottom') {
    y1 = canvas.height - progressSize - paddingY
    y2 = canvas.height - progressSize / 2
  }
  console.log(progressSize, paddingY)
  ctx.fillRect(x1, y1, progressWidth, progressSize + paddingY)

  ctx.fillStyle = progressColor
  ctx.fillText(text, x2, y2)
}
