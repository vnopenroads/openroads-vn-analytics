'use strict';
// jshint camelcase: false

var _ = require('underscore');
var centroid = require('turf-centroid');
var lineDistance = require('turf-line-distance');
var clip = require('./clip.js');
var util = require('./helpers.js');

function statsByCondition(roadFeatures) {
  var grouped = _.groupBy(roadFeatures, function (feat) {
    return feat.properties.rd_cond;
  });

  return _.map(Object.keys(grouped), function(condition) {
    return {
      condition: condition,
      kilometers: grouped[condition].map(function (feat) {
        return util.round(lineDistance(feat, 'kilometers'), 3);
      })
      .reduce(function(a, b) { return a + b; }, 0)
    };
  });
}

module.exports.computeStats = function (roads, subregions) {
  var roadFeatures = roads.type === 'FeatureCollection' ? roads.features : roads;
  var subregionFeatures = subregions.type === 'FeatureCollection' ? subregions.features : subregions;

  return {
    centroid: centroid(roads),
    stats: statsByCondition(roadFeatures),
    subregions: subregionFeatures.map(function (subregion) {
      return {
        name: subregion.name,
        id: subregion.id,
        properties: subregion.properties,
        stats: statsByCondition(clip(roadFeatures, subregion))
      };
    })
  };
};

var conditions = {
  poor: {
    display: 'Poor'
  },
  bad: {
    display: 'Bad'
  },
  fair: {
    display: 'Fair'
  },
  good: {
    display: 'Good'
  },
  excellent: {
    display: 'Excellent'
  },
  'undefined': {
    display: 'No Data'
  },
};

module.exports.displayStats = function (stats) {
  var total = 0;

  var display = _.map(Object.keys(conditions), function(condition) {
    var val = _.findWhere(stats, {condition: condition});
    var km = val ? val.kilometers : 0;
    total += km;
    return {
      display: conditions[condition].display,
      length: km
    };
  });

  display.push({
    display: 'Total',
    length: total
  });

  return display;
};
