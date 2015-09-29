/**
 * Plugin base class
 **/
class Plugin {
  /**
   * Constructor for Plugin base class
   *
   * @param { Object } instance - Instance of Trackomatic
   * @returns { Void }
   **/
  constructor(instance) {
    this.__trackomatic__ = instance
    this.install()
  }

  /**
   * Passes params along to the instance of Trackomatic
   *
   * @param   { Object } params - The parameters to be tracked
   * @returns { Void }
   **/
  track(params) {
    this.__trackomatic__.track(params)
  }

  /**
   * Boostrap function implemented by subclasses
   *
   * @abstract
   **/
  install() {}
}

export default Plugin
