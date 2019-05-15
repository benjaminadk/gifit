import { format } from 'date-fns'

export default (
  canvas,
  currentTime,
  totalDuration,
  progressBackground,
  progressHorizontal,
  progressVertical,
  progressFont,
  progressSize,
  progressStyle,
  progressColor,
  progressPrecision
) => {
  const ctx = canvas.getContext('2d')
  const paddingX = 20
  const paddingY = progressSize < 30 ? 5 : 10

  var fmt, label
  if (progressPrecision === 'Seconds') {
    fmt = 's.SS'
    label = ' s'
  } else if (progressPrecision === 'Minutes') {
    fmt = 'm:ss'
    label = ''
  } else if (progressPrecision === 'Milliseconds') {
    fmt = 'T'
    label = ' ms'
  }

  ctx.font = `${progressStyle} ${progressSize}px ${progressFont}`
  const text = `${format(new Date(currentTime), fmt)}/${format(
    new Date(totalDuration),
    fmt
  )} ${label}`
  const progressWidth = Math.round((ctx.measureText(text).width + paddingX) / 10) * 10

  var x1, y1, x2, y2

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

  ctx.fillStyle = progressBackground
  ctx.fillRect(x1, y1, progressWidth, progressSize + paddingY)

  ctx.textBaseline = 'middle'
  ctx.fillStyle = progressColor
  ctx.fillText(text, x2, y2)
}
