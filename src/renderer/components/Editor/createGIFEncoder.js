// import GIFEncoder from '../../lib/gifencoder/GIFEncoder'
import GIFEncoder from 'gif-encoder-2'
import { createWriteStream } from 'fs'

// 39 seconds for 91 frame test 7.09 MB
export default async (images, gifData, dstPath) => {
  return new Promise(async resolve1 => {
    const { width, height } = gifData
    // create write stream to path where GIF will be saved
    const ws = createWriteStream(dstPath)
    ws.on('close', () => {
      resolve1()
    })
    // create encoder
    const encoder = new GIFEncoder(width, height, 'octree', true)
    encoder.createReadStream().pipe(ws)
    encoder.start()
    encoder.setRepeat(0)
    encoder.setQuality(10)
    encoder.setPaletteSize(7)
    // create canvas and context
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    // wait for image to load before returning w/o GIF is malformed
    async function draw(img) {
      return new Promise(resolve2 => {
        const image = new Image()
        image.onload = () => {
          ctx.clearRect(0, 0, width, height)
          ctx.drawImage(image, 0, 0)
          encoder.setDelay(img.time)
          encoder.addFrame(ctx)
          resolve2()
        }
        image.src = img.path
      })
    }
    // loop over images
    for (const img of images) {
      await draw(img)
    }
    // stop encoder
    encoder.finish()
  })
}
