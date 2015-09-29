const BasePlugin = require('../plugin')

/**
 * Viewport tracking and reporting plugin
 *
 * @extends { Plugin }
 */
class ViewportTrackingPlugin extends BasePlugin {

  /**
   * The setup function for this plugin
   *
   * @return { Void }
   */
  install() {
    let { util } = this.__trackomatic__

    this.viewportSize  = util.getViewportSize()
    this.viewportRatio = util.getViewportRatio(this.viewportSize)
    this.simpleWidth   = util.roundXtoY(this.viewportSize.width, 100)
    this.simpleHeight  = util.roundXtoY(this.viewportSize.height, 100)

    // track width
    this.track({
      category : 'Viewport',
      action   : 'Initial Width',
      label    : String(this.simpleWidth)
    })

    // track height
    this.track({
      category : 'Viewport',
      action   : 'Initial Height',
      label    : String(this.simpleHeight)
    })

    // track ratio
    this.track({
      category : 'Viewport',
      action   : 'Initial Ratio',
      label    : String(this.viewportRatio)
    })

    // Set up event listeners for viewport tracking
    this.listen()
  }

  /**
   * For browsers that aren't iDevices or Android phones,
   * listen to resize events and update dimensions in response.
   *
   * For all browsers listen to orientationchange events
   * and update dimensions in response
   *
   * @return { Void }
   */
  listen() {
    window.addEventListener(
      'orientationchange',
      this.__trackomatic__.util.debounce(this.trackViewportChanges.bind(this), 1000),
      false
    )

    // if NOT a mobile platform
    if (!this.__trackomatic__.config.MOBILE_PLATFORM) {
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
   *
   * @return { Void }
   */
  trackViewportChanges() {
    let size    = this.__trackomatic__.util.getViewportSize()
    let changes = this.calculateViewportChanges(size, this.viewportSize)

    // Track height changes
    if (changes.height) {
      this.track({
        category : 'Viewport',
        action   : 'Resize Height',
        label    : changes.height
      })
    }

    // Track width changes
    if (changes.width) {
      this.track({
        category : 'Viewport',
        action   : 'Resize Width',
        label    : changes.width
      })
    }

    this.viewportSize = size
  }

  /**
   * Updates viewportSize and reports relative changes to GA
   * in response to window resize or orientation changes
   *
   * @param { Object }   p - The "previous" viewport size
   * @param { Obejct }   n - The "next" viewport size
   * @return { Object }   - Relative width and height changes
   */
  calculateViewportChanges(p, n) {
    return {
      height : p.height > n.height ? 'taller' : p.height < n.height ? 'shorter'  : null,
      width  : p.width  > n.width  ? 'wider'  : p.width  < n.width  ? 'narrower' : null
    }
  }

}

export default ViewportTrackingPlugin
