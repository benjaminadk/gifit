import { app, BrowserWindow } from 'electron'
import installDevTools from './installDevTools'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  mainWindow: { width, height }
} = config

let mainWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Gifit',
    width,
    height,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !inDev
    }
  })

  mainWindow.setMenu(null)

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
