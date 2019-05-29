import { execFile } from 'child_process'
import { writeFile } from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify(writeFile)

// 8 seconds for 91 test images 1.12 MB
// use ffmpeg to create a GIF file
export default async (ffmpegPath, images, cwd, dstPath) => {
  return new Promise(resolve => {
    // use string to create a .txt file for concat demuxer
    // remove #'s created by editor to get original filename
    let str = ''
    images.forEach((el, i) => {
      str += `file ${path.basename(el.path)}\n`
      str += `duration ${Math.round((el.time / 1000) * 100) / 100}\n`
    })
    str += `file ${path.basename(images[images.length - 1].path)}`
    // create/overwrite .txt file then create GIF
    const txtPath = path.join(cwd, 'file.txt')
    writeFileAsync(txtPath, str).then(() => {
      // execute path to ffmpeg
      // use palettegen/paletteuse to improve quality
      execFile(
        ffmpegPath,
        [
          '-f',
          'concat',
          '-i',
          'file.txt',
          '-lavfi',
          'palettegen=stats_mode=diff[pal],[0:v][pal]paletteuse=new=1:diff_mode=rectangle',
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
