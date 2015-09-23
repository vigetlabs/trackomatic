const BasePlugin = require('../plugin')

/**
 * Viewport tracking
 */
class ViewportTrackingPlugin extends BasePlugin {

  install() {
    this.viewportSize       = this.__trackomatic__.util.getViewportSize()
    this.viewportRatio      = (this.viewportSize.width / this.viewportSize.height).toPrecision(2)
    this.simpleViewportSize = this.__trackomatic__.util.roundXtoY(this.viewportSize.width, 100)

    /**
     * Notify GTM of the initial viewport related metrics
     **/
    this.__trackomatic__.notifyGTM({
      'fed-viewportwidth'  : this.viewportSize.width,
      'fed-viewportheight' : this.viewportSize.height,
      'fed-viewportratio'  : this.viewportRatio
    })

    /**
     * Notify GA of the initial viewport related metrics
     **/
    this.__trackomatic__.notifyGA('event', 'FED Viewport Size', String(this.simpleViewportSize), this.viewportRatio, 0, { 'nonInteraction': 1 })

    /**
     * Set up event listeners for viewport tracking
     **/
    this.listen()
  }

  /**
   * For browsers that aren't iDevices or Android phones,
   * listen to resize events and update dimensions in response.
   *
   * For all browsers listen to orientationchange events
   * and update dimensions in response
   */
  listen() {
    window.addEventListener(
      'orientationchange',
      this.__trackomatic__.util.debounce(this.trackViewportChanges.bind(this), 1000),
      false
    )

    if (this.__trackomatic__.config.NON_MOBILE_PLATFORM) {
      window.addEventListener(
        'resize',
        this.__trackomatic__.util.debounce(this.trackViewportChanges.bind(this), 1000),
        false
      )
    }
  }

  /**
   * Updates viewportSize and reports relative changes to GA
   * in response to window resize or orientation changes
   */
  trackViewportChanges() {
    let event = {}
    let size  = this.__trackomatic__.util.getViewportSize()

    // Height changed
    if (size.height > this.viewportSize.height) {
      event['fed-resize-height'] = 'taller'
      this.__trackomatic__.notifyGA('event', 'FED Viewport Resize', 'FED Resize Height', 'taller', 0, { 'nonInteraction': 1 })
    } else if (size.height < this.viewportSize.height) {
      event['fed-resize-height'] = 'shorter'
      this.__trackomatic__.notifyGA('event', 'FED Viewport Resize', 'FED Resize Height', 'shorter', 0, { 'nonInteraction': 1 })
    }

    // Width changed
    if (size.width > this.viewportSize.width) {
      event['fed-resize-width'] = 'wider'
      this.__trackomatic__.notifyGA('event', 'FED Viewport Resize', 'FED Resize Width', 'wider', 0, { 'nonInteraction': 1 })
    } else if (size.width < this.viewportSize.width) {
      event['fed-resize-width'] = 'narrower'
      this.__trackomatic__.notifyGA('event', 'FED Viewport Resize', 'FED Resize Width', 'narrower', 0, { 'nonInteraction': 1 })
    }

    this.viewportSize = size

    // Push this viewport change event to GTM
    this.__trackomatic__.notifyGTM(event)
  }
}

module.exports = ViewportTrackingPlugin
