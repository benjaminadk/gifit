import { format } from 'date-fns'

export default () => {
  return format(new Date(), 'yyyy-MM-dd HH-mm-ss')
}
