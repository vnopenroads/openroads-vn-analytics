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

  return Object.keys(grouped).map(function(condition) {
    return {
      condition: condition,
      kilometers: grouped[condition].map(function (feat) {
        return util.round(lineDistance(feat, 'kilometers'), 3);
      })
      .reduce(function(a, b) { return a+b; }, 0)
    };
  });
}


module.exports.computeStats = function (roadFeatures, subregions) {
  if ('FeatureCollection' === roadFeatures.type)
    roadFeatures = roadFeatures.features;

  if ('FeatureCollection' === subregions.type)
    subregions = subregions.features;

  return {
    stats: statsByCondition(roadFeatures), 
    subregions: subregions.map(function (subregion) {
      return {
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
  god: {
    display: 'God'
  },
  excellent: {
    display: 'Excellent'
  },
  'undefined': {
    display: 'No Data'
  },
};
module.exports.statsForDisplay = function (cumputedStats) {
  var total = 0;

  var r = Object.keys(conditions).map(function(cond) {
    var val = _.findWhere(cumputedStats, {condition: cond});
    var kms = val ? val.kilometers : 0;
    total += kms;
    return {
      condition: cond,
      display: conditions[cond].display,
      kilometers: kms
    };
  });

  r.push({
    condition: 'total',
    display: 'Total',
    kilometers: total
  });

  return r;
};