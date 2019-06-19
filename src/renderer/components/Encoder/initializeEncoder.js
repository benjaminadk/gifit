import { remote } from 'electron'
import path from 'path'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  encoder: { width, height },
  appActions: { SET_ENCODER_OPEN },
  ipcActions: { ENCODER_READY, ENCODER_DATA }
} = config

export default (parent, dispatch, encoderData) => {
  function onEncoderReady(e, data) {
    dispatch({ type: SET_ENCODER_OPEN, payload: true })
    encoderWindow.webContents.send(ENCODER_DATA, encoderData)
  }

  let encoderWindow

  encoderWindow = new remote.BrowserWindow({
    parent,
    title: 'GifIt - Encoder',
    icon: path.join(__static, process.platform === 'win32' ? 'icon.ico' : 'icon.icns'),
    width,
    height,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !inDev
    }
  })

  encoderWindow.setMenu(null)

  encoderWindow.loadURL(getURL(inDev))

  inDev && encoderWindow.webContents.openDevTools({ mode: 'detach' })

  remote.ipcMain.once(ENCODER_READY, onEncoderReady)

  encoderWindow.on('close', () => {
    dispatch({ type: SET_ENCODER_OPEN, payload: false })
    remote.ipcMain.removeListener(ENCODER_READY, onEncoderReady)
    encoderWindow = null
    parent.focus()
  })

  return encoderWindow
}
