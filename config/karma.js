module.exports = function (config) {

  return config.set({
    frameworks: ['mocha', 'chai', 'chai-sinon'],

    files: [
      '../src/**/__tests__/*.test.js'
    ],

    preprocessors: {
      '../src/**/__tests__/*.test.js': [ 'webpack' ]
    },

    reporters: [ 'mocha' ],

    webpack: require('./webpack'),

    webpackMiddleware: {
      noInfo: true
    },

    browsers: process.env.CIRCLECI ? [ 'Firefox', 'Chrome' ] : [ 'Chrome' ],

    plugins: [
      require('karma-mocha'),
      require('karma-webpack'),
      require('karma-chai'),
      require('karma-chai-sinon'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher')
    ]
  })

}
