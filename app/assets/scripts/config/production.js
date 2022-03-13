'use strict';
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  api: 'http://orma.drvn.gov.vn/api/',
  // mbToken: 'pk.eyJ1IjoidGFpbG0xIiwiYSI6ImNqeXJobTVxZTBiOG8zaG82Mm4xbHBocHAifQ.Rr66mzvqmKde3GDspwbXhw',
  mbToken: 'pk.eyJ1IjoiamFtaWVjb29rIiwiYSI6ImNsMG9tcXMwZzFzMjgzbG9hbXEzczQybmsifQ.eZVt5dA4woL2e2OD7uApTw',
  editorUrl: '//orma.drvn.gov.vn/editor/',
  roadNetTileLayerUrl: 'http://orma.drvn.gov.vn/tilemap/{z}/{x}/{y}.png',
  provinceDumpBaseUrl: 'https:/openroads-vn-dumps-prod.s3.amazonaws.com/by-province-id/'
};
