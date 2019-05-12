import { remote, ipcRenderer } from 'electron'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  ipcActions: { OPTIONS_SAVE, OPTIONS_CLOSE },
  optionsWindow: { width, height }
} = config

function onOptionsClose() {}

export default parent => {
  let optionsWindow

  optionsWindow = new remote.BrowserWindow({
    parent,
    title: 'Options',
    width,
    height,
    center: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  optionsWindow.loadURL(getURL(inDev))

  inDev && optionsWindow.webContents.openDevTools({ mode: 'detach' })

  optionsWindow.on('close', () => {
    optionsWindow = null
  })
}
