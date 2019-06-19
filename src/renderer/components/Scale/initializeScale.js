import { remote } from 'electron'
import path from 'path'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  ipcActions: { WEBCAM_SCALE }
} = config

export default (scale, setScale) => {
  let scaleWindow

  scaleWindow = new remote.BrowserWindow({
    title: 'Scale',
    icon: path.join(__static, process.platform === 'win32' ? 'icon.ico' : 'icon.icns'),
    width: 200,
    height: 100,
    alwaysOnTop: true,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  scaleWindow.setMenu(null)
  scaleWindow.loadURL(getURL(inDev))

  inDev && scaleWindow.webContents.openDevTools({ mode: 'detach' })

  scaleWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      scaleWindow.webContents.send(WEBCAM_SCALE, scale)
    }, 1000)
  })

  function onScaleChange(e, value) {
    setScale(value)
  }

  remote.ipcMain.on(WEBCAM_SCALE, onScaleChange)

  scaleWindow.on('close', () => {
    remote.ipcMain.removeListener(WEBCAM_SCALE, onScaleChange)
    scaleWindow = null
  })
}
