import { remote, desktopCapturer, screen } from 'electron'
import { Map } from 'immutable'
import { existsSync, readFile, writeFile, mkdir } from 'fs'
import { promisify } from 'util'
import { OPTIONS_PATH, TEMP_DIRECTORY } from 'common/filepaths'
import config from 'common/config'

const { defaultOptions } = config

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const mkdirAsync = promisify(mkdir)

export default async () => {
  const p1 = new Promise(resolve => {
    resolve(remote.getCurrentWindow().id)
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
    if (!existsSync(TEMP_DIRECTORY)) {
      await mkdirAsync(TEMP_DIRECTORY)
      resolve()
    }
    resolve()
  })

  const p4 = new Promise(async resolve => {
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

  return Promise.all([p1, p2, p3, p4])
}
