const BasePlugin = require('../plugin')

/**
 * Link tracking
 */
class LinkTrackingPlugin extends BasePlugin {
  install() {
    document.documentElement.addEventListener('click', this.onTrackedLinkClick.bind(this), false)
  }

  onTrackedLinkClick(e) {
    let link = this.__trackomatic__.util.getLink(e.target || e.srcElement)

    // if the clicked element has a link associated with it,
    // extract the required data for reporting before
    // redirecting the user to his/her final destination
    if (link) {
      let data = this.getVisitData(e, link)

      if (data) {
        this.interceptVisit(data.label, data.type, e, link)
      }
    }
  }

  getVisitData(e, link) {
    let { util, config, options } = this.__trackomatic__
    let url           = link.href
    let differentHost = util.getHost(url) !== util.getHost(window.location.href)
    let rightClick    = util.keyCode(e) === 3
    let metaKey       = e.ctrlKey || e.metaKey || e.altKey

    // unless rick click or a modifier key is pressed, return the visit data
    if (!rightClick && !metaKey) {
      if (url.match(options.files)) {
        return { label: 'File Click', type: 'click' }
      } else if (url.match(config.REGEX.MAILTO_HREF)) {
        return { label: 'Mailto Click', type: 'click' }
      } else if (url.match(config.REGEX.TEL_HREF)) {
        return { label: 'Telephone Click', type: 'click' }
      } else if (differentHost) {
        return (url.match(options.networks))
          ? { label: 'Social Media Click', type: 'click' }
          : { label: 'Site Exit', type: e.which }
      }
    }
  }

  interceptVisit(clickType, keyCode, e, link) {
    let { util, config, options } = this.__trackomatic__
    let url      = link.href
    let delay    = Math.min(options.redirectDelay, config.MAX_REDIRECT_DELAY)
    let redirect = this.createRedirect(url)

    // notify GA of this link click
    this.__trackomatic__.notifyGA('event', clickType, link.hostname, url, { 'hitCallback': redirect })

    // in case the GA hitCallback doesn't fire, redirect
    // to the clicked link after the configured delay
    setTimeout(redirect, delay)

    e.preventDefault()
  }

  createRedirect(url) {
    let { util, options } = this.__trackomatic__

    if (options.debug) {
      return () => {}
    }

    return util.createNavigationHandler(url)
  }

}

module.exports = LinkTrackingPlugin
