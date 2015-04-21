'use strict';
var _ = require('underscore');
var data = require('../../static/combined.json');

function formatStats (grouped) {
  if(!grouped) return [];
  return Object.keys(grouped).map(function (condition) {
    return {
      condition: condition,
      kilometers: grouped[condition]
    };
  });
}

var Cached = function(id) {
  this.id = id;
};

Cached.prototype.load = function(subregions) {
  _.each(subregions, function(region) {
    region.stats = formatStats(data[region.id].groups);
  });
  var stats = data[this.id.string()];
  var groups;

  if (!stats) {
    // we must be at top level, so just add up the subregions.
    groups = subregions.reduce(function(memo, s) {
      _.each(s.stats, function(stat) {
        memo[stat.condition] = (memo[stat.condition] || 0) + stat.kilometers;
      });
      return memo;
    }, {});
  }

  else {
    groups = stats.groups;
  }

  stats = formatStats(groups);

  return {
    stats: stats,
    subregions: subregions
  };
};

module.exports = Cached;
