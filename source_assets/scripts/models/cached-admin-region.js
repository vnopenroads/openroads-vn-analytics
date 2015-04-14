'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var cachedStats = rfolder('../stats/by_condition');

module.exports = Backbone.Model.extend({

  constructor: function(adminList) {
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

  /*
   * Mimic the schema produced by computeStats
   */
  loadCachedStats: function() {
    var stats = cachedStats[this.get('id')];
    if(!stats) return;
    stats = formatStats(stats.groups);
    var subregions = this.adminList.get('subregions') || [];
    subregions.forEach(function (subr) {
      subr.stats = formatStats(cachedStats[subr.id].groups);
    })
    this.set({
      stats: stats,
      subregions: subregions
    })
  },

  fetch: function () {}

});

function formatStats (grouped) {
  if(!grouped) return [];
  return Object.keys(grouped).map(function (condition) {
    return {
      condition: condition,
      kilometers: grouped[condition]
    }
  })
}
