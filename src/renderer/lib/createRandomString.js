import { randomBytes } from 'crypto'

export default () => randomBytes(10).toString('hex')
