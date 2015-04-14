'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var cachedStats = rfolder('../stats/by_condition');

module.exports = Backbone.Model.extend({

  constructor: function(adminList) {
    window.cached = cachedStats;
    console.log('CACHED!', cachedStats);
    this.adminList = adminList;
    Backbone.Model.call(this, {
      id: adminList.get('id'),
      properties: {},
      stats: [],
      subregions: []
    })
  },

  defaults: {
  },

  fetch: function () {},

  update: function() {
    this.set('subregions', this.adminList.get('subregions'));
    this.set('type', this.adminList.get('type'));
  }

});


