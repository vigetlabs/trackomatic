class Plugin {
  constructor(instance) {
    this.__trackomatic__ = instance
    this.install()
  }
}

module.exports = Plugin
