'use strict';
/*
 * App config for User Acceptance Testing (aka UAT, aka staging).
 */
module.exports = {
  environment: 'uat',
  api: 'http://orma-uat.drvn.gov.vn:4000',
  // mbToken: 'pk.eyJ1IjoidGFpbG0xIiwiYSI6ImNqeXJobTVxZTBiOG8zaG82Mm4xbHBocHAifQ.Rr66mzvqmKde3GDspwbXhw',
  mbToken: 'pk.eyJ1IjoiamFtaWVjb29rIiwiYSI6ImNsMG9tcXMwZzFzMjgzbG9hbXEzczQybmsifQ.eZVt5dA4woL2e2OD7uApTw',
  roadNetTileLayerUrl: 'http://orma.drvn.gov.vn/tilemap/{z}/{x}/{y}.png',
};
