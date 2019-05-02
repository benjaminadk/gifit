import url from 'url'
import path from 'path'

export default inDev =>
  inDev
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    : url.format({
        pathname: path.resolve(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
