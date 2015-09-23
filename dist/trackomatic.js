/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var provide = __webpack_require__(1);
	var shouldProvide = __webpack_require__(2);
	var Trackomatic = __webpack_require__(3);

	// Only provide trackomatic to IE9+
	if (shouldProvide) {
	  provide('trackomatic', Trackomatic);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Provides a plugin name and constructor function to analytics.js.
	 * Note: This function works even if the site has customized the GA global identifier.
	 *
	 * @param {string} pluginName - the name of the plugin to provide to GA
	 * @param {function} pluginConstructor - a constructor function for the provided plugin
	 */
	'use strict';

	module.exports = function providePlugin(pluginName, pluginConstructor) {
	  var ga = window[window['GoogleAnalyticsObject'] || 'ga'];

	  if (ga) {
	    ga('provide', pluginName, pluginConstructor);
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	module.exports = 'querySelector' in document && 'localStorage' in window && 'addEventListener' in window;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var ready = __webpack_require__(4);
	var plugins = __webpack_require__(5);
	var config = __webpack_require__(12);
	var util = __webpack_require__(13);

	/**
	 * @constructor
	 * @param {object} tracker - Passed in by GA
	 * @param {object} options - Trackomatic configuration object
	 */

	var Trackomatic = (function () {
	  function Trackomatic(tracker) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Trackomatic);

	    window._trackomatic = window._trackomatic || this;

	    this.util = util;
	    this.config = config;
	    this.tracker = tracker;
	    this.options = _extends({}, config.DEFAULTS, options);

	    ready(this.boot.bind(this));
	  }

	  Trackomatic.prototype.boot = function boot() {
	    console.log('Loaded trackomatic on tracker ' + this.tracker.get('name') + ' with the config object ' + JSON.stringify(this.options));

	    for (var key in plugins) {
	      new plugins[key](this);
	    }
	  };

	  /**
	   * Provided `dataLayer` exists, this function will push values to it
	   **/

	  Trackomatic.prototype.notifyGTM = function notifyGTM(props) {
	    if (this.options.debug) {
	      return console.log('\n        dataLayer.push(..): ' + JSON.stringify(props) + '\n      ');
	    }

	    if (typeof dataLayer !== typeof undefined) {
	      dataLayer.push(props);
	    } else {
	      console.warn('\n        Warning: Trackomatic could not find the global "dataLayer" object from GTM. Did you load GTM first?\n      ');
	    }
	  };

	  /**
	   * Pass along the provided information to Google Analytics
	   **/

	  Trackomatic.prototype.notifyGA = function notifyGA() {
	    var _tracker;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    if (this.options.debug) {
	      return console.log('\n        tracker.send(..): ' + args + '\n      ');
	    }

	    (_tracker = this.tracker).send.apply(_tracker, args);
	  };

	  return Trackomatic;
	})();

	module.exports = Trackomatic;

/***/ },
/* 4 */
/***/ function(module, exports) {

	// DOM ready check in plain js taken from https://github.com/jfriend00/docReady
	"use strict";

	(function (funcName, baseObj) {
	  "use strict";
	  // The public function name defaults to window.docReady
	  // but you can modify the last line of this function to pass in a different object or method name
	  // if you want to put them in a different namespace and those will be used instead of
	  // window.docReady(...)
	  funcName = funcName || "docReady";
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
	    if (document.readyState === "complete") {
	      ready();
	    }
	  }

	  // This is the one public interface
	  // docReady(fn, context);
	  // the context argument is optional - if present, it will be passed
	  // as an argument to the callback
	  baseObj[funcName] = function (callback, context) {
	    // if ready has already fired, then just schedule the callback
	    // to fire asynchronously, but right away
	    if (readyFired) {
	      setTimeout(function () {
	        callback(context);
	      }, 1);
	      return;
	    } else {
	      // add the function and context to the list
	      readyList.push({ fn: callback, ctx: context });
	    }
	    // if document already ready to go, schedule the ready function to run
	    // IE only safe when readyState is "complete", others safe when readyState is "interactive"
	    if (document.readyState === "complete" || !document.attachEvent && document.readyState === "interactive") {
	      setTimeout(ready, 1);
	    } else if (!readyEventHandlersInstalled) {
	      // otherwise if we don't have event handlers installed, install them
	      // first choice is DOMContentLoaded event
	      document.addEventListener("DOMContentLoaded", ready, false);
	      // backup is window load event
	      window.addEventListener("load", ready, false);

	      readyEventHandlersInstalled = true;
	    }
	  };
	})("docReady", window);
	// modify this previous line to pass in your own method name
	// and object for the method to be attached to

	module.exports = window.docReady;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  firstInputPlugin: __webpack_require__(6),
	  errorReportingPlugin: __webpack_require__(9),
	  linkTrackingPlugin: __webpack_require__(10),
	  viewportTrackingPlugin: __webpack_require__(11)
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BasePlugin = __webpack_require__(7);
	var once = __webpack_require__(8);

	/**
	 * Tracks what the first interaction mode is (mouse, touch, keyboard)
	 */

	var FirstInputPlugin = (function (_BasePlugin) {
	  _inherits(FirstInputPlugin, _BasePlugin);

	  function FirstInputPlugin() {
	    _classCallCheck(this, FirstInputPlugin);

	    _BasePlugin.apply(this, arguments);
	  }

	  FirstInputPlugin.prototype.install = function install() {
	    this.firstInputRecorded = false;

	    once(window, this.getMouseEvent(), this.onMouseInput.bind(this));
	    once(window, 'touchstart', this.onTouchInput.bind(this));
	    once(window, 'keydown', this.onKeyboardInput.bind(this));
	  };

	  /**
	   * Returns the proper name of the mouse event for this environment
	   **/

	  FirstInputPlugin.prototype.getMouseEvent = function getMouseEvent() {
	    var event = 'mousedown';

	    if (window.PointerEvent) {
	      event = 'pointerdown';
	    } else if (window.MSPointerEvent) {
	      event = 'MSPointerDown';
	    }

	    return event;
	  };

	  FirstInputPlugin.prototype.onMouseInput = function onMouseInput(e) {
	    this.recordFirstInput('mouse', this.__trackomatic__.util.keyCode(e));
	  };

	  FirstInputPlugin.prototype.onTouchInput = function onTouchInput(e) {
	    this.recordFirstInput('touch', this.__trackomatic__.util.keyCode(e));
	  };

	  FirstInputPlugin.prototype.onKeyboardInput = function onKeyboardInput(e) {
	    e = e || window.event;
	    var code = this.__trackomatic__.util.keyCode(e);
	    var blacklist = this.__trackomatic__.config.EXCLUDED_KEYS;

	    /**
	     * Intent is to filter out keys such as SPACE, UP, DOWN, etc.
	     * that a keyboard user might initially use in place of scrolling
	     */
	    var shouldRecordKey = true;

	    if (e.metaKey || e.ctrlKey || e.altKey) {
	      shouldRecordKey = false;
	    }

	    for (var key in blacklist) {
	      if (code === blacklist[key]) {
	        shouldRecordKey = false;
	      }
	    }

	    if (shouldRecordKey) {
	      this.__trackomatic__.notifyGTM({ 'fed-firstkeycode': code });
	      this.recordFirstInput('keyboard', code);
	    }
	  };

	  /**
	   * Records the first input used. Does nothing after the first call.
	   *
	   * @param {string} type - the type of interaction ('click', 'touchstart', etc.)
	   * @param {string} keyCode - the code describing which key was pressed
	   */

	  FirstInputPlugin.prototype.recordFirstInput = function recordFirstInput(type, keyCode) {
	    if (!this.firstInputRecorded) {
	      this.recordInput(type, keyCode, 'fed-firstinput', 'FED First Input');
	      this.firstInputRecorded = true;
	    }
	  };

	  /**
	   * Records a user interaction, pushing it to dataLayer with the specified
	   * dataLayerEvent name and to the tracker with the specified interactionLabel.
	   *
	   * @param {string} type - the type of interaction ('click', 'touchstart', etc.)
	   * @param {string} keyCode - the code describing which key was pressed
	   * @param {string} dataLayerEvent - an event label for dataLayer
	   * @param {string} interactionLabel - a human-friendly title to label the interaction
	   */

	  FirstInputPlugin.prototype.recordInput = function recordInput(type, keyCode, dataLayerEvent, interactionLabel) {
	    var _trackomatic__$notifyGTM;

	    this.__trackomatic__.notifyGA('event', interactionLabel, type, keyCode || 'none', 0, { 'nonInteraction': 1 });
	    this.__trackomatic__.notifyGTM((_trackomatic__$notifyGTM = {}, _trackomatic__$notifyGTM[dataLayerEvent] = type, _trackomatic__$notifyGTM));
	  };

	  return FirstInputPlugin;
	})(BasePlugin);

	module.exports = FirstInputPlugin;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Plugin = function Plugin(instance) {
	  _classCallCheck(this, Plugin);

	  this.__trackomatic__ = instance;
	  this.install();
	};

	module.exports = Plugin;

