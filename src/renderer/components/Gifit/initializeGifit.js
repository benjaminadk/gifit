import { remote, ipcRenderer } from 'electron'
import getMainWindowDimensions from 'common/getMainWindowDimensions'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  ipcActions: { GIFIT_STOP, GIFIT_CLOSE },
  appActions: { SET_APP_MODE, SET_GIF_FOLDER }
} = config

export default (state, dispatch) => {
  const { options, sources } = state
  const sourceIndex = options.get('sourceIndex')
  const source = sources[sourceIndex]

  function onGifitStop(e, data) {
    dispatch({ type: SET_GIF_FOLDER, payload: data })
    dispatch({ type: SET_APP_MODE, payload: 1 })
    remote.BrowserWindow.fromId(1).maximize()
    remote.BrowserWindow.fromId(1).focus()
  }

  function onGifitClose() {
    const { width, height, x, y } = getMainWindowDimensions(sourceIndex)
    const bounds = {
      width,
      height,
      x,
      y
    }
    remote.BrowserWindow.fromId(1).setBounds(bounds, true)
    remote.BrowserWindow.fromId(1).show()
    remote.BrowserWindow.fromId(1).focus()
  }

  ipcRenderer.once(GIFIT_STOP, onGifitStop)
  ipcRenderer.once(GIFIT_CLOSE, onGifitClose)

  const { width, height, x, y } = source.display.bounds

  let gifferWindow

  gifferWindow = new remote.BrowserWindow({
    title: 'Recorder',
    width,
    height,
    x,
    y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: true }
  })

  gifferWindow.loadURL(getURL(inDev))

  inDev && gifferWindow.webContents.openDevTools({ mode: 'detach' })

  gifferWindow.on('close', () => {
    ipcRenderer.removeListener(GIFIT_STOP, onGifitStop)
    ipcRenderer.removeListener(GIFIT_CLOSE, onGifitClose)
    gifferWindow = null
  })

  remote.getCurrentWindow().hide()
}
