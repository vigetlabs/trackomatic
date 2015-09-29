/**
 * These requirements define the class of browsers Trackomatic supports
 **/
export default (
  'querySelector' in document &&
  'localStorage' in window &&
  'addEventListener' in window
)
