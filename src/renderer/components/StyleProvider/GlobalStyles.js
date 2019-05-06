import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  html, body, div, span, applet, object, iframe, table, caption, tbody, tfoot, thead, tr, th, td,
  del, dfn, em, font, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code,
  dl, dt, dd, ol, ul, li, fieldset, form, label, legend, input {
	  vertical-align: baseline;
	  font-family: inherit;
	  font-weight: inherit;
	  font-style: inherit;
	  font-size: 100%;
	  outline: 0;
	  padding: 0;
	  margin: 0;
	  border: 0;
    user-select: none;
	}
  :focus {
	  outline: 0;
	}
  html {
    font-size: 10px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-sizing: border-box;
  }
  body {
    height: 100vh;
    line-height: 1;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  ol, ul {
    list-style: none;
  }
  a {
    text-decoration: none;
  }
`
