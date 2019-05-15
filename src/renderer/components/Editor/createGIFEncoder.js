import GIFEncoder from 'gifencoder'
import { createWriteStream } from 'fs'

// 39 seconds for 91 frame test 7.09 MB
export default async (images, originalPaths, gifData, dstPath) => {
  return new Promise(async resolve => {
    const { width, height } = gifData
    const encoder = new GIFEncoder(width, height)
    const outStream = createWriteStream(dstPath)
    outStream.on('close', () => {
      resolve()
    })

    encoder.createReadStream().pipe(outStream)
    encoder.start()
    encoder.setRepeat(0)
    encoder.setQuality(10)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    async function draw(index) {
      return new Promise(resolve2 => {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          encoder.setDelay(images[index].time)
          encoder.addFrame(ctx)
          resolve2()
        }
        img.src = originalPaths[index]
      })
    }

    for (let i = 0; i < images.length; i++) {
      await draw(i)
    }

    encoder.finish()
  })
}
