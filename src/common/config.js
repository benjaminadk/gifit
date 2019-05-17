const mainWindow = {
  width: 600,
  height: 300
}

const optionsWindow = {
  width: 800,
  height: 500
}

const editor = {
  drawerWidth: 300,
  styleOptions: ['Normal', 'Italic', 'Bold'],
  verticalOptions: ['Top', 'Center', 'Bottom'],
  horizontalOptions: ['Left', 'Center', 'Right'],
  orientationOptions: ['Horizontal', 'Vertical'],
  precisionOptions: ['Minutes', 'Seconds', 'Milliseconds']
}

const defaultOptions = {
  optionsPath: '',
  ffmpegPath: '',
  tempPath: '',
  gifProcessor: 'gifEncoder',
  showCursor: true,
  useCountdown: false,
  countdownTime: 3,
  alwaysOnTop: false,
  sourceIndex: 0,
  videoInputIndex: 0,
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
  SET_PROJECT_FOLDER: 'SET_PROJECT_FOLDER',
  SET_OPTIONS: 'SET_OPTIONS'
}

const ipcActions = {
  RECORDER_STOP: 'RECORDER_STOP',
  RECORDER_CLOSE: 'RECORDER_CLOSE',
  WEBCAM_STOP: 'WEBCAM_STOP',
  WEBCAM_CLOSE: 'WEBCAM_CLOSE',
  OPTIONS_UPDATE: 'OPTIONS_UPDATE'
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
  optionsWindow,
  editor,
  defaultOptions,
  theme,
  appActions,
  ipcActions,
  constants
}
