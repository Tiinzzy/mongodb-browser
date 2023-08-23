const webpack = require('webpack') 
const path = require("path")

module.exports = {
  target: 'node',
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false
  },
  entry : "./server.js",
  output : {
    filename: "server.js",
    path: path.resolve(__dirname, "../dist")
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /express\/lib/,
      path.resolve(__dirname, './node_modules'),
      {
        'ejs': 'ejs'
      }
    )
  ]
}