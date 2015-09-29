const BasePlugin = require('../plugin')

/**
 * Tracks JavasSript errors with message and line number
 *
 * Should use exception tracking in next version:
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
 *
 * @extends {Plugin}
 */
class ErrorReportingPlugin extends BasePlugin {

  /**
   * The setup function for this plugin
   *
   * @returns { Void }
   */
  install() {
    this.oldonerror = window.onerror

    // this is prone to being replaced or overwritten
    // by other libraries present in the page
    // TODO: better error tracking
    window.onerror = (msg, url, line) => {
      if (this.oldonerror) {
        this.oldonerror.apply(this, arguments)
      }

      this.track({
        category : 'JavaScript Error',
        action   : msg,
        label    : `${ url } @ Line ${ line }`
      })
    }
  }
}

export default ErrorReportingPlugin
