import React from 'react'
import ReactDOM from 'react-dom'
import StyleProvider from './StyleProvider'
import App from './App'

ReactDOM.render(
  <StyleProvider>
    <App />
  </StyleProvider>,
  document.getElementById('app')
)
