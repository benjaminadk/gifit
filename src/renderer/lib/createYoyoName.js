import { format } from 'date-fns'

export default i => {
  return `YY-${format(new Date(), 'HH-mm-ss')}-${i}.png`
}
