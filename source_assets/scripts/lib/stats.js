'use strict';
// jshint camelcase: false

var _ = require('underscore');
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

module.exports.computeStats = function (roadFeatures, subregions) {
  if ('FeatureCollection' === roadFeatures.type) {
    roadFeatures = roadFeatures.features;
  }

  if ('FeatureCollection' === subregions.type) {
    subregions = subregions.features;
  }

  return {
    stats: statsByCondition(roadFeatures),
    subregions: subregions.map(function (subregion) {
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
