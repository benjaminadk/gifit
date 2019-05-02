import config from 'common/config'

const {
  appActions: { LOADING_START, LOADING_END }
} = config

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

export default dispatch => action => {
  if (isPromise(action.payload)) {
    dispatch({ type: LOADING_START })
    action.payload.then(value => {
      dispatch({ type: action.type, payload: value })
      dispatch({ type: LOADING_END })
    })
  } else {
    dispatch(action)
  }
}
