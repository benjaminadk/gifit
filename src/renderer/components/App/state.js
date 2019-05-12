import { Map } from 'immutable'
import config from 'common/config'

const {
  appActions: { INITIALIZE, LOADING_START, LOADING_END, SET_APP_MODE, SET_GIF_FOLDER }
} = config

function reducer(state, action) {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...state,
        windowID: action.payload[0].id,
        windowTitle: action.payload[0].getTitle(),
        sources: action.payload[1],
        options: action.payload[4],
        ffmpegPath: action.payload[5]
      }
    case LOADING_START:
      return { ...state, loading: true }
    case LOADING_END:
      return { ...state, loading: false }
    case SET_APP_MODE:
      return { ...state, mode: action.payload }
    case SET_GIF_FOLDER:
      return { ...state, gifFolder: action.payload }
    default:
      throw new Error()
  }
}

const initialState = {
  loading: true,
  windowID: null,
  windowTitle: null,
  options: Map(),
  sources: null,
  mode: 1,
  gifFolder: null,
  ffmpegPath: null
}

export { reducer, initialState }
