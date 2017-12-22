var chai = require('chai');
var expect = chai.expect;
var zoom = require('../app/assets/scripts/utils/zoom');


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

describe('makeNewZoom', function () {
  it('should return zoom to fit entire bounding box', function () {
    var makeNewZoom = zoom.makeNewZoom;
    var scale = 15.458902860646377;
    var mapZoom = 8;
    var newZoom = makeNewZoom(scale, mapZoom);
    expect(newZoom).to.be.equal(11.95036602775482);
  });
});

