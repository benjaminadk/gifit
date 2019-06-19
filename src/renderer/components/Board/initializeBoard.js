import { remote, ipcRenderer } from 'electron'
import path from 'path'
import getURL from 'common/getURL'
import config from 'common/config'

const {
  inDev,
  mainWindow,
  board,
  ipcActions: { BOARD_STOP, BOARD_CLOSE },
  appActions: { SET_APP_MODE, SET_PROJECT_FOLDER }
} = config

export default (state, dispatch) => {
  function onBoardStop(e, data) {
    dispatch({ type: SET_PROJECT_FOLDER, payload: data })
    dispatch({ type: SET_APP_MODE, payload: 1 })
    remote.BrowserWindow.fromId(1).maximize()
    remote.BrowserWindow.fromId(1).focus()
  }

  function onBoardClose() {
    remote.BrowserWindow.fromId(1).setSize(mainWindow.width, mainWindow.height)
    remote.BrowserWindow.fromId(1).center()
    remote.BrowserWindow.fromId(1).focus()
  }

  ipcRenderer.once(BOARD_STOP, onBoardStop)
  ipcRenderer.once(BOARD_CLOSE, onBoardClose)

  let boardWindow

  boardWindow = new remote.BrowserWindow({
    title: 'GifIt - Board',
    icon: path.join(__static, process.platform === 'win32' ? 'icon.ico' : 'icon.icns'),
    width: board.width,
    height: board.height,
    useContentSize: true,
    alwaysOnTop: false,
    resizable: false,
    maximizable: false,
    webPreferences: { nodeIntegration: true }
  })

  boardWindow.setMenu(null)

  boardWindow.loadURL(getURL(inDev))

  inDev && boardWindow.webContents.openDevTools({ mode: 'detach' })

  boardWindow.on('close', () => {
    ipcRenderer.removeListener(BOARD_STOP, onBoardStop)
    ipcRenderer.removeListener(BOARD_CLOSE, onBoardClose)
    boardWindow = null
    remote.BrowserWindow.fromId(1).show()
  })

  remote.getCurrentWindow().hide()
}
