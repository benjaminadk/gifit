import GIFEncoder from '../../lib/gifencoder/GIFEncoder'
import { createWriteStream } from 'fs'

// 39 seconds for 91 frame test 7.09 MB
export default async (images, originalPaths, gifData, dstPath) => {
  return new Promise(async resolve1 => {
    const { width, height } = gifData
    // create write stream to path where GIF will be saved
    const ws = createWriteStream(dstPath)
    ws.on('close', () => {
      resolve1()
    })
    // create encoder
    const encoder = new GIFEncoder(width, height)
    encoder.createReadStream().pipe(ws)
    encoder.start()
    encoder.setRepeat(0)
    encoder.setQuality(10)
    // create canvas and context
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    // wait for image to load before returning w/o GIF is malformed
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
    // loop over each image
    for (let i = 0; i < images.length; i++) {
      await draw(i)
    }
    // stop encoder
    encoder.finish()
  })
}
