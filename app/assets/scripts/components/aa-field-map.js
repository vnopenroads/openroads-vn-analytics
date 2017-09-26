'use strict';

import React from 'react';
import mapboxgl from 'mapbox-gl';
import { flatten } from 'lodash';
import config from '../config';
import {
  makeNWSE,
  makeNewZoom,
  makeCenterpoint,
  newZoomScale,
  pixelDistances,
  transformGeoToPixel
} from '../utils/zoom';
import {
  generateBbox,
  generateSourceFC,
  generateLayer
} from '../utils/field-map';
import AAFieldMapLegend from './aa-field-map-legend';

var AAFieldMap = React.createClass({
  displayName: 'AAFieldMap',
  propTypes: {
    road: React.PropTypes.object
  },

  generateMap: function () {

  },

  generateLngLatZoom: function (featureCollection) {
    var bounds = flatten(generateBbox(featureCollection));
    var NWSE = makeNWSE(bounds);
    var dummyZoom = 10;
    var nw = transformGeoToPixel(NWSE.nw, dummyZoom);
    var se = transformGeoToPixel(NWSE.se, dummyZoom);
    var distances = pixelDistances(nw, se);
    var adminAreaMapDiv = document.getElementById('aa-map');
    var dimensions = { x: adminAreaMapDiv.offsetWidth, y: adminAreaMapDiv.offsetHeight };
    var zoomScale = newZoomScale(distances, dimensions);
    var newZoom = makeNewZoom(zoomScale, dummyZoom);
    var cp = makeCenterpoint(bounds);
    return {
      lng: cp.x,
      lat: cp.y,
      zoom: newZoom - 2
    };
  },

  componentDidMount: function () {
    // pull featureCollections from the road props object
    const vprommId = this.props.road.vprommId;
    const featureCollection = this.props.road.geoJSON[0][vprommId][0];
    // generate the bounding box used to set initial zoom of gl map
    var lngLatZoom = this.generateLngLatZoom(featureCollection);
    mapboxgl.accessToken = config.mbToken;
    // add the map to the 'aa-map' canvas
    var map = new mapboxgl.Map({
      container: 'aa-map',
      center: [lngLatZoom.lng, lngLatZoom.lat],
      zoom: lngLatZoom.zoom,
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    });
    map.on('load', () => {
      // add the feature collection source to the gl map
      var sourceId = `${vprommId}-field-data`;
      map.addSource(sourceId, generateSourceFC(featureCollection));
      // then for each feature, add a layer
      featureCollection.features.forEach(feature => {
        // grab the feature's field data source from its properties
        var fieldDataSource = feature.properties.source;
        // generate a layer for the feature on the map
        map.addLayer(generateLayer(sourceId, fieldDataSource, vprommId));
      });
    });
  },

  render: function () {
    const vprommId = this.props.road.vprommId;
    const provinceName = this.props.road.provinceName;
    // grab layer sources from road geojson and pass it down to the legend
    const layers = this.props.road.geoJSON[0][vprommId][0].features.map(feature => feature.properties.source);
    return (
      <div>
        <div className="aa-header">
          <h1>{`${provinceName} - Road # ${vprommId}`}</h1>
        </div>
        <div className="aa-main__status">
          <div className='aa-map-wrapper'>
            <div id='aa-map' className='aa-map'></div>
            <AAFieldMapLegend layers={layers}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AAFieldMap;
