let CONFIG = {
  BODY: document.getElementsByTagName('body')[0],

  REGEX: {
    IDEVICE          : /iPad|iPhone|iPod/,
    ANDROID          : /android/i,
    LEADING_SLASH    : /(^\/?)/,
    COOKIE           : /(?:^|; )'+a+'=([^;]*)/,
    QUERY_PARAMS     : /[?&]+([^=&]+)=([^&]*)/gi,
    HTTP_PROTOCOL    : /^https?:\/\//,
    MAILTO_HREF      : /^mailto:/,
    TEL_HREF         : /^TEL:/,
    SPACES           : /\s+/g,
    NON_WORD         : /[^\w\-]+/g,
    MULTIPLE_HYPHENS : /\-\-+/g,
    LEADING_HYPHENS  : /^-+/,
    TRAILING_HYPHENS : /-+$/
  },

  DEFAULTS: {
    debug: false,
    redirectDelay : 100,
    files: '.pdf',
    networks: 'facebook\.com|twitter\.com|instagram\.com|linkedin\.com|pinterest\.com|tumblr\.com|plus\.google\.com'
  },

  MAX_REDIRECT_DELAY: 1000,

  EXCLUDED_KEYS: {
    space    : 32,
    up       : 38,
    down     : 40,
    pageup   : 33,
    pagedown : 34
  }
}

CONFIG.NON_MOBILE_PLATFORM = !CONFIG.REGEX.IDEVICE.test(navigator.platform) &&
                             !CONFIG.REGEX.ANDROID.test(navigator.userAgent)

module.exports = CONFIG
