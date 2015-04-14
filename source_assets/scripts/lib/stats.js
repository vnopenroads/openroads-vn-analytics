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


module.exports = function computeStats(roadFeatures, subregions) {
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