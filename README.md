![track-o-matic-logo](https://cloud.githubusercontent.com/assets/1626530/12269511/c77224fa-b91f-11e5-9d06-4627a2d39230.png)

# Trackomatic: A high-performance tracking enhancement for Google Analytics.

* [About](#user-content-about)
* [Usage](#user-content-usage)
* [Installation](#user-content-installation)
* [Tracked Events](#user-content-tracked-events)
* [Configuration](#user-content-configuration)
* [Note: Error Reporting](#user-content-note-error-reporting)
* [Public API](#user-content-public-api)
* [Development](#user-content-development)

## About

Trackomatic is a high-performance tracking enhancement for Google Analytics. It standardizes common tracking setups and saves setup time. 

**Note**: Trackomatic.js is only compatible with Universal Analytics (analytics.js), not the older asynchronous Google Analytics (ga.js).


## Documentation

http://code.viget.com/trackomatic


## Usage

**NOTE** It is highly recommended to use the minified version for production usage.

Trackomatic is published to S3 and served by CloudFront. Urls are scoped by version. You may reference either the unpacked or minified lib based on need. Always used the minified file in production.

https://d1lmnvs8gamzin.cloudfront.net/1.1.1/trackomatic.dev.js
https://d1lmnvs8gamzin.cloudfront.net/1.1.1/trackomatic.min.js

Additionally, if you are less concerned with changes in reporting or feature-set then you may reference the latest version using the following url.

https://d1lmnvs8gamzin.cloudfront.net/latest/trackomatic.dev.js
https://d1lmnvs8gamzin.cloudfront.net/latest/trackomatic.min.js


## Installation

To use Trackomatic, simply load trackomatic.js on your site and configure it as a plugin in your existing Google Analytics snippet. If you have installed GA through Google Tag Manager, you'll have to set a custom field.

```javascript
ga('create', 'UA-XXXXX-Y', 'auto');
ga('require', 'trackomatic');
ga('send', 'pageview');
```


## Tracked Events

* JS errors: when an on-page script throws an error, we send some basic diagnostic information back to GA.
* Viewport size: GA already tracks screen resolutions, but many people size their browser to only take up part of their screen, which can impact how we display content. Trackomatic fires an event when the page loads with details of viewport size and ratio.
* Viewport resize: when a visitor resizes their browser, Trackomatic fires an event with additional details.
* Generic click tracking: clicks on files, outbound links, email links, and telephone links.
* First input method: after filtering out inputs used for scrolling, what is the first input type used on a webpage?


## Configuration

Trackomatic accepts parameters to customize its tracking. Configuration parameters are passed as a configuration object when you initialize a plugin instance.

```javascript
// with trackomatic script included in the page...

ga('create', 'UA-XXXXX-Y', 'auto');
ga('require', 'trackomatic', {
    files: ['.pdf', '.docx', '.pptx'], 
    networks: 'reddit.com', 
    redirectDelay: 100
});

ga('send', 'pageview');
```


### Configuration Options:

**debug**: `true || false`, if `true` then replaces calls to `tracker.send`(GA) and `dataLayer.push`(GTM) with `console.log` statements. **Only applies when the unminified library is included.**

**delimiter**: Default: `|`. Used to parse values in `data-trackomatic` attributes to separate out Category, Action and Label for reporting.

**prefix**: default: "Trackomatic". All events reported to GA / GTM will be prefixed with this string followed by a hyphen. (e.g. `Trackomatic - First Input`)

**redirectDelay**: to make sure our tracking data reaches Google’s servers before a page reloads, Trackomatic adds in a small delay before loading the new page. By default, this delay is 100 milliseconds. You can make it longer or shorter if you prefer. **Warning: setting this value too low risks potential loss of tracking data.**

**files**: takes a single string or array of string file extensions to check against, and will fire an event on click. If no files are specified, Trackomatic will check for `.pdf` files only.

**networks**: takes a single string or array of string social media network URLs, and fires an event on click. If no networks are specified, Trackomatic will track the following networks:

* Facebook
* Twitter
* Instagram
* LinkedIn
* Pinterest
* Tumblr
* Google Plus


## Note: Error Reporting

A service such as Sentry or AirBrake will give the best results. Trackomatic does track JavaScript errors via proxying `window.onerror` which has known drawbacks.


## Public API

Trackomatic.js makes certain internal utility functions public by way of the global trackomatic object. The following functions are available under trackomatic.util:

* `capitalize`
* `createAnchor`
* `createCookie`
* `createNavigationHandler`
* `debounce`
* `getHost`
* `getLink`
* `getPathname`
* `getViewportSize`
* `keyCode`
* `readCookie`
* `getURLParams`
* `roundXtoY`
* `slugify`


## Development

In order to set up and contribute to this project you'll need to configure a few things first. 

To begin, make sure you have Ruby installed.

* Ruby [recommended install guide](https://gorails.com/setup/osx/10.9-mavericks)

Then run the `install` script:

    $ ./bin/install

This will handle the installation and configuration of the following:

* NVM/Node/NPM
* Node Dependencies
* Gems

**Note**: The build script for Trackomatic automatically generates a folder inside `public` with the version number specified in `package.json`. When preparing a new version for release, ensure you have bumped the version accordingly using `npm version <major | minor | patch>`.


## Releases

The release process for Trackomatic has several steps:

1) Generate documentation (using Esdoc)
2) Deploy documentation to gh-pages (using [git-directory-deploy](https://github.com/X1011/git-directory-deploy))
3) Compile Trackomatic from source (dev & prod versions)
4) Sync the compiled files to S3

In order to deploy Trackomatic to S3, you'll need to setup a few environment variables. Run the following command from the root of the project:

    $ cp .env.example .env

Then open `.env` and fill in the missing variables. The following are required in order to deploy to S3.

    AWS_S3_BUCKET=< name of S3 bucket >
    AWS_ACCESS_KEY_ID=< aws access key id >
    AWS_SECRET_ACCESS_KEY=< aws access key secret >

The following are required in order to upload documentation to GitHub.

    GIT_DEPLOY_DIR=docs
    GIT_DEPLOY_BRANCH=gh-pages
    GIT_DEPLOY_TOKEN=< generate using github >

By using a Private GitHub Token we obviate the need for maintainers to log in to git locally. Instead, identity is verified through the generated token.

After setting everything up, deployment is as simple as:

    $ npm run release

This will run through `./bin/build` creating a version directory if needed under `dist` as well as handle symlinking the `latest` directory. Finally the `dist` folder will be sync-ed to S3.
