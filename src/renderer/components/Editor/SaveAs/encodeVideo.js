import { execFile } from 'child_process'
import { writeFile } from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify(writeFile)

export default (images, width, height, ffmpegPath, encoder, cwd, dstPath) => {
  return new Promise(resolve => {
    let str = ''
    images.forEach((el, i) => {
      str += `file ${path.basename(el.path)}\n`
      str += `duration ${Math.round((el.time / 1000) * 100) / 100}\n`
    })
    str += `file ${path.basename(images[images.length - 1].path)}`
    const txtPath = path.join(cwd, 'file.txt')

    writeFileAsync(txtPath, str).then(() => {
      execFile(
        ffmpegPath,
        [
          '-f',
          'concat',
          '-i',
          'file.txt',
          '-c:v',
          encoder,
          '-pix_fmt',
          'yuv420p',
          '-vf',
          `pad=width=${width}:height=${height}:x=0:y=0:color=black`,
          dstPath
        ],
        { cwd },
        (error, stdout, stderr) => {
          if (error) {
            throw error
          } else {
            resolve()
          }
        }
      )
    })
  })
}
