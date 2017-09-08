var chai = require('chai');
var expect = chai.expect;
var zoom = require('../app/assets/scripts/utils/zoom');
var bounds = [-77.1906280518, 38.9994422096, -76.8761444092, 38.7781755178];

describe('transformGeoToPixel', function () {
  it('should return pixel coordinate equivalent of mercator projected geographic coordinate', function () {
    var transformGeoToPixel = zoom.transformGeoToPixel;
    var nw = {lng: -77.1906280518, lat: 38.999442209};
    var se = {lng: -76.8761444092, lat: 38.7781755178};
    var mapZoom = 8;
    var nwPixel = transformGeoToPixel(nw, mapZoom);
    var sePixel = transformGeoToPixel(se, mapZoom);
    expect(nwPixel.x).to.be.equal(18715.875014284076);
    expect(nwPixel.y).to.be.equal(40489.37504218567);
    expect(sePixel.x).to.be.equal(18773.12508140696);
    expect(sePixel.y).to.be.equal(40437.62492723821);
  });
});

describe('pixelDistances', function () {
  it('should return bounds distances as pixel distances', function () {
    var pixelDistances = zoom.pixelDistances;
    var nwP = {x: 18715.875014284076, y: 40489.37504218567};
    var seP = {x: 18773.12508140696, y: 40437.62492723821};
    var distances = pixelDistances(nwP, seP);
    expect(distances.x).to.be.equal(57.2500671228845);
    expect(distances.y).to.be.equal(51.750114947455586);
  });
});

describe('newZoomScale', function () {
  it('should return scale factor to translate between old and new zoom level', function () {
    var newZoomScale = zoom.newZoomScale;
    var distances = {
      x: 57.2500671228845,
      y: 51.750114947455586
    };
    var zoomTranslationFactor = newZoomScale(distances);
    expect(zoomTranslationFactor).to.be.equal(15.458902860646377);
  });
});

describe('makeNewZoom', function () {
  it('should return zoom to fit entire bounding box', function () {
    var makeNewZoom = zoom.makeNewZoom;
    var scale = 15.458902860646377;
    var mapZoom = 8;
    var newZoom = makeNewZoom(scale, mapZoom);
    expect(newZoom).to.be.equal(11.95036602775482);
  });
});

describe('makeCenterpoint', function () {
  it('should return an object with the center point of a provided bounds array', function () {
    var makeCenterpoint = zoom.makeCenterpoint;
    var cp = makeCenterpoint(bounds);
    expect(cp.x).to.be.equal(-77.0333862305);
    expect(cp.y).to.be.equal(38.8888088637);
  });
});

describe('makeNWSE', function () {
  it('should return an object with nw and sw coordinates', function () {
    var makeNWSE = zoom.makeNWSE;
    var NWSE = makeNWSE(bounds);
    expect(NWSE.nw.lng).to.be.equal(-77.1906280518);
    expect(NWSE.nw.lat).to.be.equal(38.9994422096);
    expect(NWSE.se.lng).to.be.equal(-76.8761444092);
    expect(NWSE.se.lat).to.be.equal(38.7781755178);
  });
});
