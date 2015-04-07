'use strict';

var fs = require('fs');
var request = require('request');
var extent = require('turf-extent');
var lineDistance = require('turf-line-distance');
var clip = require('./lib/clip');

var debug = require('debug')('or-analytics');

function totalRoadLength(roadFeatures) {
  if ('FeatureCollection' === roadFeatures.type)
    return totalRoadLength(roadFeatures.features);

  return roadFeatures
    .map(function (feat) {
      return lineDistance(feat, 'kilometers');
    })
    .reduce(function(a, b) { return a+b; }, 0);
}

function getRoadFeatures(endpoint, polygon, cb) {
  var bbox = extent(polygon);
  var url = endpoint + '?bbox=' + bbox.join(',');
  debug('Requesting:', url);
  request.get(url, function (err, resp) {
    debug('Response:', url);
    if(err) return cb(err);
    var result = JSON.parse(resp.body);
    result.features = clip(result.features, polygon);
    cb(null, result);
  });
}

var municipalities = JSON.parse(fs.readFileSync(process.argv[3], 'utf-8'));
municipalities = municipalities.features;

var totalLength = 0;

function next() {
  if(municipalities.length === 0) {
    console.log('Grand total', totalLength);
    return;
  }
  var data = municipalities.shift();
  getRoadFeatures(process.argv[2], data, function (err, result) {
    if(err) console.error(err);
    else {
      var length = totalRoadLength(result);
      totalLength += length;
      debug('Municipality:', data.properties.NAME_2,
        'Road length: ', length);

      //fs.writeFileSync('temp/' + data.properties.NAME_2 + '.json', JSON.stringify(result));

      next();
    }
  });
}
next();

