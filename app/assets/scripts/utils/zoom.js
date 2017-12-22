// Leaflet inspired implementation of extracting a midpoint and zoom level from a set of bounds //
var {
  lngLatToMeters,
  metersToPixels
} = require('global-mercator');

/**
 * calculates tranformed pixel point from coordinate point
 * @param {object} geoCoordinate A geographic coordinate
 * @param {number} zoom current map zoom
 * @return {object} tranformed pixel coordinate
 */
const transformGeoToPixel = exports.transformGeoToPixel = function (geoCoordinate, zoom) {
  var meterCrds = lngLatToMeters([geoCoordinate.lng, geoCoordinate.lat]);
  var pixelCrd = metersToPixels(meterCrds, zoom);
  return {
    x: pixelCrd[0],
    y: pixelCrd[1]
  };
};

/**
 * generates object with pixel reprentation of distances between bounds' latitude and longitude extrema
 * @param {object} nwPixel northwest bounds coordinate as pixel coordinate
 * @param {object} sePixel southeastbounds coordinate as pixel coordinate
 * @return {object} object with pixel distances
 */
const pixelDistances = exports.pixelDistances = function (nwPixel, sePixel) {
  return {
    x: Math.abs(nwPixel.x - sePixel.x),
    y: Math.abs(nwPixel.y - sePixel.y)
  };
};


/**
 * returns max zoom for showing extent of the bounding box provided
 * @param {number} scale the scale factor used to calcualte the new zoom
 * @param {number} zoom the map's current zoom
 * @return {number} new zoom for bounds
 */
const makeNewZoom = exports.makeNewZoom = function (scale, zoom) {
  // the high level calculation for new zoom comes from:
  // https://github.com/Leaflet/Leaflet/blob/703ae02aa8cbd0b87be5b01e77754b83ad732267/src/geo/crs/CRS.js#L65
  // the high level calculation's components come from
  // https://github.com/Leaflet/Leaflet/blob/703ae02aa8cbd0b87be5b01e77754b83ad732267/src/map/Map.js#L893
  var scaledZoom = 256 * Math.pow(2, zoom);
  var scaledScaledZoom = scale * scaledZoom;
  var newZoom = Math.log(scaledScaledZoom / 256) / Math.LN2;
  // the maximum possible zoom is 24.
  return newZoom > 24 ? 24 : newZoom;
};


exports.bboxToLngLatZoom = ([west, south, east, north]) => {
  const lng = west + ((east - west) / 2);
  const lat = south + ((north - south) / 2);
  const xDimension = 1000;
  const yDimension = 500;
  const padding = 10;
  const zoom = 6;


  // TODO - this implementation shouldn't care about current zoom to calculate new zoom for bbox
  // hardcoding at 6 produces fine enough results, but it shouldn't be necessary
  // actually using current zoom produces bad/inconsistent results
  const { x: xDistance, y: yDistance } = pixelDistances(
    transformGeoToPixel({ lng: west, lat: north }, zoom),
    transformGeoToPixel({ lng: east, lat: south }, zoom)
  );

  const zoomScale = Math.min(xDimension / (xDistance + (padding / 2)), yDimension / (yDistance + (padding / 2)));
  const newZoom = makeNewZoom(zoomScale, zoom);

  return { lng, lat, zoom: newZoom };
};
