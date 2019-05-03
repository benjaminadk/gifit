import React, { useEffect, useState, useContext } from 'react'
import path from 'path'
import { readdir } from 'fs'
import { promisify } from 'util'
import { AppContext } from '../App'
import { TEMP_DIRECTORY } from 'common/filepaths'

const readdirAsync = promisify(readdir)

export default function Editor() {
  const { state, dispatch } = useContext(AppContext)

  const [images, setImages] = useState([])

  useEffect(() => {
    async function initialize() {
      const arr = []
      const files = await readdirAsync(TEMP_DIRECTORY).catch(console.error)
      for (const file of files) {
        const filepath = path.join(TEMP_DIRECTORY, file)
        arr.push(filepath)
      }
      setImages(arr)
    }

    initialize()
  }, [])

  return <div>review</div>
}
