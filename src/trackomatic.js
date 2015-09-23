/**
 * @license Copyright 2015 Viget Labs
 * Trackomatic.js Automatic Google Analytics Tracking Version 0.1
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const ready   = require('./ready')
const plugins = require('./plugins')
const config  = require('./config')
const util    = require('./util')

/**
 * @constructor
 * @param {object} tracker - Passed in by GA
 * @param {object} options - Trackomatic configuration object
 */
class Trackomatic {
  constructor(tracker, options={}) {
    window._trackomatic = window._trackomatic || this

    this.util    = util
    this.config  = config
    this.tracker = tracker
    this.options = { ...config.DEFAULTS, ...options }

    ready(this.boot.bind(this))
  }

  boot() {
    console.log(
      'Loaded trackomatic on tracker ' + this.tracker.get('name') +
      ' with the config object ' + JSON.stringify(this.options)
    )

    this.plugins = []

    for (let key in plugins) {
      this.plugins.push(new plugins[key](this))
    }
  }

  /**
   * Provided `dataLayer` exists, this function will push values to it
   **/
  notifyGTM(props) {
    if (this.options.debug) {
      return console.log(`
        dataLayer.push(..): ${ JSON.stringify(props) }
      `)
    }

    if (typeof dataLayer !== typeof undefined) {
      dataLayer.push(props)
    } else {
      console.warn(`
        Warning: Trackomatic could not find the global "dataLayer" object from GTM. Did you load GTM first?
      `)
    }
  }

  /**
   * Pass along the provided information to Google Analytics
   **/
  notifyGA(...args) {
    if (this.options.debug) {
      return console.log(`
        tracker.send(..): ${ args }
      `)
    }

    this.tracker.send(...args)
  }
}

module.exports = Trackomatic
