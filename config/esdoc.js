var project = require('../package')

module.exports = {
  title: 'Trackomatic',
  index: './DOCS.md',
  source: './src',
  destination: './docs',
  plugins: [
    { name: 'esdoc-es7-plugin' }
  ],
  test: {
    type: 'mocha',
    source: './src',
    includes: [
      'test\\.js$'
    ]
  },
  lint: true
}
