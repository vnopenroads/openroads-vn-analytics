'use strict';
/* global rfolder */
var Backbone = require('backbone');
var cachedStats = rfolder('../stats/by_condition');

function formatStats (grouped) {
  if(!grouped) return [];
  return Object.keys(grouped).map(function (condition) {
    return {
      condition: condition,
      kilometers: grouped[condition]
    };
  });
}

module.exports = Backbone.Model.extend({

  constructor: function(adminList) {
    this.adminList = adminList;
    Backbone.Model.call(this, {
      id: adminList.get('id'),
      properties: {},
      stats: [],
      subregions: []
    });
  },

  defaults: {
  },

  /*
   * Mimic the schema produced by computeStats
   */
  loadCachedStats: function() {
    var subregions = this.adminList.get('subregions') || [];
    subregions.forEach(function (subr) {
      subr.stats = formatStats(cachedStats[subr.id].groups);
    });

    var stats = cachedStats[this.get('id')];
    var groups;
    if (!stats) {
      // we must be at top level, so just add up the subregions.
      groups = subregions.reduce(function(memo, s) {
        s.stats.forEach(function (stat) {
          memo[stat.condition] = (memo[stat.condition] || 0) + stat.kilometers;
        });
        return memo;
      }, {});
    }
    else {
      groups = stats.groups;
    }
    stats = formatStats(groups);

    this.set({
      stats: stats,
      subregions: subregions
    });
    console.log('cached stats loaded', stats, subregions);
  },

  fetch: function () {}

});

