import React from 'react'
import ReactDOM from 'react-dom'
import StyleProvider from './components/StyleProvider'
import App from './components/App'

ReactDOM.render(
  <StyleProvider>
    <App />
  </StyleProvider>,
  document.getElementById('app')
)
