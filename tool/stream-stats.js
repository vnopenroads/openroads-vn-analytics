'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var JSONStream = require('JSONStream');
var lineDistance = require('turf-line-distance');

var argv = process.argv;
if(argv.length < 5) {
  console.log('Usage:', argv[0], argv[1], ' GROUP_BY_PROPERTY' +
    ' OUTPUT_DIR file1 file2 file3 ...');
  process.exit();
}

var groupBy = argv[2];
var outputDir = argv[3];
var files = argv.slice(4);


function sum(a, b) { return a+b; }

files.forEach(function(file) {
  var total = null;
  var stats = {
  };

  function datum(group, value, reduceFn, initial) {
    if(!stats[group]) stats[group] = initial;
    stats[group] = reduceFn(stats[group], value);
    if(!total) total = initial;
    total = reduceFn(total, value);
  }

  var name = path.basename(file);

  fs.createReadStream(file)
    .pipe(JSONStream.parse('roads.features.*'))
    .pipe(through.obj(function (feat, _, next) {
      datum(feat.properties[groupBy],
        lineDistance(feat, 'kilometers'), sum, 0);
      next();
    },
    function end() {
      this.push(JSON.stringify({
        total: total,
        groups: stats
      }));
      this.push(null);
    }))
    .pipe(fs.createWriteStream(path.join(outputDir, name)));
});
