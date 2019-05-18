import { remote, ipcRenderer } from 'electron'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  mainWindow,
  ipcActions: { WEBCAM_STOP, WEBCAM_CLOSE },
  appActions: { SET_APP_MODE, SET_PROJECT_FOLDER }
} = config

export default (state, dispatch) => {
  function onWebcamStop(e, data) {
    dispatch({ type: SET_PROJECT_FOLDER, payload: data })
    dispatch({ type: SET_APP_MODE, payload: 1 })
    remote.BrowserWindow.fromId(1).maximize()
    remote.BrowserWindow.fromId(1).focus()
  }

  function onWebcamClose() {
    remote.BrowserWindow.fromId(1).setSize(mainWindow.width, mainWindow.height)
    remote.BrowserWindow.fromId(1).center()
    remote.BrowserWindow.fromId(1).focus()
  }

  ipcRenderer.once(WEBCAM_STOP, onWebcamStop)
  ipcRenderer.once(WEBCAM_CLOSE, onWebcamClose)

  let webcamWindow

  webcamWindow = new remote.BrowserWindow({
    title: 'GifIt - Webcam',
    width: 0,
    height: 0,
    center: true,
    resizable: false,
    maximizable: false,
    show: false,
    webPreferences: { nodeIntegration: true }
  })

  webcamWindow.setMenu(null)

  webcamWindow.loadURL(getURL(inDev))

  inDev && webcamWindow.webContents.openDevTools({ mode: 'detach' })

  webcamWindow.on('close', () => {
    ipcRenderer.removeListener(WEBCAM_STOP, onWebcamStop)
    ipcRenderer.removeListener(WEBCAM_CLOSE, onWebcamClose)
    webcamWindow = null
    remote.BrowserWindow.fromId(1).show()
  })

  remote.getCurrentWindow().hide()
}
