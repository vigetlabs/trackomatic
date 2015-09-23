const BasePlugin = require('../plugin')

/**
 * Javascript error tracking with message and line number
 *
 * Should use exception tracking in next version:
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
 */
class ErrorReportingPlugin extends BasePlugin {
  install() {
    this.oldonerror = window.onerror

    // this is prone to being replaced or overwritten
    //  by other libraries present in the page
    window.onerror = function(msg, url, line) {
      if (this.oldonerror) {
        this.oldonerror.apply(this, arguments)
      }

      this.__trackomatic__.notifyGA('event', 'FED JavaScript Error', msg, url + '_' + line, 0, { 'nonInteraction': 1 })
    }
  }
}

module.exports = ErrorReportingPlugin
