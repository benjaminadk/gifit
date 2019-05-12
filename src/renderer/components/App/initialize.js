import { remote, desktopCapturer, screen } from 'electron'
import { Map } from 'immutable'
import { existsSync, readFile, writeFile, mkdir } from 'fs'
import { promisify } from 'util'
import { spawnSync } from 'child_process'
import { APP_DIRECTORY, RECORDINGS_DIRECTORY, OPTIONS_PATH } from 'common/filepaths'
import config from 'common/config'

const { defaultOptions } = config

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const mkdirAsync = promisify(mkdir)

export default async () => {
  const p1 = new Promise(resolve => {
    resolve(remote.getCurrentWindow())
  })

  const p2 = new Promise(async resolve => {
    const screens = await desktopCapturer.getSources({ types: ['screen'] })
    const displays = screen.getAllDisplays()
    const sources = screens.map((el, i) => {
      return { ...el, display: displays[i] }
    })
    resolve(sources)
  })

  const p3 = new Promise(async resolve => {
    if (!existsSync(APP_DIRECTORY)) {
      await mkdirAsync(APP_DIRECTORY)
      resolve()
    }
    resolve()
  })

  const p4 = new Promise(async resolve => {
    if (!existsSync(RECORDINGS_DIRECTORY)) {
      await mkdirAsync(RECORDINGS_DIRECTORY)
      resolve()
    }
    resolve()
  })

  const p5 = new Promise(async resolve => {
    if (existsSync(OPTIONS_PATH)) {
      const data = await readFileAsync(OPTIONS_PATH)
      const options = JSON.parse(data)
      resolve(Map(options))
    } else {
      const options = defaultOptions
      await writeFileAsync(OPTIONS_PATH, JSON.stringify(options))
      resolve(Map(options))
    }
  })

  const p6 = new Promise(async resolve => {
    const where = spawnSync('where', ['ffmpeg'], { encoding: 'utf8' })
    resolve(where.stdout)
  })

  return Promise.all([p1, p2, p3, p4, p5, p6])
}
