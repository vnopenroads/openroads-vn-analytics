# Developing

Clone the repo, then:

```
npm install
npm start
```

This runs a `beefy` server that watches for changes and rebundles the js. 

**NOTE:** Currently the endpoint is hardcoded to `http://localhost:4000/admin/municipality`, so
you'll need to run a local copy of the openroads-api server, or else go into models/admin-region.js and
change the base url.
