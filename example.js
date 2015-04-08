'use strict';
var concat = require('concat-stream');
var stats = require('./');

process.stdin.pipe(concat({encoding: 'string'}, function(data) {

  var roadData = JSON.parse(data);
  console.log(roadData.properties);

  var result = stats(roadData);
  console.log(result);
}));
