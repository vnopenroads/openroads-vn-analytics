'use strict';
var path = require('path');
var fs = require('fs');
var csv = require('csv-parser');
var through = require('through2');
var request = require('request');
/**
 * Fetch the (rather large) GeoJSON data for the given admin region,
 * to be stored and used for precomputing stats on regions too large
 * to do on the fly.
 *
 */


if (process.argv.length < 6) {
  console.log('node fetch-admin-data.js ADMIN_AREAS_CSV TYPE|REGION_ID ENDPOINT_BASE_URL OUTPUT_DIR');
  process.exit();
}

var csvFile = path.resolve(process.cwd(), process.argv[2]);
var type = +process.argv[3];
var endpoint = process.argv[4];
var outputDir = path.resolve(process.cwd(), process.argv[5]);


fs.createReadStream(csvFile)
  .pipe(csv())
  .pipe(through.obj(function (data, _, next) {
    var check = (type < 5) ? +data.type : +data.id;
    if(check === type) {
      console.log('Fetching ' + data.id);
      request(endpoint + '/admin/' + data.id)
        .pipe(fs.createWriteStream(path.resolve(outputDir, data.id + '.json')))
        .on('finish', function () {
          console.log('Finished', data.id);
          next();
        })
        .on('error', console.error.bind(console));
    }
    else next();
  }));
