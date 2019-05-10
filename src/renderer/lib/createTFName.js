import { format } from 'date-fns'

export default () => {
  return `TF-${format(new Date(), 'HH-mm-ss')}.png`
}
