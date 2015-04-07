'use strict';

var fs = require('fs');
var request = require('request');
var extent = require('turf-extent');
var lineDistance = require('turf-line-distance');
var linestring = require('turf-linestring');
var point = require('turf-point');
var inside = require('turf-inside');


var debug = require('debug')('boundaries');

function totalRoadLength(roadFeatures) {
  if ('FeatureCollection' === roadFeatures.type)
    return totalRoadLength(roadFeatures.features);

  return roadFeatures
    .map(function (feat) {
      return lineDistance(feat, 'kilometers');
    })
    .reduce(function(a, b) { return a+b; }, 0);
}

// clip the given LineString features to the given polygon.
// returns a new list of LineStrings, possibly longer than the original
// since a single line might get clipped into multiple lines.
function clip(lines, polygon) {
  var result = [];
  lines.forEach(function (feat) {
    var coords = feat.geometry.coordinates;

    // array of coordinate pairs of linestring we're building
    var current = [];

    // scan through the current input linestring, adding clipped
    // lines to the output as we hit the boundaries of the mask
    for(var i = 0; i < coords.length; i++) {
      if(inside(point(coords[i]), polygon)) {
        current.push(coords[i]);
      }
      else {
        if(current.length > 0) {
          result.push(linestring(current, feat.properties));
          current = [];
        }
      }
    }
  });

  return result;
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

      fs.writeFileSync('temp/' + data.properties.NAME_2 + '.json', JSON.stringify(result));

      next();
    }
  });
}
next();

