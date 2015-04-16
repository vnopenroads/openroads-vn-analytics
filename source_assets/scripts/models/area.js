'use strict';

var _ = require('underscore');
var Model = require('backbone').Model;
var get = require('jquery').getJSON;
var ID = require('../lib/id.js');
var config = require('../config.js');
var Cache = require('../lib/cached-area.js');

module.exports = Model.extend({

  url: config.apiUrl + '/subregions',

  initialize: function() {
    this.url += this.id.urlString();
    return this
  },

  addCachedResource: function() {
    this.includeCached = true;
    return this
  },

  parse: function(response) {
    var area = response.meta || {type: null, id: null};
    var history = [];
    switch(area.type) {
      case 4:
        history.push({name: area.NAME_4, id: area.ID_4_OR});
      case 3:
        history.push({name: area.NAME_3, id: area.ID_3_OR});
      case 2:
        history.push({name: area.NAME_2, id: area.ID_2_OR});
      case 1:
        history.push({name: area.NAME_1, id: area.ID_1_OR});
      break;
    }
    history = history.reverse();

    var model = {
      id: this.id.string(),
      subregions: response.adminAreas,
      area: area,
      subtype: this.id.display[this.id.childType()],
      history: history
    }

    if (this.includeCached) {
      var cache = new Cache(this.id);
      var stats = cache.load(model.subregions);
      _.extend(model, stats);
    }

    return model
  },

  httpError: function(e) {
    throw new Error(e);
  },
});
