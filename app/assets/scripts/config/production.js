'use strict';
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  api: 'http://orma.drvn.vn/api',
  mbToken: 'pk.eyJ1IjoibmdkbmdoaWEyOCIsImEiOiJjano4emx6NmwwM3J6M2Vtbjd2cjF4ZDNoIn0.ytQffAlYX9LFRMZ46YZHhg',
  editorUrl: '//orma.drvn.vn/editor',
  roadNetTileLayerUrl: 'http://orma.drvn.vn/tilemap/{z}/{x}/{y}.png',
  provinceDumpBaseUrl: 'https:/openroads-vn-dumps-prod.s3.amazonaws.com/by-province-id/'
};
