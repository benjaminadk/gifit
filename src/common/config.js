const defaultOptions = {
  alwaysOnTop: false,
  sourceIndex: 0
}

const theme = {
  primary: '',
  secondary: ''
}

const appActions = {
  INITIALIZE: 'INITIALIZE',
  LOADING_START: 'LOADING_START',
  LOADING_END: 'LOADING_END'
}

export default {
  inDev: process.env.NODE_ENV === 'development',
  defaultOptions,
  theme,
  appActions
}
