export default hex => {
  const rgba = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
  var r = parseInt(rgba[1], 16) / 255
  var g = parseInt(rgba[2], 16) / 255
  var b = parseInt(rgba[3], 16) / 255
  var a = rgba[4] ? Math.ceil((parseInt(rgba[4], 16) / 255) * 100) / 100 : 1

  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  const delta = max - min
  let h
  let s

  if (max === min) {
    h = 0
  } else if (r === max) {
    h = (g - b) / delta
  } else if (g === max) {
    h = 2 + (b - r) / delta
  } else if (b === max) {
    h = 4 + (r - g) / delta
  }

  h = Math.min(h * 60, 360)

  if (h < 0) {
    h += 360
  }

  const l = (min + max) / 2

  if (max === min) {
    s = 0
  } else if (l <= 0.5) {
    s = delta / (max + min)
  } else {
    s = delta / (2 - max - min)
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100), a]
}
