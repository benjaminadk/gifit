import { execFile } from 'child_process'
import { writeFile } from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify(writeFile)

// use ffmpeg to create a GIF file
export default async (images, dstPath, cwd, ffmpegPath) => {
  return new Promise(resolve => {
    // concatenate string to create a .txt file for concat demuxer
    let str = ''
    images.forEach((el, i) => {
      // use relative filepaths
      str += `file ${path.basename(el.path)}\n`
      // use time in seconds rounded to hundredth of a second
      str += `duration ${Math.round((el.time / 1000) * 100) / 100}\n`
    })
    // tack on last file a second time to prevent bug
    str += `file ${path.basename(images[images.length - 1].path)}`
    // create/overwrite .txt file for concat demuxer
    const txtPath = path.join(cwd, 'file.txt')
    writeFileAsync(txtPath, str).then(() => {
      // execute path to ffmpeg
      // use palettegen/paletteuse to improve quality
      // maintain actual size
      const child = execFile(
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

      child.on('message', (m, s) => {
        console.log(m, s)
      })
    })
  })
}
