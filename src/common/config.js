const mainWindow = {
  width: 600,
  height: 400
}

const editor = {
  drawerWidth: 300,
  titleStyles: ['Normal', 'Italic', 'Bold']
}

const defaultOptions = {
  alwaysOnTop: false,
  sourceIndex: 0,
  frameRate: 10,
  checkerColor: '#F0F0F0',
  checkerSize: 20
}

const grey = [
  '#FAFAFA',
  '#F0F0F0',
  '#E0E0E0',
  '#CFCFCF',
  '#BFBFBF',
  '#B0B0B0',
  '#A1A1A1',
  '#8F8F8F',
  '#808080',
  '#707070',
  '#616161',
  '#4D4D4D',
  '#3D3D3D',
  '#2E2E2E'
]

const theme = {
  primary: 'hsla(162, 89%, 53%, 1)',
  secondary: 'hsla(192, 89%, 53%, 1)',
  black: '#333333',
  grey,
  border: '1px solid #E0E0E0'
}

const appActions = {
  INITIALIZE: 'INITIALIZE',
  LOADING_START: 'LOADING_START',
  LOADING_END: 'LOADING_END',
  SET_APP_MODE: 'SET_APP_MODE',
  SET_GIF_FOLDER: 'SET_GIF_FOLDER'
}

const ipcActions = {
  GIFIT_STOP: 'GIFIT_STOP',
  GIFIT_CLOSE: 'GIFIT_CLOSE'
}

const constants = {
  VIDEO_CSS: 'position: absolute; top: -10000px; left: -10000px;',
  IMAGE_TYPE: 'image/png',
  IMAGE_REGEX: /^data:image\/(png|gif|jpeg);base64,/,
  MAX_LENGTH: 20 * 1000
}

export default {
  inDev: process.env.NODE_ENV === 'development',
  mainWindow,
  editor,
  defaultOptions,
  theme,
  appActions,
  ipcActions,
  constants
}
