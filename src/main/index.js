import { app, BrowserWindow, ipcMain } from 'electron'
import ioHook from 'iohook'
import path from 'path'
import installDevTools from './installDevTools'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  mainWindow: { width, height }
} = config

let mainWindow
var recording = false
var recorderId = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Gifit - Start Up',
    icon: path.join(__static, 'icon.ico'),
    width,
    height,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !inDev
    }
  })

  // mainWindow.setMenu(null)

  mainWindow.loadURL(getURL(inDev))

  installDevTools(inDev)
  inDev && mainWindow.webContents.openDevTools({ mode: 'detach' })

  mainWindow.on('close', () => {
    mainWindow = null
    ipcMain.removeListener('record', onRecord)
  })
}

app.on('ready', createMainWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function onRecord(e, { isRecording, id }) {
  recording = isRecording
  recorderId = id
}

ipcMain.on('record', onRecord)

ioHook.on('mousedown', e => {
  if (recording && recorderId) {
    BrowserWindow.fromId(recorderId).webContents.send('mouse-watch', true)
  }
})

ioHook.on('mouseup', e => {
  if (recording && recorderId) {
    BrowserWindow.fromId(recorderId).webContents.send('mouse-watch', false)
  }
})

ioHook.start()
