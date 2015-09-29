var config = require('./config')

/**
 * Utility functions
 **/
const util = {
  noop() {},

  keyCode(e) {
    e = e || window.event
    return e.which || e.keyCode
  },

  /**
   * Allows easy extraction of domain, pathname, etc off of a full URL.
   * @param {string} href - the url to parse
   */
  createAnchor(href) {
    var target = document.createElement('a')
    target.href = href
    return target
  },

  /**
   * A small wrapper for `createAnchor` that returns just the `pathname`
   * @param {string} href - the url to parse
   */
  getPathname(href) {
    // normalize the pathname, since IE omits the leading slash.
    return href && this.createAnchor(href).pathname.replace(config.REGEX.LEADING_SLASH, '/')
  },

  /**
   * Capitalizes the first letter of a string. Useful for combining inconsistent data sources.
   * @param {string} string - the string to capitalize
   */
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  },

  /**
   * Turns strings into slugs - useful for combining inconsistent data sources
   *
   * @function slugify
   * @param   { String } text - the string to slugify
   * @returns { String }      - the slugified string
   */
  slugify(text) {
    return text.toString()
      .toLowerCase()
      .replace(config.REGEX.SPACES, '-')           // Replace spaces with -
      .replace(config.REGEX.NON_WORD, '')          // Remove all non-word chars
      .replace(config.REGEX.MULTIPLE_HYPHENS, '-') // Replace multiple - with single -
      .replace(config.REGEX.LEADING_HYPHENS, '')   // Trim - from start of text
      .replace(config.REGEX.TRAILING_HYPHENS, '') // Trim - from end of text
  },

  /**
   * Reads cookies.
   */
  readCookie() {
    return (config.REGEX.COOKIE.exec(document.cookie) || []).pop()
  },

  /**
   * Writes cookies. This function is a no-op if `_trackomatic.options.nocookie` is `true`.
   * @param {string} name - the name for the cookie value
   * @param {mixed} value - the value to be stored as a cookie
   * @param {number} days - the number of days to store the cookie for
   */
  createCookie(name, value, days) {
    if(_trackomatic.options.nocookie) return

    var expires = days ? ' expires=' + (new Date(days * 864E5 + (new Date()).getTime())).toGMTString() : ''
    document.cookie = `${ name }=${ value }${ expires }; path=/; domain=${ document.location.hostname }`
  },

  /**
   * Debounces function calls.
   */
  debounce(func, wait, immediate) {
    var timeout

    return function() {
      var context = this
      var args = arguments

      var later = function() {
        timeout = null
        if (!immediate) func.apply(context, args)
      }

      var callNow = immediate && !timeout

      clearTimeout(timeout)
      timeout = setTimeout(later, wait)

      if (callNow) func.apply(context, args)
    }
  },

  /**
   * Gets the viewport size.
   */
  getViewportSize() {
    if (typeof window.innerWidth !== 'undefined') {
      return {
        width  : window.innerWidth,
        height : window.innerHeight
      }
    } else if (typeof document.documentElement !== 'undefined'
        && typeof document.documentElement.clientWidth !== 'undefined'
        && document.documentElement.clientWidth !== 0) {
      return {
        width  : document.documentElement.clientWidth,
        height : document.documentElement.clientHeight
      }
    } else {
      return {
        width  : document.body.clientWidth,
        height : document.body.clientHeight
      }
    }
  },

  getViewportRatio(size) {
    return (size.width / size.height).toPrecision(2)
  },

  /**
   * Rounds numbers.
   */
  roundXtoY(x, y) {
    var upper = Math.ceil(x/y) * y
    var lower = Math.floor(x/y) * y

    return (x - lower < upper - x) ? lower : upper
  },

  createNavigationHandler(link) {
    return function() {
      if (link.target) {
        window.open(link.href, link.target)
      } else {
        window.location = link.href
      }
    }
  },

  getHost(url) {
    return url.replace(config.REGEX.HTTP_PROTOCOL, '').split('/')[0]
  },

  getLink(node) {
    if (node === document.documentElement) {
      return false
    } else if (node.tagName.toLowerCase() === 'a') {
      return node
    } else {
      return this.getLink(node.parentNode)
    }
  },

  getURLParams() {
    let map = {}
    location.href.replace(config.REGEX.QUERY_PARAMS, (m, k, v) => map[k] = v)
    return map
  },

  isArray(item) {
    return Object.prototype.toString.call(item) === '[object Array]'
  },

  regexify(input) {
    input = this.isArray(input) ? input : [input]
    return new RegExp(input.map(s => s.replace(/\./g, '\\.')).join('|'), 'i')
  },

  /**
   * Wraps a function and guards it from being invoked more than once
   *
   * @function callOnce
   * @param   { Function } fn - the function to guard
   * @returns { Function }    - the wrapped function
   */
  callOnce(fn) {
    let called = false

    return function callOnceWrappedFunction() {
      if (called) return
      fn()
      called = true
    }
  }
}

export default util
