import React from 'react'
import { remote, shell } from 'electron'
import path from 'path'
import Svg from '../../Svg'
import Checkbox from '../../Shared/Checkbox'
import Select from '../../Shared/Select'
import { PathInput, Warning } from './styles'
import { Section } from '../Drawer/styles'

export default function Project({
  saveProjectFolderPath,
  saveProjectFilename,
  saveProjectOverwrite,
  saveProjectOverwriteError,
  setSaveProjectFolderPath,
  setSaveProjectFilename,
  setSaveProjectOverwrite
}) {
  function onInputChange({ target: { name, value } }) {
    if (name === 'saveProjectFolderPath') {
      setSaveProjectFolderPath(value)
    } else if (name === 'saveProjectFilename') {
      setSaveProjectFilename(value)
    }
  }

  function onProjectFolderClick() {
    const win = remote.getCurrentWindow()
    const opts = {
      title: 'Save As',
      defaultPath: remote.app.getPath('desktop'),
      buttonLabel: 'Save',
      filters: [
        {
          name: 'Zip',
          extensions: ['zip']
        }
      ]
    }
    const callback = filepath => {
      if (filepath) {
        const folder = path.dirname(filepath)
        const file = path.basename(filepath).slice(0, -4)
        setSaveProjectFolderPath(folder)
        setSaveProjectFilename(file)
      }
    }
    remote.dialog.showSaveDialog(win, opts, callback)
  }

  function onPlusMinusClick(button) {
    const re = /\((-?\d+)\)(?!.*\(-?\d+\))/g
    if (!saveProjectFilename) {
      setSaveProjectFilename('Animation')
      return
    }
    if (re.test(saveProjectFilename)) {
      const filename = saveProjectFilename.replace(re, (match, val) => {
        const x = button === 'plus' ? Number(val) + 1 : Number(val) - 1
        return `(${x})`
      })
      setSaveProjectFilename(filename)
    } else {
      setSaveProjectFilename(saveProjectFilename + ' (0)')
    }
  }

  function onShowOverwriteFile() {
    const filepath = path.join(saveProjectFolderPath, saveProjectFilename + '.zip')
    shell.openExternal(filepath)
  }

  return (
    <>
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
            value={saveProjectOverwrite}
            primary='Overwrite (if already exists).'
            style={{ marginLeft: '20px' }}
            onClick={() => setSaveProjectOverwrite(!saveProjectOverwrite)}
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
                name='saveProjectFolderPath'
                value={saveProjectFolderPath}
                onChange={onInputChange}
                spellCheck={false}
              />
              <div className='action' onClick={onProjectFolderClick}>
                <Svg name='folder' />
              </div>
            </div>
            <div className='bottom'>
              <input
                type='text'
                name='saveProjectFilename'
                value={saveProjectFilename}
                onChange={onInputChange}
                spellCheck={false}
              />
              <Select width={50} value='.zip' options={['.zip']} onClick={() => {}} />
              <div className='action' onClick={() => onPlusMinusClick('plus')}>
                <Svg name='insert' />
              </div>
              <div className='action' onClick={() => onPlusMinusClick('minus')}>
                <Svg name='minus' />
              </div>
            </div>
          </PathInput>
          {saveProjectOverwriteError && (
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