/***/ },
/* 8 */
/***/ function(module, exports) {

	// IE9+ equivalent to jQuery.one(..)
	"use strict";

	module.exports = function once(node, evName, callback) {
	  var fn = function fn(e) {
	    callback(e);
	    node.removeEventListener(evName, fn);
	  };

	  node.addEventListener(evName, fn, false);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BasePlugin = __webpack_require__(7);

	/**
	 * Javascript error tracking with message and line number
	 *
	 * Should use exception tracking in next version:
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
	 */

	var ErrorReportingPlugin = (function (_BasePlugin) {
	  _inherits(ErrorReportingPlugin, _BasePlugin);

	  function ErrorReportingPlugin() {
	    _classCallCheck(this, ErrorReportingPlugin);

	    _BasePlugin.apply(this, arguments);
	  }

	  ErrorReportingPlugin.prototype.install = function install() {
	    this.oldonerror = window.onerror;

	    // this is prone to being replaced or overwritten
	    //  by other libraries present in the page
	    window.onerror = function (msg, url, line) {
	      if (this.oldonerror) {
	        this.oldonerror.apply(this, arguments);
	      }

	      this.__trackomatic__.notifyGA('event', 'FED JavaScript Error', msg, url + '_' + line, 0, { 'nonInteraction': 1 });
	    };
	  };

	  return ErrorReportingPlugin;
	})(BasePlugin);

	module.exports = ErrorReportingPlugin;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BasePlugin = __webpack_require__(7);

	/**
	 * Link tracking
	 */

	var LinkTrackingPlugin = (function (_BasePlugin) {
	  _inherits(LinkTrackingPlugin, _BasePlugin);

	  function LinkTrackingPlugin() {
	    _classCallCheck(this, LinkTrackingPlugin);

	    _BasePlugin.apply(this, arguments);
	  }

	  LinkTrackingPlugin.prototype.install = function install() {
	    document.documentElement.addEventListener('click', this.onTrackedLinkClick.bind(this), false);
	  };

	  LinkTrackingPlugin.prototype.onTrackedLinkClick = function onTrackedLinkClick(e) {
	    var link = this.__trackomatic__.util.getLink(e.target || e.srcElement);

	    // if the clicked element has a link associated with it,
	    // extract the required data for reporting before
	    // redirecting the user to his/her final destination
	    if (link) {
	      var data = this.getVisitData(e, link);

	      if (data) {
	        this.interceptVisit(data.label, data.type, e, link);
	      }
	    }
	  };

	  LinkTrackingPlugin.prototype.getVisitData = function getVisitData(e, link) {
	    var _trackomatic__ = this.__trackomatic__;
	    var util = _trackomatic__.util;
	    var config = _trackomatic__.config;
	    var options = _trackomatic__.options;

	    var url = link.href;
	    var differentHost = util.getHost(url) !== util.getHost(window.location.href);
	    var rightClick = util.keyCode(e) === 3;
	    var metaKey = e.ctrlKey || e.metaKey || e.altKey;

	    // unless rick click or a modifier key is pressed, return the visit data
	    if (!rightClick && !metaKey) {
	      if (url.match(options.files)) {
	        return { label: 'File Click', type: 'click' };
	      } else if (url.match(config.REGEX.MAILTO_HREF)) {
	        return { label: 'Mailto Click', type: 'click' };
	      } else if (url.match(config.REGEX.TEL_HREF)) {
	        return { label: 'Telephone Click', type: 'click' };
	      } else if (differentHost) {
	        return url.match(options.networks) ? { label: 'Social Media Click', type: 'click' } : { label: 'Site Exit', type: e.which };
	      }
	    }
	  };

	  LinkTrackingPlugin.prototype.interceptVisit = function interceptVisit(clickType, keyCode, e, link) {
	    var _trackomatic__2 = this.__trackomatic__;
	    var config = _trackomatic__2.config;
	    var options = _trackomatic__2.options;

	    var url = link.href;
	    var delay = Math.min(options.redirectDelay, config.MAX_REDIRECT_DELAY);
	    var redirect = this.createRedirect(url);

	    // notify GA of this link click
	    this.__trackomatic__.notifyGA('event', clickType, link.hostname, url, { 'hitCallback': redirect });

	    // in case the GA hitCallback doesn't fire, redirect
	    // to the clicked link after the configured delay
	    setTimeout(redirect, delay);

	    e.preventDefault();
	  };

	  LinkTrackingPlugin.prototype.createRedirect = function createRedirect(url) {
	    var _trackomatic__3 = this.__trackomatic__;
	    var util = _trackomatic__3.util;
	    var options = _trackomatic__3.options;

	    if (options.debug) {
	      return function () {};
	    }

	    return util.createNavigationHandler(url);
	  };

	  return LinkTrackingPlugin;
	})(BasePlugin);

	module.exports = LinkTrackingPlugin;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BasePlugin = __webpack_require__(7);

	/**
	 * Viewport tracking
	 */

	var ViewportTrackingPlugin = (function (_BasePlugin) {
	  _inherits(ViewportTrackingPlugin, _BasePlugin);

	  function ViewportTrackingPlugin() {
	    _classCallCheck(this, ViewportTrackingPlugin);

	    _BasePlugin.apply(this, arguments);
	  }

	  ViewportTrackingPlugin.prototype.install = function install() {
	    this.viewportSize = this.__trackomatic__.util.getViewportSize();
	    this.viewportRatio = (this.viewportSize.width / this.viewportSize.height).toPrecision(2);
	    this.simpleViewportSize = this.__trackomatic__.util.roundXtoY(this.viewportSize.width, 100);

	    /**
	     * Notify GTM of the initial viewport related metrics
	     **/
	    this.__trackomatic__.notifyGTM({
	      'fed-viewportwidth': this.viewportSize.width,
	      'fed-viewportheight': this.viewportSize.height,
	      'fed-viewportratio': this.viewportRatio
	    });

	    /**
	     * Notify GA of the initial viewport related metrics
	     **/
	    this.__trackomatic__.notifyGA('event', 'FED Viewport Size', String(this.simpleViewportSize), this.viewportRatio, 0, { 'nonInteraction': 1 });

	    /**
	     * Set up event listeners for viewport tracking
	     **/
	    this.listen();
	  };

	  /**
	   * For browsers that aren't iDevices or Android phones,
	   * listen to resize events and update dimensions in response.
	   *
	   * For all browsers listen to orientationchange events
	   * and update dimensions in response
	   */

	  ViewportTrackingPlugin.prototype.listen = function listen() {
	    window.addEventListener('orientationchange', this.__trackomatic__.util.debounce(this.trackViewportChanges.bind(this), 1000), false);

	    if (this.__trackomatic__.config.NON_MOBILE_PLATFORM) {
	      window.addEventListener('resize', this.__trackomatic__.util.debounce(this.trackViewportChanges.bind(this), 1000), false);
	    }
	  };

	  /**
	   * Updates viewportSize and reports relative changes to GA
	   * in response to window resize or orientation changes
	   */

	  ViewportTrackingPlugin.prototype.trackViewportChanges = function trackViewportChanges() {
	    var event = {};
	    var size = this.__trackomatic__.util.getViewportSize();

	    // Height changed
	    if (size.height > this.viewportSize.height) {
	      event['fed-resize-height'] = 'taller';
	      this.__trackomatic__.notifyGA('event', 'FED Viewport Resize', 'FED Resize Height', 'taller', 0, { 'nonInteraction': 1 });
	    } else if (size.height < this.viewportSize.height) {
	      event['fed-resize-height'] = 'shorter';
	      this.__trackomatic__.notifyGA('event', 'FED Viewport Resize', 'FED Resize Height', 'shorter', 0, { 'nonInteraction': 1 });
	    }

	    // Width changed
	    if (size.width > this.viewportSize.width) {
	      event['fed-resize-width'] = 'wider';
	      this.__trackomatic__.notifyGA('event', 'FED Viewport Resize', 'FED Resize Width', 'wider', 0, { 'nonInteraction': 1 });
	    } else if (size.width < this.viewportSize.width) {
	      event['fed-resize-width'] = 'narrower';
	      this.__trackomatic__.notifyGA('event', 'FED Viewport Resize', 'FED Resize Width', 'narrower', 0, { 'nonInteraction': 1 });
	    }

	    this.viewportSize = size;

	    // Push this viewport change event to GTM
	    this.__trackomatic__.notifyGTM(event);
	  };

	  return ViewportTrackingPlugin;
	})(BasePlugin);

	module.exports = ViewportTrackingPlugin;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	var config = {
	  BODY: document.getElementsByTagName('body')[0],

	  REGEX: {
	    IDEVICE: /iPad|iPhone|iPod/,
	    ANDROID: /android/i,
	    LEADING_SLASH: /(^\/?)/,
	    COOKIE: /(?:^|; )'+a+'=([^;]*)/,
	    QUERY_PARAMS: /[?&]+([^=&]+)=([^&]*)/gi,
	    HTTP_PROTOCOL: /^https?:\/\//,
	    MAILTO_HREF: /^mailto:/,
	    TEL_HREF: /^TEL:/,
	    SPACES: /\s+/g,
	    NON_WORD: /[^\w\-]+/g,
	    MULTIPLE_HYPHENS: /\-\-+/g,
	    LEADING_HYPHENS: /^-+/,
	    TRAILING_HYPHENS: /-+$/
	  },

	  DEFAULTS: {
	    debug: false,
	    redirectDelay: 100,
	    files: '.pdf',
	    networks: 'facebook\.com|twitter\.com|instagram\.com|linkedin\.com|pinterest\.com|tumblr\.com|plus\.google\.com'
	  },

	  MAX_REDIRECT_DELAY: 1000,

	  EXCLUDED_KEYS: {
	    space: 32,
	    up: 38,
	    down: 40,
	    pageup: 33,
	    pagedown: 34
	  }
	};

	config.NON_MOBILE_PLATFORM = !config.REGEX.IDEVICE.test(navigator.platform) && !config.REGEX.ANDROID.test(navigator.userAgent);

	module.exports = config;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var config = __webpack_require__(12);

	/**
	 * Utility functions
	 **/
	var util = {

	  keyCode: function keyCode(e) {
	    e = e || window.event;
	    return e.which || e.keyCode;
	  },

	  /**
	   * Allows easy extraction of domain, pathname, etc off of a full URL.
	   * @param {string} href - the url to parse
	   */
	  createAnchor: function createAnchor(href) {
	    var target = document.createElement('a');
	    target.href = href;
	    return target;
	  },

	  /**
	   * A small wrapper for `createAnchor` that returns just the `pathname`
	   * @param {string} href - the url to parse
	   */
	  getPathname: function getPathname(href) {
	    // normalize the pathname, since IE omits the leading slash.
	    return href && util.createAnchor(href).pathname.replace(config.REGEX.LEADING_SLASH, '/');
	  },

	  /**
	   * Capitalizes the first letter of a string. Useful for combining inconsistent data sources.
	   * @param {string} string - the string to capitalize
	   */
	  capitalize: function capitalize(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	  },

	  /**
	   * Turns strings into slugs. Useful for combining inconsistent data sources.
	   * @param {string} text - the string to slugify
	   */
	  slugify: function slugify(text) {
	    return text.toString().toLowerCase().replace(config.REGEX.SPACES, '-') // Replace spaces with -
	    .replace(config.REGEX.NON_WORD, '') // Remove all non-word chars
	    .replace(config.REGEX.MULTIPLE_HYPHENS, '-') // Replace multiple - with single -
	    .replace(config.REGEX.LEADING_HYPHENS, '') // Trim - from start of text
	    .replace(config.REGEX.TRAILING_HYPHENS, ''); // Trim - from end of text
	  },

	  /**
	   * Reads cookies.
	   */
	  readCookie: function readCookie() {
	    return (config.REGEX.COOKIE.exec(document.cookie) || []).pop();
	  },

	  /**
	   * Writes cookies. This function is a no-op if `_trackomatic.options.nocookie` is `true`.
	   * @param {string} name - the name for the cookie value
	   * @param {mixed} value - the value to be stored as a cookie
	   * @param {number} days - the number of days to store the cookie for
	   */
	  createCookie: function createCookie(name, value, days) {
	    if (_trackomatic.options.nocookie) return;

	    var expires = days ? ' expires=' + new Date(days * 864E5 + new Date().getTime()).toGMTString() : '';
	    document.cookie = name + '=' + value + expires + '; path=/; domain=' + document.location.hostname;
	  },

	  /**
	   * Debounces function calls.
	   */
	  debounce: function debounce(func, wait, immediate) {
	    var timeout;

	    return function () {
	      var context = this;
	      var args = arguments;

	      var later = function later() {
	        timeout = null;
	        if (!immediate) func.apply(context, args);
	      };

	      var callNow = immediate && !timeout;

	      clearTimeout(timeout);
	      timeout = setTimeout(later, wait);

	      if (callNow) func.apply(context, args);
	    };
	  },

	  /**
	   * Gets the viewport size.
	   */
	  getViewportSize: function getViewportSize() {
	    if (typeof window.innerWidth !== 'undefined') {
	      return {
	        width: window.innerWidth,
	        height: window.innerHeight
	      };
	    } else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth !== 0) {
	      return {
	        width: document.documentElement.clientWidth,
	        height: document.documentElement.clientHeight
	      };
	    } else {
	      return {
	        width: config.BODY.clientWidth,
	        height: config.BODY.clientHeight
	      };
	    }
	  },

	  /**
	   * Rounds numbers.
	   */
	  roundXtoY: function roundXtoY(x, y) {
	    var upper = Math.ceil(x / y) * y;
	    var lower = Math.floor(x / y) * y;

	    return x - lower < upper - x ? lower : upper;
	  },

	  createNavigationHandler: function createNavigationHandler(url) {
	    return function () {
	      window.location = url;
	    };
	  },

	  getHost: function getHost(url) {
	    return url.replace(config.REGEX.HTTP_PROTOCOL, '').split('/')[0];
	  },

	  getLink: function getLink(node) {
	    if (node === document.documentElement) {
	      return false;
	    } else if (node.tagName.toLowerCase() === 'a') {
	      return node;
	    } else {
	      return util.getLink(node.parentNode);
	    }
	  },

	  getURLParams: function getURLParams() {
	    var map = {};
	    location.href.replace(config.REGEX.QUERY_PARAMS, function (m, k, v) {
	      return map[k] = v;
	    });
	    return map;
	  }
	};

	module.exports = util;

/***/ }
/******/ ]);