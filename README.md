# Openroads Analytics
[![Build Status](https://magnum.travis-ci.com/opengovt/openroads-analytics.svg?token=d4tUG3NhuWNZYSxWndVL&branch=master)](https://magnum.travis-ci.com/opengovt/openroads-analytics)

## Development environment
To set up the development environment for this website, you'll need to install the following on your system:

- [Node and npm](http://nodejs.org/)
- Ruby and [Bundler](http://bundler.io/), preferably through something like [rvm](https://rvm.io/)
- Gulp ( $ npm install -g gulp )

After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install
```
Will also run `bundle install`

### Getting started

```
$ gulp
```
Compiles the compass files, javascripts, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

After starting it up, try going to http://localhost:3000/#/analytics/177:15:210

> **NOTE:** Currently the endpoint is hardcoded to `http://localhost:4000/admin/municipality`, so
you'll need to run a local copy of the openroads-api server, or else go into models/admin-region.js and
change the base url.

### Other commands
Compile the compass files, javascripts. Use this instead of ```gulp``` if you don't want to watch.
```
$ gulp build
```

The same as `gulp` but without livereloading the website.
```
$ gulp no-reload
```

## Templates

Templates are [mustache](https://github.com/janl/mustache.js).  See `templates/road-network.html` for
an example.