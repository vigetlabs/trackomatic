import assert from 'assert'
import util from '../util'

describe('util', function() {

  describe('createAnchor()', function() {
    it('creates an anchor node and sets the href', function() {
      let anchor = util.createAnchor('http://foo.com/')
      let proto = Object.prototype.toString.call(anchor)

      assert.equal(anchor.href, 'http://foo.com/')
      assert.equal(proto, '[object HTMLAnchorElement]')
    })
  })

  describe('getPathname()', function() {
    it('extracts the pathname from a url', function() {
      let pathname = util.getPathname('http://foo.com/bar/baz')
      assert.equal(pathname, '/bar/baz')
    })
  })

  describe('slugify()', function() {
    it('converts a string with spaces into a suitable all lowercase slug', function() {
      let result = util.slugify('fOO bar BAz')
      assert.equal(result, 'foo-bar-baz')
    })

    it('removes non-word characters but leaves numbers intact', function() {
      let result = util.slugify('foo *@& !bar. baz')
      assert.equal(result, 'foo-bar-baz')
    })

    it('converts double hyphens to single hyphens and prunes hypens from the start and end', function() {
      let result = util.slugify('------foo--bar baz-')
      assert.equal(result, 'foo-bar-baz')
    })
  })

  describe('callOnce()', function() {
    it('returns a wrapped function that is guarded from being invoked more than once', function() {
      let stub = sinon.stub()
      let wrapped = util.callOnce(stub)

      wrapped()
      wrapped()
      wrapped()

      assert(stub.calledOnce)
    })
  })
})
