import assert from 'assert'
import Plugin from '../plugin'

describe('Plugin', function() {
  let trackomaticMock

  beforeEach(() => {
    trackomaticMock = {
      track: sinon.stub()
    }
  })

  afterEach(() => {
    trackomaticMock = null
  })

  it('stores a reference to the instance of Trackomatic as this.__trackomatic__', function() {
    let plugin = new Plugin(trackomaticMock)

    assert.equal(plugin.__trackomatic__, trackomaticMock)
  })

  it('provides a method that proxies Trackomatic.track() as this.track()', function() {
    let plugin = new Plugin(trackomaticMock)
    let params = {}

    plugin.track(params)

    assert(trackomaticMock.track.calledWith(params))
  })
})
