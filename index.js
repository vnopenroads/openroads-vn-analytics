'use strict';

var groupBy = require('group-by');
var lineDistance = require('turf-line-distance');

function computeStats(roadFeatures) {
  if ('FeatureCollection' === roadFeatures.type)
    roadFeatures = roadFeatures.features;

  var grouped = groupBy(roadFeatures, function (feat) {
      return feat.properties.rd_cond;
    });

  return Object.keys(grouped).map(function(condition) {
    return {
      condition: condition,
      kilometers: grouped[condition].map(function (feat) {
        return lineDistance(feat, 'kilometers');
      })
      .reduce(function(a, b) { return a+b; }, 0)
    };
  });
}


module.exports = computeStats;
