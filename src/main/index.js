import { app, BrowserWindow } from 'electron'
import installDevTools from './installDevTools'
import getMainWindowDimensions from 'common/getMainWindowDimensions'
import getURL from 'common/getURL'
import config from 'common/config'

const { inDev } = config

let mainWindow

function createMainWindow() {
  const { width, height, x, y } = getMainWindowDimensions()

  mainWindow = new BrowserWindow({
    title: 'Gifit',
    width,
    height,
    x,
    y,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !inDev
    }
  })

  mainWindow.loadURL(getURL(inDev))

  installDevTools(inDev)
  inDev && mainWindow.webContents.openDevTools({ mode: 'detach' })

  mainWindow.on('close', () => {
    mainWindow = null
  })
}

app.on('ready', createMainWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
