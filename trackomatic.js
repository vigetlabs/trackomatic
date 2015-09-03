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

var BODY = document.getElementsByTagName('body')[0];

var CONSTANTS = {
  REGEX: {
    IDEVICE          : /iPad|iPhone|iPod/,
    ANDROID          : /android/i,
    LEADING_SLASH    : /(^\/?)/,
    COOKIE           : /(?:^|; )'+a+'=([^;]*)/,
    QUERY_PARAMS     : /[?&]+([^=&]+)=([^&]*)/gi,
    HTTP_PROTOCOL    : /^https?:\/\//,
    MAILTO_HREF      : /^mailto:/,
    TEL_HREF         : /^TEL:/,
    SPACES           : /\s+/g,
    NON_WORD         : /[^\w\-]+/g,
    MULTIPLE_HYPHENS : /\-\-+/g,
    LEADING_HYPHENS  : /^-+/,
    TRAILING_HYPHENS : /-+$/
  }
}

// Provides a plugin name and constructor function to analytics.js. This
// function works even if the site has customized the ga global identifier.
function providePlugin(pluginName, pluginConstructor) {
  var ga = window[window['GoogleAnalyticsObject'] || 'ga'];
  if (ga) ga('provide', pluginName, pluginConstructor);
}

// Plugin constructor.
//Everything takes place inside this.
function Trackomatic(tracker, config) {

  //Check for the trackomatic object globally; instantiate a local one if it's not set.
  window._trackomatic = window._trackomatic || {};

  // Sanity check
  _trackomatic.config = typeof config !== 'undefined' ? config : {};

  console.log(
    'Loaded trackomatic on tracker ' + tracker.get('name') + \
    ' with the config object ' + JSON.stringify(config)
  );


  // Javascript error tracking with message and line number
  // Should use exception tracking in next version: https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
  // Would also be worth sampling + throttling
  var oldonerror = window.onerror;

  window.onerror = function(msg, url, line) {
    if (oldonerror) {
      oldonerror.apply(this, arguments);
    }
    tracker.send('event', 'FED JavaScript Error', msg, url + '_' + line, 0, { 'nonInteraction': 1 });
  };

  // Viewport tracking
  var viewportSize = getViewportSize();
  var viewportRatio = (viewportSize.width / viewportSize.height).toPrecision(2);
  var simpleviewportSize = roundXtoY(viewportSize.width, 100);

  dataLayer.push({
    'fed-viewportwidth'  : viewportSize.width,
    'fed-viewportheight' : viewportSize.height,
    'fed-viewportratio'  : viewportRatio
  });

  tracker.send('event', 'FED Viewport Size', String(simpleviewportSize), viewportRatio, 0, { 'nonInteraction': 1 });

  // Resizing tracking
  var diffDimensions = function() {
    var newSize = getViewportSize();
    var event = {};

    if (newSize.height > viewportSize.height) {
      event['fed-resize-height'] = 'taller';
      tracker.send('event', 'FED Viewport Resize', 'FED Resize Height', 'taller', 0, { 'nonInteraction': 1 });
    } else if (newSize.height < viewportSize.height) {
      event['fed-resize-height'] = 'shorter';
      tracker.send('event', 'FED Viewport Resize', 'FED Resize Height', 'shorter', 0, { 'nonInteraction': 1 });
    }

    if (newSize.width > viewportSize.width) {
      event['fed-resize-width'] = 'wider';
      tracker.send('event', 'FED Viewport Resize', 'FED Resize Width', 'wider', 0, { 'nonInteraction': 1 });
    } else if (newSize.width < viewportSize.width) {
      event['fed-resize-width'] = 'narrower';
      tracker.send('event', 'FED Viewport Resize', 'FED Resize Width', 'narrower', 0, { 'nonInteraction': 1 });
    }

    viewportSize = newSize;
    dataLayer.push(event);
  }

  if (window.addEventListener) {
    if (!CONSTANTS.REGEX.IDEVICE.test(navigator.platform) && !CONSTANTS.REGEX.ANDROID.test(navigator.userAgent)) {
      window.addEventListener('resize', debounce(diffDimensions, 1000));
    }
    window.addEventListener('orientationchange', debounce(diffDimensions, 1000));
  }

  // Input method tracking
  var firstInputRecorded = false;
  var mouseEvent = 'mousedown';
  var nonViewKeys = {
    space    : 32,
    up       : 38,
    down     : 40,
    pageup   : 33,
    pagedown : 34
  };

  var recordInput = function(type, keyCode) {
    if (!firstInputRecorded) {
      dataLayer.push({ 'fed-firstinput': type });
      tracker.send('event', 'FED First Input', type, event.keyCode || 'none', 0, { 'nonInteraction': 1 });
      firstInputRecorded = true;
    }
  }

  if (window.PointerEvent) {
    mouseEvent = 'pointerdown'
  } else if (window.MSPointerEvent) {
    mouseEvent = 'MSPointerDown';
  }

  window.addEventListener('keydown', function(event) {
    // this is pretty fuzzy, but we want to filter out keys like space, up, down, etc
    // that a keyboard user might initially use in place of scrolling
    var nonViewKey = true;

    if (event.metaKey || event.ctrlKey || event.altKey) {
      nonViewKey = false;
    }

    for (key in nonViewKeys) {
      if (event.keyCode === nonViewKeys[key]) {
        nonViewKey = false;
      }
    }

    if (nonViewKey) {
      if (!firstInputRecorded) dataLayer.push({ 'fed-firstkeycode': event.keyCode });
      var keyCode = event.keyCode;
      recordInput('keyboard', keyCode);
    }
  });

  window.addEventListener('touchstart', function() {
    recordInput('touch');
  });

  window.addEventListener(mouseEvent, function() {
    recordInput('mouse');
  });

  // Utility functions

  // getElem: allows you to quickly get the domain, pathname, etc off of a full URL.
  function getElem(href) {
    var target = document.createElement('a');
    target.href = href;
    return target;
  }

  // getPathname: A light wrapper for getElem (above) for directly getting the pathname
  function getPathname(href) {
    // normalize the pathname, since IE omits the leading slash.
    return href && getElem(href).pathname.replace(CONSTANTS.REGEX.LEADING_SLASH,'/');
  }

  // capitalize: Simply capitalizes the first letter of a string. Useful for combining inconsistent data sources.
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // slugify: Turns strings into slugs. Useful for combining inconsistent data sources.
  function slugify(text) {
    return text.toString()
      .toLowerCase()
      .replace(CONSTANTS.REGEX.SPACES, '-')           // Replace spaces with -
      .replace(CONSTANTS.REGEX.NON_WORD, '')          // Remove all non-word chars
      .replace(CONSTANTS.REGEX.MULTIPLE_HYPHENS, '-') // Replace multiple - with single -
      .replace(CONSTANTS.REGEX.LEADING_HYPHENS, '')   // Trim - from start of text
      .replace(CONSTANTS.REGEX.TRAILING_HYPHENS, ''); // Trim - from end of text
  }

  // shortest readCookie and createCookie functions imaginable
  function readCookie(a) {
    return(CONSTANTS.REGEX.COOKIE).exec(document.cookie)||[]).pop();
  }

  function createCookie(name,value,days) {
    if(_trackomatic.config.nocookie) return;

    var expires = days ? '; expires=' + (new Date(days * 864E5 + (new Date()).getTime())).toGMTString() : '';
    document.cookie = name + '=' + value + expires + '; path=/; domain=' + document.location.hostname;
  }

  /* get: creates a map of the query string variables, a la PHP $_GET.
  So, ?foo=bar -> {'foo' : 'bar'};, accessible as get.foo.
  */
  var get = (function() {
    var map = {};

    location.href.replace(CONSTANTS.REGEX.QUERY_PARAMS, function(m, k, v) {
      map[k] = v;
    });

    return map;
  }());

    // debounce: practice safe javascript
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }

  // getViewportSize: does exactly what it says on the tin
  function getViewportSize() {
    if (typeof window.innerWidth !== 'undefined') {
      return {
        width  : window.innerWidth,
        height : window.innerHeight
      }
    } else if (typeof document.documentElement !== 'undefined'
        && typeof document.documentElement.clientWidth !== 'undefined'
        && document.documentElement.clientWidth !== 0) {
      return {
        width  : document.documentElement.clientWidth,
        height : document.documentElement.clientHeight
      }
    } else {
      return {
        width  : BODY.clientWidth,
        height : BODY.clientHeight
      }
    }
  }

  function roundXtoY(x, y) {
    var upper = Math.ceil(x/y) * y;
    var lower = Math.floor(x/y) * y;

    if (x - lower < upper - x) {
      return lower;
    } else {
      return upper;
    }
  }

  // DOM ready check in plain js taken from https://github.com/jfriend00/docReady
  // call with docReady(fn);
  (function(funcName, baseObj) {
    'use strict';
    // The public function name defaults to window.docReady
    // but you can modify the last line of this function to pass in a different object or method name
    // if you want to put them in a different namespace and those will be used instead of
    // window.docReady(...)
    funcName = funcName || 'docReady';
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
      if (!readyFired) {
        // this must be set to true before we start calling callbacks
        readyFired = true;
        for (var i = 0; i < readyList.length; i++) {
          // if a callback here happens to add new ready handlers,
          // the docReady() function will see that it already fired
          // and will schedule the callback to run right after
          // this event loop finishes so all handlers will still execute
          // in order and no new ones will be added to the readyList
          // while we are processing the list
          readyList[i].fn.call(window, readyList[i].ctx);
        }
        // allow any closures held by these functions to free
        readyList = [];
      }
    }

    function readyStateChange() {
      if ( document.readyState === 'complete' ) {
        ready();
      }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
      // if ready has already fired, then just schedule the callback
      // to fire asynchronously, but right away
      if (readyFired) {
        setTimeout(function() {
          callback(context);
        }, 1);

        return;
      } else {
        // add the function and context to the list
        readyList.push({ fn: callback, ctx: context });
      }
      // if document already ready to go, schedule the ready function to run
      // IE only safe when readyState is 'complete', others safe when readyState is 'interactive'
      if (document.readyState === 'complete' || (!document.attachEvent && document.readyState === 'interactive')) {
        setTimeout(ready, 1);
      } else if (!readyEventHandlersInstalled) {
        // otherwise if we don't have event handlers installed, install them
        if (document.addEventListener) {
          // first choice is DOMContentLoaded event
          document.addEventListener('DOMContentLoaded', ready, false);
          // backup is window load event
          window.addEventListener('load', ready, false);
        } else {
          // must be IE
          document.attachEvent('onreadystatechange', readyStateChange);
          window.attachEvent('onload', ready);
        }
        readyEventHandlersInstalled = true;
      }
    }
  })('docReady', window);

  // Everything in docReady happens after the DOM loads.
  docReady(function() {
    (function() {
      var eventMethod  = document.addEventListener ? 'addEventListener' : 'attachEvent'
      var eventName    = document.addEventListener ? 'click'            : 'onclick'
      var trackedFiles = typeof _trackomatic.config.files !== 'undefined'
        ? _trackomatic.config.files
        : '.pdf';
      var trackedNetworks = typeof _trackomatic.config.networks !== 'undefined'
        ? _trackomatic.config.networks
        : 'facebook\.com|twitter\.com|instagram\.com|linkedin\.com|pinterest\.com|tumblr\.com|plus\.google\.com';

      var followLink = function(href) {
        return function() {
          window.location = href;
        }
      }

      var visit = function(clickType, keyCode, event, link) {
        var url = link.href;
        var delay = typeof _trackomatic.config.redirectDelay !== 'undefined'
          ? _trackomatic.config.redirectDelay
          : 100
        ga('send', 'event', clickType, link.hostname, url, { 'hitCallback': followLink(url) });
        setTimeout(followLink(url), delay);
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
      }

      var getHost = function(url) {
        // necessary because you can't use the a.host trick to get host in IE8, apparently
        return url.replace(CONSTANTS.REGEX.HTTP_PROTOCOL, '').split('/')[0]
      }

      var getVisitData = function(event, link) {
        var url           = link.href;
        var differentHost = getHost(url) !== getHost(window.location.href);
        var rightClick    = event.which === 3;
        var metaKey       = event.ctrlKey || event.metaKey || event.altKey;

        if (!rightClick && !metaKey) {
          if (url.match(trackedFiles)) {
            return ['File Click', 'click'];
          } else if (url.match(CONSTANTS.REGEX.MAILTO_HREF)) {
            return ['Mailto Click', 'click'];
          } else if (url.match(CONSTANTS.REGEX.TEL_HREF)) {
            return ['Telephone Click', 'click'];
          } else if (differentHost) {
            return (url.match(trackedNetworks)) ? ['Social Media Click', 'click'] : ['Site Exit', event.which];
          }
        }
      }

      var getLink = function(node) {
        if (node === document.documentElement) {
          return false;
        } else if (node.tagName.toLowerCase() === 'a') {
          return node;
        } else {
          return getLink(node.parentNode);
        }
      }

      var track = function(event) {
        var link = getLink(event.target || event.srcElement);

        if (link) {
          var data = getVisitData(event, link);
          if (data) visit(data[0], data[1], event, link);
        }
      }

      document.documentElement[eventMethod](eventName, track);
    })()
  });
  // end of docReady()

  // Sharing is caring - these functions are now public
  _trackomatic.util = {
    createCookie    : createCookie,
    readCookie      : readCookie,
    getURLParam     : get,
    getPathname     : getPathname,
    capitalize      : capitalize,
    slugify         : slugify,
    debounce        : debounce,
    getViewportSize : getViewportSize
  };
}

// Register the plugin.
providePlugin('trackomatic', Trackomatic);
