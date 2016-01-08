const ready   = require('domready')
const plugins = require('./plugins')
const config  = require('./config')
const util    = require('./util')

const defaults = require('./trackParams')

/**
 * When called with `new`, creates a new instance of the Trackomatic analytics class
 */
class Trackomatic {
  /**
   * Trackomatic class constructor
   *
   * @param  { Object } tracker - Tracker passed in by Google Analytics
   * @param  { Object } options - Trackomatic configuration object
   * @return { Void }
   **/
  constructor(tracker, options={}) {
    window._trackomatic = window._trackomatic || this

    this.util    = util
    this.config  = config
    this.tracker = tracker
    this.options = this.prepare({ ...config.DEFAULTS, ...options })

    ready(this.boot.bind(this))
  }

  /**
   * Prepares the Trackomatic options by converting `options.networks`
   * and `options.files` from Strings or Array<String> into RegExp
   *
   * @param  { Object } options - Trackomatic's options object
   * @return { Object }         - The prepared options object
   **/
  prepare(options) {
    return {
      ...options,
      networks : util.regexify(options.networks),
      files    : util.regexify(options.files)
    }
  }

  /**
   * Loads all of Trackomatic's plugins
   *
   * @return { Void }
   **/
  boot() {
    if (__DEV__ && this.options.debug) {
      console.log(
        'Loaded trackomatic on tracker ' + this.tracker.get('name') +
        ' with the config object ' + JSON.stringify(this.options)
      )

      // window.dataLayer is provided by GTM
      if (typeof dataLayer === typeof undefined) {
        console.warn(
          'Warning: Trackomatic could not find the global \
          "dataLayer" object from GTM. Did you load GTM first?'
        )
      }
    }

    for (let key in plugins) {
      new plugins[key](this)
    }
  }

  /**
   * Sends track parameters to the configured Google Analytics account via
   * the tracker that was passed to the Trackomatic constructor
   *
   * @param  { Object } params - Object of keys and values to send to GA/GTM
   * @return { Void }
   **/
  track(params) {
    params = this.prefix({ ...defaults, ...params })

    this.notifyGA(params)
    this.notifyGTM(params)
  }

  /**
   * When given a trackomatic tracking object, this function will add the
   * configured prefix to the `category` property
   *
   * @param  { Object } params - Tracking object to be prefixed
   * @return { Object }        - The tracking object with prefixed properties
   **/
  prefix({ category, ...params }) {
    const { prefix } = this.options
    return { ...params, category: `${ prefix } - ${ category }` }
  }

  /**
   * Provided `window.dataLayer` exists, `notifyGTM` will push values to it
   *
   * @param  { Object } params - Object of keys and values to send to GTM
   * @return { Void }
   **/
  notifyGTM(params) {
    // extract params that shouldn't be sent to GTM
    const { nonInteraction, hitType, hitCallback, ...GTMParams } = params
    const GTMLoaded = (typeof dataLayer !== typeof undefined)

    if (__DEV__ && this.options.debug) {
      console.log('dataLayer.push(..): ')
      console.log(JSON.stringify(GTMParams, null, '  '))
      return
    }

    GTMLoaded && dataLayer.push(GTMParams)
  }

  /**
   * Sends track parameters to the configured Google Analytics account via
   * the tracker that was passed to the Trackomatic constructor
   *
   * @param  { Object } params - Object of keys and values to send to GTM
   * @return { Void }
   **/
  notifyGA(params) {
    let GAParams = [
      params.hitType,
      params.category,
      params.action,
      params.label,
      params.value,
      {
        nonInteraction : params.nonInteraction,
        hitCallback    : params.hitCallback
      }
    ]

    if (__DEV__ && this.options.debug) {
      console.log('tracker.send(..): ')
      console.log(JSON.stringify(GAParams, null, '  '))
      return
    }

    this.tracker.send(...GAParams)
  }
}

export default Trackomatic
