var __DEV__ = process.env.NODE_ENV !== 'production'
var path    = require('path')
var webpack = require('webpack')
var project = require('../package')

var config = {
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : null,

  context: path.join(__dirname, '..'),

  entry: {
    trackomatic: './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, '..', 'dist', project.version),
    filename: project.name + '.dev.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': __DEV__
    })
  ],

  resolve: {
    extensions: ['', '.js', '.json'],
    modulesDirectories: [ 'web_modules', 'node_modules' ]
  },

  externals: ['sinon'],

  module: {
    loaders: [
      {
        test    : /\.js$/,
        exclude : /node_modules/,
        loader  : 'babel'
      },
      {
        test    : /\.json$/,
        loader  : 'json'
      }
    ]
  }
}

if (!__DEV__) {
  config.output.filename = project.name + '.min.js'

  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ])
}

module.exports = config
