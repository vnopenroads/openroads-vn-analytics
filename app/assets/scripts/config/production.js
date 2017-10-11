'use strict';
var logo = require('./logo');
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  consoleMessage: logo,
  api: 'http://api.openroads-vn.com',
  mbToken: 'pk.eyJ1Ijoib3BlbnJvYWRzIiwiYSI6InJ0aUQ2N3MifQ.R3hdFqriZr6kEUr-j_FYpg',
  editorUrl: '//id.openroads-vn.com/',
  roadNetTileLayerUrl: 'http://54.255.146.89:3000/dashboard/{z}/{x}/{y}.png',
  provinceDumpBaseUrl: 'https://s3.amazonaws.com/openroads-vn-dumps/by-province-id/'
};
