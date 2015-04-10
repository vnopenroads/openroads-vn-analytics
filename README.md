# Developing

Clone the repo, then:

```
npm install
npm start
```

This runs a `beefy` server that watches for changes and rebundles the js.  After starting it up,
try going to http://localhost:9966/#/analytics/177:15:210

**NOTE:** Currently the endpoint is hardcoded to `http://localhost:4000/admin/municipality`, so
you'll need to run a local copy of the openroads-api server, or else go into models/admin-region.js and
change the base url.


## Templates

Templates are [mustache](https://github.com/janl/mustache.js).  See `templates/road-network.html` for
an example.


# Deploying

This isn't entirely done.  The dev server (beefy), automatically generates index.html on each request,
so we'll actually want to use our own boilerplate one for distribution.  Once we have that, just have
to bundle up the app with: `npm run bundle`, which will create a single js file in `dist/`.  (We can
also factor Backbone/jquery out of that bundle and just reference CDN's directly for better caching.)
