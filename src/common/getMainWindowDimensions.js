import getScreenDimensions from 'common/getScreenDimensions'
import config from 'common/config'

export default (index = 0) => {
  const { width, height } = getScreenDimensions(index)
  const { mainWindow } = config
  const x = width / 2 - mainWindow.width / 2
  const y = height / 2 - mainWindow.height / 2
  return { width: mainWindow.width, height: mainWindow.height, x, y }
}
