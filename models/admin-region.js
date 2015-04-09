'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var computeStats = require('../lib/stats.js');

module.exports = Backbone.Model.extend({

  urlRoot: 'http://localhost:4000/admin/municipality',

  initialize: function() {
  },

  defaults: {
  },

  parse: function(response, options)  {
    console.log('parse', response);
    return _.extend(computeStats(response.roads, response.subregions), {
      properties: response.roads.properties
    });
  },

});


