let provide       = require('./provide')
let shouldProvide = require('./shouldProvide')
let Trackomatic   = require('./trackomatic')

// Only provide trackomatic to IE9+
if (shouldProvide) {
  provide('trackomatic', Trackomatic)
}
