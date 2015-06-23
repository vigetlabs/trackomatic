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

## Features

### Ecommerce tracking

### Events
- JS errors
- Viewport dimensions
- Viewport change

To add:
- Form submits
- File clicks
- Site exits
- Social media clicks
- Scroll tracking

### Custom Variables

To add:
- Optimizely experiments

### Social Tracking

### Misc. Tools
On modern browsers, Trackomatic will strip utm parameters to avoid misattribution.

## Configuration (not yet implemented)

Trackomatic accepts parameters to customize its tracking. Configuration parameters are passed as a configuration object when you initialize a plugin instance.

```javascript
ga('create', 'UA-XXXXX-Y', 'auto');
ga('require', 'trackomatic', {files: '/log', debug: true});
ga('send', 'pageview');
````

## Public Functions
Trackomatic.js makes certain internal utility functions public by way of the global trackomatic object. The following functions are available under trackomatic.util:

- createCookie
- readCookie
- getURLParam
- getPathname
- proper
- slugify
- debounce
