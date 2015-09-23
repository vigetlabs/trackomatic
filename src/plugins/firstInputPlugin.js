const BasePlugin = require('../plugin')
const once       = require('../once')

/**
 * Tracks what the first interaction mode is (mouse, touch, keyboard)
 */
class FirstInputPlugin extends BasePlugin {
  install() {
    this.firstInputRecorded = false

    once(window, this.getMouseEvent(), this.onMouseInput.bind(this))
    once(window, 'touchstart', this.onTouchInput.bind(this))
    once(window, 'keydown', this.onKeyboardInput.bind(this))
  }

  /**
   * Returns the proper name of the mouse event for this environment
   **/
  getMouseEvent() {
    let event = 'mousedown'

    if (window.PointerEvent) {
      event = 'pointerdown'
    } else if (window.MSPointerEvent) {
      event = 'MSPointerDown'
    }

    return event
  }

  onMouseInput(e) {
    this.recordFirstInput('mouse', this.__trackomatic__.util.keyCode(e))
  }

  onTouchInput(e) {
    this.recordFirstInput('touch', this.__trackomatic__.util.keyCode(e))
  }

  onKeyboardInput(e) {
    e = e || window.event
    let code = this.__trackomatic__.util.keyCode(e)
    let blacklist = this.__trackomatic__.config.EXCLUDED_KEYS

    /**
     * Intent is to filter out keys such as SPACE, UP, DOWN, etc.
     * that a keyboard user might initially use in place of scrolling
     */
    let shouldRecordKey = true

    if (e.metaKey || e.ctrlKey || e.altKey) {
      shouldRecordKey = false
    }

    for (let key in blacklist) {
      if (code === blacklist[key]) {
        shouldRecordKey = false
      }
    }

    if (shouldRecordKey) {
      this.__trackomatic__.notifyGTM({ 'fed-firstkeycode': code })
      this.recordFirstInput('keyboard', code)
    }
  }

  /**
   * Records the first input used. Does nothing after the first call.
   *
   * @param {string} type - the type of interaction ('click', 'touchstart', etc.)
   * @param {string} keyCode - the code describing which key was pressed
   */
  recordFirstInput(type, keyCode) {
    if (!this.firstInputRecorded) {
      this.recordInput(type, keyCode, 'fed-firstinput', 'FED First Input')
      this.firstInputRecorded = true
    }
  }

  /**
   * Records a user interaction, pushing it to dataLayer with the specified
   * dataLayerEvent name and to the tracker with the specified interactionLabel.
   *
   * @param {string} type - the type of interaction ('click', 'touchstart', etc.)
   * @param {string} keyCode - the code describing which key was pressed
   * @param {string} dataLayerEvent - an event label for dataLayer
   * @param {string} interactionLabel - a human-friendly title to label the interaction
   */
  recordInput(type, keyCode, dataLayerEvent, interactionLabel) {
    this.__trackomatic__.notifyGA('event', interactionLabel, type, keyCode || 'none', 0, { 'nonInteraction': 1 })
    this.__trackomatic__.notifyGTM({ [dataLayerEvent]: type })
  }
}

module.exports = FirstInputPlugin
