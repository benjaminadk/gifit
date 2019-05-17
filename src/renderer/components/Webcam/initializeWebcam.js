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
  function onWebcamClose() {
    remote.BrowserWindow.fromId(1).setSize(mainWindow.width, mainWindow.height)
    remote.BrowserWindow.fromId(1).center()
    remote.BrowserWindow.fromId(1).show()
    remote.BrowserWindow.fromId(1).focus()
  }

  ipcRenderer.once(WEBCAM_CLOSE, onWebcamClose)

  let webcamWindow

  webcamWindow = new remote.BrowserWindow({
    title: 'GifIt - Webcam',
    width: 400,
    height: 450,
    center: true,
    webPreferences: { nodeIntegration: true }
  })

  webcamWindow.setMenu(null)

  webcamWindow.loadURL(getURL(inDev))

  inDev && webcamWindow.webContents.openDevTools({ mode: 'detach' })

  webcamWindow.on('close', () => {
    ipcRenderer.removeListener(WEBCAM_CLOSE, onWebcamClose)
    webcamWindow = null
  })

  remote.getCurrentWindow().hide()
}
