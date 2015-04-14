'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var computeStats = require('../lib/stats.js').computeStats;
var config = require('../config.js');

var urlBase = config.apiUrl;

module.exports = Backbone.Model.extend({

  urlRoot: urlBase + '/admin',

  initialize: function() {
  },

  defaults: {
  },

  parse: function(response) {
    console.log('parse', response);
    return _.extend(computeStats(response.roads, response.subregions), {
      properties: response.roads.properties
    });
  },

});


