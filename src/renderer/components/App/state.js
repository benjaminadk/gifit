import { Map } from 'immutable'
import config from 'common/config'

const {
  appActions: {
    INITIALIZE,
    LOADING_START,
    LOADING_END,
    SET_APP_MODE,
    SET_PROJECT_FOLDER,
    SET_OPTIONS
  }
} = config

function reducer(state, action) {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...state,
        windowID: action.payload[0].id,
        windowTitle: action.payload[0].getTitle(),
        sources: action.payload[1],
        options: action.payload[3],
        fontOptions: action.payload[4],
        videoInputs: action.payload[5]
      }
    case LOADING_START:
      return { ...state, loading: true }
    case LOADING_END:
      return { ...state, loading: false }
    case SET_APP_MODE:
      return { ...state, mode: action.payload }
    case SET_PROJECT_FOLDER:
      return { ...state, projectFolder: action.payload }
    case SET_OPTIONS:
      return { ...state, options: action.payload }
    default:
      throw new Error()
  }
}

const initialState = {
  loading: true,
  windowID: null,
  windowTitle: null,
  options: Map(),
  fontOptions: null,
  sources: null,
  videoInputs: null,
  mode: 1,
  projectFolder: '2019-05-16@22-38-13'
}

export { reducer, initialState }
