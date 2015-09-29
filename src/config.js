const config = {
  REGEX: {
    IDEVICE          : /iPad', 'iPhone', 'iPod/,
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
    delimiter: '|',
    redirectDelay : 100,
    prefix: 'Trackomatic',
    files: ['.pdf'],
    networks: ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'pinterest.com', 'tumblr.com', 'plus.google.com']
  },

  MAX_REDIRECT_DELAY: 1000,

  EXCLUDED_KEYS: {
    space    : 32,
    up       : 38,
    down     : 40,
    pageup   : 33,
    pagedown : 34
  },

  KEYS: {
    RIGHT_CLICK: 3
  }
}

config.MOBILE_PLATFORM = config.REGEX.IDEVICE.test(navigator.platform) ||
                         config.REGEX.ANDROID.test(navigator.userAgent)

export default config
