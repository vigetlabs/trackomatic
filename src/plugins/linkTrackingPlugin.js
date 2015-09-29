const BasePlugin = require('../plugin')

/**
 * Tracks link clicks
 *
 * @extends { Plugin }
 */
class LinkTrackingPlugin extends BasePlugin {

  /**
   * The setup function for this plugin
   *
   * @returns { Void }
   */
  install() {
    document.documentElement.addEventListener('click', this.onLinkClick.bind(this), false)
  }

  /**
   * Callback for link click events
   *
   * @param   { Object } e - the event object
   * @returns { Void }
   **/
  onLinkClick(e) {
    let link = this.__trackomatic__.util.getLink(e.target || e.srcElement)

    if (link) {
      let data = this.getVisitData(e, link)

      if (data) {
        this.interceptVisit(e, link, data)
      }
    }
  }

  /**
   * Extracts tracking parameters from a clicked link
   *
   * @param   { Object } e    - the event object
   * @param   { Node }   link - the node that was clicked
   * @returns { Object }      - the extracted category, action, and label for this link
   **/
  getVisitData(e, link) {
    let { util, config, options } = this.__trackomatic__

    let url        = link.href
    let keyCode    = util.keyCode(e)
    let rightClick = keyCode === config.KEYS.RIGHT_CLICK
    let metaKey    = e.ctrlKey || e.metaKey || e.altKey

    // unless right click or a modifier key is pressed, return the visit data
    if (!rightClick && !metaKey) {
      let extractedAttributes = this.extractAutoTrackingAttributes(url)

      if (extractedAttributes) {
        let map = { ...extractedAttributes, label: url }
        let trackomaticAttributes = link.getAttribute('data-trackomatic')

        if (trackomaticAttributes) {
          let [category, action, label] = trackomaticAttributes.split(options.delimiter)

          map.category = category || map.category
          map.action   = action   || map.action
          map.label    = label    || map.label
        }

        return map
      }
    }
  }

  /**
   * Extracts a tracking category and action based on the url of a clicked link
   *
   * @param   { String }        url - The href of the clicked link
   * @returns { Void | Object }     - Extracted parameters based on matching of url
   **/
  extractAutoTrackingAttributes(url) {
    let { util, config, options } = this.__trackomatic__
    let differentHost = util.getHost(url) !== util.getHost(window.location.href)

    if (url.match(options.files)) {
      return { category: 'File Click', action: 'click' }
    } else if (url.match(config.REGEX.MAILTO_HREF)) {
      return { category: 'Mailto Click', action: 'click' }
    } else if (url.match(config.REGEX.TEL_HREF)) {
      return { category: 'Telephone Click', action: 'click' }
    } else if (differentHost) {
      if (url.match(options.networks)) {
        return { category: 'Social Media Click', action: 'click' }
      } else {
        return { category: 'Site Exit', action: util.getHost(url) }
      }
    }
  }

  /**
   * Reports tracking data for the clicked link and then redirects to the link url.
   *
   * @param   { Object } e      - The event object
   * @param   { Node }   link   - The clicked link
   * @param   { Object } params - Category, action, and label
   * @returns { Void }
   **/
  interceptVisit(e, link, { category, action, label }) {
    let { config, options } = this.__trackomatic__

    let delay    = Math.min(options.redirectDelay, config.MAX_REDIRECT_DELAY)
    let redirect = this.createRedirect(link)

    // track visit
    this.track({ category, action, label, hitCallback : redirect })

    // in case the GA hitCallback doesn't fire, redirect
    // to the clicked link after the configured delay
    setTimeout(redirect, delay)

    // prevent the default link click behavior (redirect)
    e.preventDefault()
  }

  /**
   * Creates a function that will redirect to the given url or if dev/debug mode
   * is on this function will return a noop. The redirect function is protected
   * by callOnce which prevents it from being called multiple times.
   *
   * @param   { Node }            link - The clicked link
   * @returns { Void | Function }      - Protected redirect function
   **/
  createRedirect(link) {
    let { util, options } = this.__trackomatic__

    if (__DEV__ && options.debug) {
      return util.noop
    }

    // ensure that this redirect callback can be called no more than once
    return util.callOnce(util.createNavigationHandler(link))
  }

}

export default LinkTrackingPlugin
