import { remote, ipcRenderer } from 'electron'
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
    encoderWindow.webContents.send(ENCODER_DATA, encoderData)
  }

  let encoderWindow

  encoderWindow = new remote.BrowserWindow({
    parent,
    title: 'GifIt - Encoder',
    icon: path.join(__static, 'icon.ico'),
    width,
    height,
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
}
