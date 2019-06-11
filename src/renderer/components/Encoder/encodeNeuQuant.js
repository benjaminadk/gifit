import GIFEncoder from 'gif-encoder-2'
import { Map } from 'immutable'
import { createWriteStream, statSync } from 'fs'
import formatBytes from '../../lib/formatBytes'

export default async (
  images,
  dstPath,
  { width, height },
  useOptimizer,
  repeat,
  quality,
  setOutput
) => {
  return new Promise(async resolve1 => {
    var index
    setOutput(cur => {
      index = cur.size + 1
      return cur.push(
        Map({ index: cur.size + 1, done: false, progress: 0, size: '', filepath: dstPath })
      )
    })

    const ws = createWriteStream(dstPath)
    ws.on('close', () => {
      const stats = statSync(dstPath)
      const size = formatBytes(stats.size)
      setOutput(cur => {
        const item = cur.find(el => el.get('index') === index)
        const itemIndex = cur.findIndex(el => el.get('index') === index)
        return cur.set(itemIndex, item.set('done', true).set('size', size))
      })
      resolve1()
    })

    const encoder = new GIFEncoder(width, height, 'neuquant', useOptimizer)
    encoder.createReadStream().pipe(ws)
    encoder.setRepeat(repeat)
    encoder.setQuality(quality)
    encoder.start()

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    async function processFrame(image) {
      return new Promise(resolve2 => {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          encoder.setDelay(image.time)
          encoder.addFrame(ctx)
          resolve2()
        }
        img.src = image.path
      })
    }

    for (const [i, image] of images.entries()) {
      await processFrame(image)
      setOutput(cur => {
        const item = cur.find(el => el.get('index') === index)
        const itemIndex = cur.findIndex(el => el.get('index') === index)
        const progress = Math.ceil((i / images.length) * 100)
        return cur.set(itemIndex, item.set('progress', progress))
      })
    }

    encoder.finish()
  })
}
