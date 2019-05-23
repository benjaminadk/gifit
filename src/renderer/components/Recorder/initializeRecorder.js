import { remote, ipcRenderer } from 'electron'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  mainWindow,
  ipcActions: { RECORDER_STOP, RECORDER_CLOSE },
  appActions: { SET_APP_MODE, SET_PROJECT_FOLDER }
} = config

export default (state, dispatch) => {
  const { options, sources } = state
  const sourceIndex = options.get('sourceIndex')
  const source = sources[sourceIndex]

  function onRecorderStop(e, data) {
    dispatch({ type: SET_PROJECT_FOLDER, payload: data })
    dispatch({ type: SET_APP_MODE, payload: 1 })
    remote.BrowserWindow.fromId(1).maximize()
    remote.BrowserWindow.fromId(1).focus()
  }

  function onRecorderClose() {
    remote.BrowserWindow.fromId(1).setSize(mainWindow.width, mainWindow.height)
    remote.BrowserWindow.fromId(1).center()
    remote.BrowserWindow.fromId(1).show()
    remote.BrowserWindow.fromId(1).focus()
  }

  ipcRenderer.once(RECORDER_STOP, onRecorderStop)
  ipcRenderer.once(RECORDER_CLOSE, onRecorderClose)

  const { width, height, x, y } = source.display.bounds

  let recorderWindow

  recorderWindow = new remote.BrowserWindow({
    title: 'GifIt - Recorder',
    width,
    height,
    x,
    y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: true }
  })

  recorderWindow.loadURL(getURL(inDev))

  // inDev && recorderWindow.webContents.openDevTools({ mode: 'detach' })

  recorderWindow.on('close', () => {
    ipcRenderer.removeListener(RECORDER_STOP, onRecorderStop)
    ipcRenderer.removeListener(RECORDER_CLOSE, onRecorderClose)
    recorderWindow = null
  })

  remote.getCurrentWindow().hide()
}
