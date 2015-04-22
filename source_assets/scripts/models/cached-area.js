'use strict';

var _ = require('underscore');
var Model = require('backbone').Model;
var config = require('../config.js');
var Cache = require('../lib/cached-area.js');

module.exports = Model.extend({

  url: config.apiUrl + '/subregions',

  initialize: function() {
    this.url += this.id.urlString();
    return this;
  },

  parse: function(response) {
    var properties = response.meta || {type: null, id: null};

    var model = {
      id: this.id,
      subregions: response.adminAreas,
      properties: properties,
    };

    var cache = new Cache(this.id);
    var stats = cache.load(model.subregions);
    _.extend(model, stats);

    return model;
  }
});
