import React, { useRef, useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import { List } from 'immutable'
import path from 'path'
import { readdir } from 'fs'
import { promisify } from 'util'
import { AppContext } from '../App'
import { TEMP_DIRECTORY } from 'common/filepaths'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 50px 1fr calc(calc(100px * 9 / 16) + 40px);
`

export const Main = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
`

export const Wrapper = styled.div`
  position: relative;
`

export const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`

export const Thumbnails = styled.div`
  width: 100vw;
  height: 100%;
  display: grid;
  grid-template-columns: ${p => `repeat(${p.columns}, 110px)`};
  overflow-y: auto;
  border-top: ${p => p.theme.border};
  padding-top: 2px;
`

export const Thumbnail = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: calc(100px * 9 / 16) 1fr;
  background: ${p =>
    p.selected ? lighten(0.4, p.theme.primary) : 'transparent'};
  border: 2px solid ${p => (p.selected ? p.theme.primary : 'transparent')};
  img {
    justify-self: center;
    width: 100px;
    height: calc(100px * 9 / 16);
  }
  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    .index {
      align-self: center;
      justify-self: center;
    }
  }
`

const readdirAsync = promisify(readdir)

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)

  const [scale, setScale] = useState(null)
  const [images, setImages] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(List())

  const main = useRef(null)
  const wrapper = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    async function initialize() {
      const arr1 = []
      const arr2 = []
      const files = await readdirAsync(TEMP_DIRECTORY).catch(console.error)

      for (const file of files) {
        const filepath = path.join(TEMP_DIRECTORY, file)
        arr1.push(filepath)
        arr2.push(false)
      }

      setImages(arr1)
      setSelected(List(arr2).set(0, true))
    }

    initialize()
  }, [])

  useEffect(() => {
    const { gifDimensions } = state
    const { clientHeight } = main.current
    const heightRatio =
      Math.round((clientHeight / gifDimensions.height) * 100) / 100
    setScale(heightRatio < 1 ? heightRatio : 1)
  }, [])

  useEffect(() => {
    if (images.length && scale) {
      const { gifDimensions } = state
      wrapper.current.style.width = gifDimensions.width * scale + 'px'
      wrapper.current.style.height = gifDimensions.height * scale + 'px'
      canvas.current.width = gifDimensions.width * scale
      canvas.current.height = gifDimensions.height * scale

      const ctx = canvas.current.getContext('2d')
      const image = new Image()
      image.onload = () => {
        ctx.scale(scale, scale)
        ctx.drawImage(image, 0, 0)
      }
      image.src = images[index]
    }
  }, [images, index, scale])

  function onClick(index) {
    setIndex(index)
    setSelected(selected.map((el, i) => (i === index ? true : false)))
  }

  return (
    <Container>
      <div />
      <Main ref={main}>
        <Wrapper ref={wrapper}>
          <Canvas ref={canvas} />
        </Wrapper>
      </Main>
      <Thumbnails columns={images.length}>
        {images.map((el, i) => (
          <Thumbnail
            key={i}
            selected={selected.get(i)}
            onClick={() => onClick(i)}
          >
            <img src={el} />
            <div className='bottom'>
              <div className='index'>{i + 1}</div>
              <div />
            </div>
          </Thumbnail>
        ))}
      </Thumbnails>
    </Container>
  )
}
