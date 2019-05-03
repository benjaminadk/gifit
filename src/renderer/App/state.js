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
      return { ...state, gifDimensions: action.payload }
    default:
      throw new Error()
  }
}

const initialState = {
  loading: true,
  windowID: null,
  options: Map(),
  sources: null,
  mode: 1,
  gifDimensions: { width: 1360, height: 768 }
}

export { reducer, initialState }
