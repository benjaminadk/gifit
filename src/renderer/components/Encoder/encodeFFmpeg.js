import { Map } from 'immutable'
import { execFile } from 'child_process'
import { writeFile, statSync } from 'fs'
import path from 'path'
import { promisify } from 'util'
import formatBytes from '../../lib/formatBytes'

const writeFileAsync = promisify(writeFile)

// use ffmpeg to create a GIF file
export default async (images, dstPath, cwd, ffmpegPath, setOutput) => {
  return new Promise(resolve => {
    var index
    setOutput(cur => {
      index = cur.size + 1
      return cur.push(
        Map({ index: cur.size + 1, done: false, progress: 0, size: '', filepath: dstPath })
      )
    })

    var interval = setInterval(() => {
      setOutput(cur => {
        const item = cur.find(el => el.get('index') === index)
        const itemIndex = cur.findIndex(el => el.get('index') === index)
        const newProgress = item.get('progress') + 1
        return cur.set(itemIndex, item.set('progress', newProgress))
      })
    }, 250)
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
            clearInterval(interval)
            const stats = statSync(dstPath)
            const size = formatBytes(stats.size)
            setOutput(cur => {
              const item = cur.find(el => el.get('index') === index)
              const itemIndex = cur.findIndex(el => el.get('index') === index)
              return cur.set(itemIndex, item.set('done', true).set('size', size))
            })
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
