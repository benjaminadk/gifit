import { remote, ipcRenderer } from 'electron'
import { Map } from 'immutable'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  ipcActions: { OPTIONS_UPDATE },
  appActions: { SET_OPTIONS },
  optionsWindow: { width, height }
} = config

export default (parent, dispatch) => {
  function onOptionsUpdate(e, options) {
    dispatch({ type: SET_OPTIONS, payload: Map(options) })
  }

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

  ipcRenderer.on(OPTIONS_UPDATE, onOptionsUpdate)

  optionsWindow.on('close', () => {
    ipcRenderer.removeListener(OPTIONS_UPDATE, onOptionsUpdate)
    optionsWindow = null
  })
}
