import React from 'react'
import { remote, shell } from 'electron'
import path from 'path'
import Svg from '../../Svg'
import Checkbox from '../../Shared/Checkbox'
import Select from '../../Shared/Select'
import { PathInput, Warning } from './styles'
import { Section } from '../Drawer/styles'

export default function Images({
  imagesFolderPath,
  imagesFilename,
  imagesZip,
  imagesOverwrite,
  imagesOverwriteError,
  setImagesFolderPath,
  setImagesFilename,
  setImagesZip,
  setImagesOverwrite
}) {
  function onInputChange({ target: { name, value } }) {
    if (name === 'imagesFolderPath') {
      setImagesFolderPath(value)
    } else if (name === 'imagesFilename') {
      setImagesFilename(value)
    }
  }

  function onImagesFolderClick() {
    const win = remote.getCurrentWindow()
    const opts = {
      title: 'Save As',
      defaultPath: remote.app.getPath('desktop'),
      buttonLabel: 'Save',
      filters: [
        {
          name: imagesZip ? 'Zip, all selected images' : 'Png, all selected images',
          extensions: imagesZip ? ['zip'] : ['png']
        }
      ]
    }
    const callback = filepath => {
      if (filepath) {
        const folder = path.dirname(filepath)
        const file = path.basename(filepath).slice(0, -4)
        setImagesFolderPath(folder)
        setImagesFilename(file)
      }
    }
    remote.dialog.showSaveDialog(win, opts, callback)
  }

  function onPlusMinusClick(button) {
    const re = /\((-?\d+)\)(?!.*\(-?\d+\))/g
    if (!imagesFilename) {
      setImagesFilename('Animation')
      return
    }
    if (re.test(imagesFilename)) {
      const filename = imagesFilename.replace(re, (match, val) => {
        const x = button === 'plus' ? Number(val) + 1 : Number(val) - 1
        return `(${x})`
      })
      setImagesFilename(filename)
    } else {
      setImagesFilename(imagesFilename + ' (0)')
    }
  }

  function onShowOverwriteFile() {
    const filepath = path.join(imagesFolderPath, imagesFilename + imagesZip ? '.zip' : '.png')
    shell.openExternal(filepath)
  }

  return (
    <>
      <Section height={50}>
        <div className='title'>
          <div className='text'>Images options</div>
          <div className='divider' />
        </div>
        <div>
          <Checkbox
            value={imagesZip}
            primary='Zip the images.'
            style={{ marginLeft: '10px' }}
            onClick={() => setImagesZip(!imagesZip)}
          />
        </div>
      </Section>
      <Section height={70}>
        <div className='title'>
          <div className='text'>Save options</div>
          <div className='divider' />
        </div>
        <div>
          <Checkbox
            value={true}
            primary='Save to a folder of your choice.'
            style={{ marginLeft: '10px' }}
          />
          <Checkbox
            value={imagesOverwrite}
            primary='Overwrite (if already exists).'
            style={{ marginLeft: '20px' }}
            onClick={() => setImagesOverwrite(!imagesOverwrite)}
          />
        </div>
      </Section>
      <Section height={100}>
        <div className='title'>
          <div className='text'>File</div>
          <div className='divider' />
        </div>
        <div>
          <PathInput>
            <div className='top'>
              <input
                type='text'
                name='imagesFolderPath'
                value={imagesFolderPath}
                onChange={onInputChange}
                spellCheck={false}
              />
              <div className='action' onClick={onImagesFolderClick}>
                <Svg name='folder' />
              </div>
            </div>
            <div className='bottom'>
              <input
                type='text'
                name='imagesFilename'
                value={imagesFilename}
                onChange={onInputChange}
                spellCheck={false}
              />
              <Select
                width={50}
                value={imagesZip ? '.zip' : '.png'}
                options={['.png', '.zip']}
                onClick={() => {}}
              />
              <div className='action' onClick={() => onPlusMinusClick('plus')}>
                <Svg name='insert' />
              </div>
              <div className='action' onClick={() => onPlusMinusClick('minus')}>
                <Svg name='minus' />
              </div>
            </div>
          </PathInput>
          {imagesOverwriteError && (
            <Warning onClick={onShowOverwriteFile}>
              <Svg name='warning' />
              <div className='text'>A file with the same name already exists.</div>
            </Warning>
          )}
        </div>
      </Section>
    </>
  )
}
