/**
 * @license Copyright 2015 Viget Labs
 * Trackomatic.js Automatic Google Analytics Tracking Version 0.1
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *  http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
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

  // Add analytics object here for debugging flag and multiple calls per event
  // Like maybe push back to dataLayer or other analytics service

  // Ecommerce tracking from dataLayer will go here

  // Form submission tracking
    //Decorate form links

  // File click tracking
    //Decorate .pdf links

  // Site exits
    //Decorate links to different sub
  
  // Data attribute tracking
    //Decorate all links containing data attribute

  // Javascript error tracking with message and line number
  // Should use exception tracking in next version: https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
  // Would also be worth sampling + throttling
  function trackJavaScriptError(e) {
    var errMsg = e.message;
    var errSrc = e.filename + ': ' + e.lineno;
    ga('send', 'event', 'JavaScript Error', errMsg, errSrc, { 'nonInteraction': 1 });
  }
  
  // an attempt at making this cross-browser compatible
  if (window.addEventListener) {
    window.addEventListener('error', trackJavaScriptError, false);
  } else if (window.attachEvent) {
    window.attachEvent('onerror', trackJavaScriptError);
  } else {
    window.onerror = trackJavaScriptError;
  }

  // Scroll tracking

  // User errors

  // Set custom dimensions below

  // Optimizely experiment tracking

  // Viewport tracking

  // Utility functions: should make public

    //getElem: allows you to quickly get the domain, pathname, etc off of a full URL.
    function getElem(href) {
      var target = document.createElement("a");
      target.href = href;
      return target;
    }
  
    // getPathname: A light wrapper for getElem (above) for directly getting the pathname
    function getPathname(href) {
      //normalize the pathname, since IE omits the leading slash.
      return href && getElem(href).pathname.replace(/(^\/?)/,"/"); 
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
    function readCookie(a){return(RegExp("(?:^|; )"+a+"=([^;]*)").exec(document.cookie)||[]).pop();}
    function createCookie(name,value,days) {
      if(ga_integration_config.nocookie){return;}
      var expires = days ? "; expires=" + (new Date(days*864E5 + (new Date()).getTime())).toGMTString()  :"";
      document.cookie = name+"="+value+expires+"; path=/; domain="+ga_integration_config.cookiedomain;
    }
  
    /* get: creates a map of the query string variables, a la PHP $_GET.
    So, ?foo=bar -> {"foo" : "bar"};, accessible as get.foo.
    */
    var get = (function() {
      var map = {};
      location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, k, v) {
        map[k] = v;
      });
      return map;
    } ());
    
    //Sharing is caring
    _trackomatic.util = {
      createCookie: createCookie, 
      readCookie: readCookie,
      getURLParam: get,
      getPathname: getPathname,
      proper: proper,
      slugify: slugify
    };

    _trackomatic.data = {};

}

// Register the plugin.
providePlugin('trackomatic', Trackomatic);