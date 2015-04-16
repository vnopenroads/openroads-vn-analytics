'use strict';

var _ = require('underscore');
var Model = require('backbone').Model;
var config = require('../config.js');
var compute = require('../lib/stats.js').computeStats;

module.exports = Model.extend({

  url: config.apiUrl + '/admin',

  initialize: function() {
    this.url += this.id.urlString();
    return this
  },

  parse: function(response) {
    return _.extend(compute(response.roads, response.subregions), {
      properties: response.roads.properties
    });
  }
});
