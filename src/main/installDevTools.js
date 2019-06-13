import path from 'path'
import os from 'os'
import { BrowserWindow } from 'electron'

// installs newer version of react dev tools than comes with `electron-dev-tools` package
// installed from my hard drive but only used in development
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
