'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var computeStats = require('../lib/stats.js').computeStats;

module.exports = Backbone.Model.extend({

  constructor: function(adminList) {
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


