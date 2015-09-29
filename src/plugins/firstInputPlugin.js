const BasePlugin = require('../plugin')
const once       = require('../once')

/**
 * Tracks what the first interaction mode is (mouse, touch, keyboard)
 *
 * @extends { Plugin }
 */
class FirstInputPlugin extends BasePlugin {

  /**
   * The setup function for this plugin
   *
   * @return { Void }
   */
  install() {
    this.firstInputRecorded = false

    once(window, this.getMouseEvent(), this.onMouseInput.bind(this))
    once(window, 'touchstart',         this.onTouchInput.bind(this))
    once(window, 'keydown',            this.onKeyboardInput.bind(this))
  }

  /**
   * Returns the proper name of the mouse event for this environment
   *
   * @return { String } - the name of the mouse event for this browser
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

  /**
   * Callback for mouse input events
   *
   * @param  { Object } e - the event object
   * @return { Void }
   **/
  onMouseInput(e) {
    this.recordFirstInput('mouse', this.__trackomatic__.util.keyCode(e))
  }

  /**
   * Callback for touch input events
   *
   * @param  { Object } e - the event object
   * @return { Void }
   **/
  onTouchInput(e) {
    this.recordFirstInput('touch', this.__trackomatic__.util.keyCode(e))
  }

  /**
   * Callback for keyboard input events
   *
   * @param  { Object } e - the event object
   * @return { Void }
   **/
  onKeyboardInput(e) {
    e = e || window.event
    let code      = this.__trackomatic__.util.keyCode(e)
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
      // track the first keycode
      this.track({
        category : 'First Input',
        action   : 'First Keycode',
        label    : code
      })

      // also attempt to track this as the first input
      this.recordFirstInput('keyboard', code)
    }
  }

  /**
   * Tracks the first input used. Does nothing after the first call.
   *
   * @param { String } inputType - The type of interaction ('click', 'touchstart', etc.)
   * @param { String } keyCode   - The code describing which key was pressed
   */
  recordFirstInput(inputType, keyCode) {
    if (!this.firstInputRecorded) {
      this.track({
        category : 'First Input',
        action   : inputType,
        label    : keyCode
      })

      this.firstInputRecorded = true
    }
  }
}

export default FirstInputPlugin
