'use strict';
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  api: 'http://118.68.169.99/api',
  mbToken: 'pk.eyJ1IjoibmdkbmdoaWEyOCIsImEiOiJja2traXh0eGQxaWQwMndxdHR2Y2wwdnAyIn0.YPB4d7udn_zbzBYQdoSVnQ',
  editorUrl: '//118.68.169.99/editor/',
  roadNetTileLayerUrl: 'http://118.68.169.99/tilemap/{z}/{x}/{y}.png',
  provinceDumpBaseUrl: 'https:/openroads-vn-dumps-prod.s3.amazonaws.com/by-province-id/'
};
