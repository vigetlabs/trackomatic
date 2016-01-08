import assert from 'assert'
import Trackomatic from '../trackomatic'

/** @test { Trackomatic } */
describe('Trackomatic', function() {
  let trackerMock = null

  beforeEach(() => {
    trackerMock = {
      get: sinon.stub()
    }
  })

  it('stores the provided tracker', function() {
    let tracker = {}
    let instance = new Trackomatic(tracker)

    assert.equal(instance.tracker, tracker)
  })

  it('extends default config settings with provided options', function() {
    let options = { redirectDelay: 1 }
    let instance = new Trackomatic({}, options)

    assert.equal(instance.options.redirectDelay, 1)
  })

  it('converts configured `files` and `networks` options into RegExp objects', function() {
    let options = { files: [ '.pdf', '.swf' ] }
    let instance = new Trackomatic({}, options)

    assert(instance.options.files instanceof RegExp)
    assert(instance.options.files.test('foo.pdf'))
  })

  it('warns when dataLayer is undefined if options.debug is true', function() {
    let stub = sinon.stub(window.console, 'log')

    let options = { debug: 1 }
    let instance = new Trackomatic(trackerMock, options)

    // Trackomatic.boot is normally called in response to domready so
    // we just call it directly in order to simulate this
    instance.boot()

    assert(stub.called)
  })

  it('prepends the prefix to the Category field of tracking calls if options.prefix is not empty', function() {
    let options = { prefix: 'test' }
    let instance = new Trackomatic(trackerMock, options)

    // Trackomatic.boot is normally called in response to domready so
    // we just call it directly in order to simulate this
    let prefixed = instance.prefix({ category: 'Category' })

    assert.equal(prefixed.category, 'test - Category')
  })
})
