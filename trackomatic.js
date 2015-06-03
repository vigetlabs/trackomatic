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

// Provides a plugin name and constructor function to analytics.js. This
// function works even if the site has customized the ga global identifier.
function providePlugin(pluginName, pluginConstructor) {
  var ga = window[window['GoogleAnalyticsObject'] || 'ga'];
  if (ga) ga('provide', pluginName, pluginConstructor);
}

// Plugin constructor.
//Everything takes place inside this.
function Trackomatic(tracker, config) {
  
  // Sanity check
  console.log('Loaded trackomatic on tracker ' + tracker.get('name'));
  
  // Set defaults
  
    //Check for the trackomatic object globally; instantiate a local one if it's not set.
    window._trackomatic = window._trackomatic || {};  
  
  // Will need to define Optimizely object here one day
  var optimizely = optimizely || [];
  
  // Add analytics object here for debugging flag and multiple calls per event
    // Like maybe push back to dataLayer or other analytics service
  
  // Scroll tracking
    //https://github.com/vigetlabs/trackomatic/issues/1

  // User errors
    // https://github.com/vigetlabs/trackomatic/issues/2
  
  // Optimizely experiment tracking
    //https://github.com/vigetlabs/trackomatic/issues/3

  // File click tracking
    //Decorate .pdf links
    //https://github.com/vigetlabs/trackomatic/issues/4

  // Site exits
    //Decorate links to different subdomains
    //https://github.com/vigetlabs/trackomatic/issues/5
  
  // Data attribute tracking
    //Decorate all links containing data attribute
    //https://github.com/vigetlabs/trackomatic/issues/6

  // Javascript error tracking with message and line number
  // Should use exception tracking in next version: https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
  // Would also be worth sampling + throttling
	var oldonerror = window.onerror;
	window.onerror = function(msg, url, line) {
		if (oldonerror) {
			oldonerror.apply(this, arguments );
		}
		ga('send', 'event', 'JavaScript Error', msg, url + '_' + line, 0, { 'nonInteraction': 1 });
	};

  // Viewport tracking
  var viewportSize = getViewportSize()

  dataLayer.push({
    'fed-viewportwidth'  : viewportSize.width,
    'fed-viewportheight' : viewportSize.height,
    'fed-viewportratio'  : (viewportSize.width / viewportSize.height).toPrecision(2)
  })  

  // Resizing tracking
  var diffDimensions = function() {
    var newSize = getViewportSize()
    var event   = {}
    if (newSize.height > viewportSize.height) {
    event['fed-resize-height'] = 'taller'
    } else if (newSize.height < viewportSize.height) {
    event['fed-resize-height'] = 'shorter'
    }
    if (newSize.width > viewportSize.width) {
    event['fed-resize-width'] = 'wider'
    } else if (newSize.width < viewportSize.width) {
    event['fed-resize-width'] = 'narrower'
    }
    viewportSize = newSize
    dataLayer.push(event)
  }

  if (window.addEventListener) {
    window.addEventListener('resize', debounce(diffDimensions, 1000))
    window.addEventListener('orientationchange', debounce(diffDimensions, 1000))
  }  
  
  
  // Input method tracking

  var firstInputRecorded = false
  var mouseEvent         = 'mousedown'
  var nonViewKeys        = {
    space    : 32,
    up       : 38,
    down     : 40,
    pageup   : 33,
    pagedown : 34
  }
  var recordInput        = function(type) {
    if (!firstInputRecorded) {
    dataLayer.push({ 'fed-firstinput': type })
    firstInputRecorded = true
    }
  }

  if (window.PointerEvent) {
    mouseEvent = 'pointerdown'
  } else if (window.MSPointerEvent) {
    mouseEvent = 'MSPointerDown'
  }

  window.addEventListener('keydown', function(event) {
    // this is pretty fuzzy, but we want to filter out keys like space, up, down, etc
    // that a keyboard user might initially use in place of scrolling
    var nonViewKey = true
    if (event.metaKey || event.ctrlKey || event.altKey) nonViewKey = false
    for (key in nonViewKeys) {
    if (event.keyCode === nonViewKeys[key]) {
      nonViewKey = false
    }
    }
    if (nonViewKey) {
    if (!firstInputRecorded) dataLayer.push({'fed-firstkeycode': event.keyCode})
    recordInput('keyboard')
    }
  })

  window.addEventListener('touchstart', function() {
    recordInput('touch')
  })

  window.addEventListener(mouseEvent, function() {
    recordInput('mouse')
  })
  
  // Utility functions

    //getElem: allows you to quickly get the domain, pathname, etc off of a full URL.
    function getElem(href) {
      var target = document.createElement('a');
      target.href = href;
      return target;
    }
  
    // getPathname: A light wrapper for getElem (above) for directly getting the pathname
    function getPathname(href) {
      //normalize the pathname, since IE omits the leading slash.
      return href && getElem(href).pathname.replace(/(^\/?)/,'/'); 
    }

    // proper: Simply capitalizes the first letter of a string. Useful for combining inconsistent data sources.
    function proper(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    
    // slugify: Turns strings into slugs. Useful for combining inconsistent data sources.
    function slugify() {
          return Text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    }

    // shortest readCookie and createCookie functions imaginable
    function readCookie(a){return(RegExp('(?:^|; )'+a+'=([^;]*)').exec(document.cookie)||[]).pop();}
    function createCookie(name,value,days) {
      if(ga_integration_config.nocookie){return;}
      var expires = days ? '; expires=' + (new Date(days*864E5 + (new Date()).getTime())).toGMTString()  :'';
      document.cookie = name+'='+value+expires+'; path=/; domain='+ga_integration_config.cookiedomain;
    }
  
    /* get: creates a map of the query string variables, a la PHP $_GET.
    So, ?foo=bar -> {'foo' : 'bar'};, accessible as get.foo.
    */
    var get = (function() {
      var map = {};
      location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, k, v) {
        map[k] = v;
      });
      return map;
    } ());
    
    // debounce: practice safe javascript
  var debounce = function(func, wait, immediate) {
    var timeout
    return function() {
      var context = this, args = arguments
      var later = function() {
        timeout = null
        if (!immediate) func.apply(context, args)
      };
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }
  
  // getViewportSize: does exactly what it says on the tin
  var getViewportSize = function() {
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
      width  : document.getElementsByTagName('body')[0].clientWidth,
      height : document.getElementsByTagName('body')[0].clientHeight
    }
    }
  }
    
    //Sharing is caring
    _trackomatic.util = {
      createCookie: createCookie, 
      readCookie: readCookie,
      getURLParam: get,
      getPathname: getPathname,
      proper: proper,
      slugify: slugify,
      debounce: debounce,
      getViewportSize: getViewportSize
    };

    _trackomatic.data = {};

}

// Register the plugin.
providePlugin('trackomatic', Trackomatic);