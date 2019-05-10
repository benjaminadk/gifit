import { spawn } from 'child_process'
import { writeFile } from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify(writeFile)

export default async (frames, cwd, dstPath) => {
  return new Promise(resolve => {
    let str = ''
    frames.forEach(el => {
      str += `file ${path.basename(el.path).split('#')[0]}\n`
      str += `duration ${Math.round((el.time / 1000) * 100) / 100}\n`
    })
    str += `file ${path.basename(frames[frames.length - 1].path)}`

    const txtPath = path.join(cwd, 'file.txt')
    writeFileAsync(txtPath, str).then(() => {
      const ffmpeg = spawn(
        'ffmpeg',
        [
          '-f',
          'concat',
          '-i',
          'file.txt',
          '-lavfi',
          'palettegen=stats_mode=diff[pal],[0:v][pal]paletteuse=new=1:diff_mode=rectangle',
          dstPath
        ],
        { cwd }
      )

      ffmpeg.on('close', code => {
        console.log('ffmpeg exit code: ', code)
        resolve(true)
      })

      ffmpeg.on('error', error => {
        console.error(error)
        resolve(false)
      })
    })
  })
}
