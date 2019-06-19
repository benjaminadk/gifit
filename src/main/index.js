import { app, BrowserWindow, ipcMain } from 'electron'
import ioHook from 'iohook'
import path from 'path'
import installDevTools from './installDevTools'
import getURL from 'common/getURL'
import config from 'common/config'

// main electron window

// config variables
const {
  inDev,
  mainWindow: { width, height }
} = config

const gotTheLock = app.requestSingleInstanceLock()

let mainWindow
var recording = false
var recorderId = null

// create main electron window
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

  // hide menu
  mainWindow.setMenu(null)

  // load renderer HTML root
  mainWindow.loadURL(getURL(inDev))

  // install and open dev tools in development
  installDevTools(inDev)
  inDev && mainWindow.webContents.openDevTools({ mode: 'detach' })

  // window close event
  mainWindow.on('close', () => {
    mainWindow = null
    ipcMain.removeListener('record', onRecord)
  })
}

// set recording status and recorder window id
function onRecord(e, { isRecording, id }) {
  recording = isRecording
  recorderId = id
}

ipcMain.on('record', onRecord)

// global input listeners
// mouse-watch is true if mouse button is pushed
ioHook.on('mousedown', e => {
  if (recording && recorderId) {
    BrowserWindow.fromId(recorderId).webContents.send('mouse-watch', true)
  }
})
// mouse-watch is false if mouse button is not pushed
ioHook.on('mouseup', e => {
  if (recording && recorderId) {
    BrowserWindow.fromId(recorderId).webContents.send('mouse-watch', false)
  }
})
// send entire keydown event to recorder window when key is pressed
ioHook.on('keydown', e => {
  if (recording && recorderId) {
    BrowserWindow.fromId(recorderId).webContents.send('key-watch', e)
  }
})
// key-watch is set to false when key is released
ioHook.on('keyup', e => {
  if (recording && recorderId) {
    BrowserWindow.fromId(recorderId).webContents.send('key-watch', false)
  }
})
// initialize iohook listeners
ioHook.start()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  app.on('ready', createMainWindow)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
