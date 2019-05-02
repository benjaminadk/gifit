import path from 'path'
import os from 'os'
import { BrowserWindow } from 'electron'

export default inDev => {
  if (inDev) {
    BrowserWindow.removeDevToolsExtension('React Developer Tools')
    BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0'
      )
    )
  }
}
