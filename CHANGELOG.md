# Changelog

Do not forget to tag each release!

## 1.1.1 (current)
- Added ./bin/install script for setting up project dependencies
- Better information in README
- Added ./bin/release for triggering `cap deploy`

## 1.1.0
- Large refactor of codebase modularity, testability focus
- Bugfix: Respect anchor's "target" attribute when creating redirects
- Bugfix: Do not redirect twice (redirect as hitCallback and in setTimeout)
- Better test coverage
- Added auto-documentation using [esdoc](https://esdoc.org)
- Added deployment to S3

## 1.0.0
- Fix for click tracking with meta keys
- Removed feature ideas, which all live in github issues now

```
Uglified : 15kb
Minified : 5.5kb
```

## 0.1.1
- Added changelog.md and contributing.md documents
- Better js error tracking
- FED tracking from Doug Avery: viewport and entry method tracking

```
Uglified : 12kb
```

## 0.1.0
- First release, javascript error tracking, some utility functions
- Apache license

```
Uglified : 8kb
```
