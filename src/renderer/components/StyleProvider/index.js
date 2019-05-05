import React from 'react'
import { ThemeProvider } from 'styled-components'
import GlobalStyles from './GlobalStyles'
import config from 'common/config'

export default function StyleProvider(props) {
  return (
    <React.Fragment>
      <GlobalStyles />
      <ThemeProvider theme={config.theme}>{props.children}</ThemeProvider>
    </React.Fragment>
  )
}
