# Trackomatic: Automatic Google Analytics Tracking

## About

Trackomatic is a high-performance tracking enhancement for Google Analytics. It standardizes common tracking setups and saves setup time. 

Note: Trackomatic.js is only compatible with Universal Analytics (analytics.js), not the older asynchronous Google Analytics (ga.js).

## Installation

To use Trackomatic, simply load trackomatic.js on your site and configure it as a plugin in your existing Google Analytics snippet. If you have installed GA through Google Tag Manager, you'll have to set a custom field.

```javascript
ga('create', 'UA-XXXXX-Y', 'auto');
ga('require', 'trackomatic');
ga('send', 'pageview');
````

## Custom Events
- JS errors: when an on-page script throws an error, we send some basic diagnostic information back to GA.
- Viewport size: GA already tracks screen resolutions, but many people size their browser to only take up part of their screen, which can impact how we display content. Trackomatic fires an event when the page loads with details of viewport size and ratio.
- Viewport resize: when a visitor resizes their browser, Trackomatic fires an event with additional details.
- Generic click tracking: clicks on files, outbound links, email links, and telephone links.
- First input method: after filtering out inputs used for scrolling, what is the first input type used on a webpage?

## Configuration

Trackomatic accepts parameters to customize its tracking. Configuration parameters are passed as a configuration object when you initialize a plugin instance.

```javascript
ga('create', 'UA-XXXXX-Y', 'auto');
ga('require', 'trackomatic', {files: '/log', debug: true});
ga('send', 'pageview');
````

There are currently three configuration options:

**files**: takes a regex of file extensions to check against, and will fire an event on click. If no files are specified, Trackomatic will check for .pdf files only.

**networks**: takes a regex of social media networks, and will fire an event on click. If no networks are specified, Trackomatic will track the following networks:

- Facebook
- Twitter
- Instagram
- LinkedIn
- Pinterest
- Tumblr
- Google Plus

**redirectDelay**: to make sure our tracking data reaches Google’s servers before a page reloads, Trackomatic adds in a small delay before loading the new page. By default, this delay is 100 milliseconds. You can make it longer or shorter if you prefer.

## Public Functions
Trackomatic.js makes certain internal utility functions public by way of the global trackomatic object. The following functions are available under trackomatic.util:

- createCookie
- readCookie
- getURLParam
- getPathname
- proper
- slugify
- debounce
