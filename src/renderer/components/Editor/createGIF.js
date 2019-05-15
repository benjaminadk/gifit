import { spawn, execFile } from 'child_process'
import { writeFile } from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify(writeFile)

// use ffmpeg to create a GIF file
export default async (ffmpegPath, frames, cwd, dstPath) => {
  return new Promise(resolve => {
    // use string to create a .txt file for concat demuxer
    // remove #'s created by editor to get original filename
    let str = ''
    frames.forEach(el => {
      str += `file ${path.basename(el.path).split('#')[0]}\n`
      str += `duration ${Math.round((el.time / 1000) * 100) / 100}\n`
    })
    str += `file ${path.basename(frames[frames.length - 1].path).split('#')[0]}`
    // create/overwrite .txt file then create GIF
    const txtPath = path.join(cwd, 'file.txt')
    writeFileAsync(txtPath, str).then(() => {
      // execute path to ffmpeg
      // use palettegen/paletteuse to improve quality
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

      // spawn executes ffmpeg command from PATH
      // const ffmpeg = spawn(
      //   'ffmpeg',
      //   [
      //     '-f',
      //     'concat',
      //     '-i',
      //     'file.txt',
      //     '-lavfi',
      //     'palettegen=stats_mode=diff[pal],[0:v][pal]paletteuse=new=1:diff_mode=rectangle',
      //     dstPath
      //   ],
      //   { cwd }
      // )

      // ffmpeg.on('close', code => {
      //   console.log('ffmpeg exit code: ', code)
      //   resolve(true)
      // })

      // ffmpeg.on('error', error => {
      //   console.error(error)
      //   resolve(false)
      // })
    })
  })
}
