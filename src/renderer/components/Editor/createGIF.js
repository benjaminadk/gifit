import { remote } from 'electron'
import { spawn } from 'child_process'
import { writeFile } from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify()

export default frames => {
  let str = ''
  frames.forEach(el => {})
}
