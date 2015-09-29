/**
 * Provides a plugin name and constructor function to analytics.js.
 * Note: This function works even if the site has customized the GA global identifier.
 *
 * @param { String }   pluginName        - The name of the plugin to provide to GA
 * @param { Function } pluginConstructor - A constructor function for the provided plugin
 */
export default function providePlugin(pluginName, pluginConstructor) {
  var ga = window[window['GoogleAnalyticsObject'] || 'ga']

  if (ga) {
    ga('provide', pluginName, pluginConstructor)
  }
}
