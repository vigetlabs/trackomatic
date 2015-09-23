// IE9+ equivalent to jQuery.one(..)
module.exports = function once(node, evName, callback) {
  let fn = (e) => {
    callback(e)
    node.removeEventListener(evName, fn)
  }

  node.addEventListener(evName, fn, false)
}
