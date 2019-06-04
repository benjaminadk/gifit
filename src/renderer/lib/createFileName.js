import { format } from 'date-fns'

export default (prefix, i) => {
  return `${prefix}-${format(new Date(), 'HH-mm-ss')}-${i}.png`
}
