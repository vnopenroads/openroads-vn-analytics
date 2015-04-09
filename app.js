'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var Router = require('./routes.js');

console.log('Welcome to the Philippines OpenRoads project.' +
        ' Built with &hearts; by Development Seed'+
        ' https://developmentseed.org.');

// initialize the router.
window.router = new Router();
Backbone.history.start();

