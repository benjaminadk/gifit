import { Map } from 'immutable'
import config from 'common/config'

const {
  appActions: {
    INITIALIZE,
    LOADING_START,
    LOADING_END,
    SET_APP_MODE,
    SET_GIF_DIMENSIONS
  }
} = config

function reducer(state, action) {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...state,
        windowID: action.payload[0],
        sources: action.payload[1],
        options: action.payload[3]
      }
    case LOADING_START:
      return { ...state, loading: true }
    case LOADING_END:
      return { ...state, loading: false }
    case SET_APP_MODE:
      return { ...state, mode: action.payload }
    case SET_GIF_DIMENSIONS:
      return { ...state, gifData: action.payload }
    default:
      throw new Error()
  }
}

const gifData = {
  width: 1360,
  height: 768,
  times: Array(124).fill(65),
  frameRate: 1000 / 15
}

const initialState = {
  loading: true,
  windowID: null,
  options: Map(),
  sources: null,
  mode: 0,
  gifData: null
}

export { reducer, initialState }
