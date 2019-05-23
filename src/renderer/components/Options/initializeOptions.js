import { remote, ipcRenderer } from 'electron'
import { Map } from 'immutable'
import path from 'path'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  ipcActions: { OPTIONS_UPDATE },
  appActions: { SET_OPTIONS, SET_OPTIONS_OPEN },
  optionsWindow: { width, height }
} = config

export default (parent, dispatch) => {
  function onOptionsUpdate(e, options) {
    dispatch({ type: SET_OPTIONS, payload: Map(options) })
  }

  let optionsWindow

  optionsWindow = new remote.BrowserWindow({
    parent,
    title: 'GifIt - Options',
    icon: path.join(__static, 'icon.ico'),
    width,
    height,
    center: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  optionsWindow.loadURL(getURL(inDev))

  inDev && optionsWindow.webContents.openDevTools({ mode: 'detach' })

  ipcRenderer.on(OPTIONS_UPDATE, onOptionsUpdate)

  optionsWindow.on('close', () => {
    dispatch({ type: SET_OPTIONS_OPEN, payload: false })
    ipcRenderer.removeListener(OPTIONS_UPDATE, onOptionsUpdate)
    optionsWindow = null
    parent.focus()
  })
}
