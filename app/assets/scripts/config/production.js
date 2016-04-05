'use strict';
var logo = require('./logo');
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  consoleMessage: logo,
  mbToken: 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJnUi1mbkVvIn0.018aLhX0Mb0tdtaT2QNe2Q',
  editorUrl: '//opengovt.github.io/openroads-iD/',
  roadNetTileLayerUrl: 'http://50.16.162.86/{z}/{x}/{y}.png'
};

