var project = require('../package')

module.exports = {
  source: './src',
  destination: './docs',
  plugins: [
    {
      name: 'esdoc-es7-plugin'
    }
  ],
  test: {
    type: 'mocha',
    source: './src',
    includes: [
      'test\\.js$'
    ]
  }
}
