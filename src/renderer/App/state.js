import { Map } from 'immutable'
import config from 'common/config'

const {
  appActions: { INITIALIZE, LOADING_START, LOADING_END }
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
  }
}

const initialState = {
  loading: true,
  windowID: null,
  options: Map(),
  sources: null,
  mode: 0
}

export { reducer, initialState }
