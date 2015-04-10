'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var computeStats = require('../lib/stats.js');

var urlBase = 'http://localhost:4000';
var urlBase = 'https://fast-dawn-4805.herokuapp.com';

module.exports = Backbone.Model.extend({

  urlRoot: urlBase + '/admin/municipality',

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


