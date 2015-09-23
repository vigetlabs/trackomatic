/**
 * Provides a plugin name and constructor function to analytics.js.
 * Note: This function works even if the site has customized the GA global identifier.
 *
 * @param {string} pluginName - the name of the plugin to provide to GA
 * @param {function} pluginConstructor - a constructor function for the provided plugin
 */
module.exports = function providePlugin(pluginName, pluginConstructor) {
  var ga = window[window['GoogleAnalyticsObject'] || 'ga']

  if (ga) {
    ga('provide', pluginName, pluginConstructor)
  }
}
