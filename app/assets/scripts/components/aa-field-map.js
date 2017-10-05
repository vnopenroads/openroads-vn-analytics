'use strict';

import React from 'react';
import mapboxgl from 'mapbox-gl';
import { flatten } from 'lodash';
import { connect } from 'react-redux';
import { fetchVProMMsidSourceGeoJSON } from '../actions/action-creators';
import config from '../config';
import AAFieldMapLegend from './aa-field-map-legend';

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

var AAFieldMap = React.createClass({
  displayName: 'AAFieldMap',
  propTypes: {
    adminName: React.PropTypes.string,
    roadId: React.PropTypes.string,
    geoJSON: React.PropTypes.array,
    provinceName: React.PropTypes.string,
    fetched: React.PropTypes.bool,
    params: React.PropTypes.object,
    vpromm: React.PropTypes.string,
    _fetchVProMMsidSourceGeoJSON: React.PropTypes.func,
    _removeVProMMsSourceGeoJSON: React.PropTypes.func
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

  generateMap: function (geoJSON) {
    // pull featureCollections from the road props object
    // generate the bounding box used to set initial zoom of gl map
    var lngLatZoom = this.generateLngLatZoom(geoJSON[0]);
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
      map.addControl(new mapboxgl.ScaleControl({unit: 'metric'}));
      // add the feature collection source to the gl map
      var sourceId = `${this.props.roadId}-field-data`;
      map.addSource(sourceId, generateSourceFC(geoJSON[0]));
      // then for each feature, add a layer
      geoJSON[0].features.forEach(feature => {
        // grab the feature's field data source from its properties
        var fieldDataSource = feature.properties.source;
        // generate a layer for the feature on the map
        map.addLayer(generateLayer(sourceId, fieldDataSource, this.props.roadId));
      });
    });
  },

  componentWillMount: function () {
    const vpromm = this.props.params.vpromm;
    this.props._fetchVProMMsidSourceGeoJSON(vpromm);
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.fetched) { this.generateMap(nextProps.geoJSON); }
  },

  renderMap: function (geoJSON) {
    const sources = geoJSON[0].features.map(feature => feature.properties.source);
    return (
      <div>
        <div id='aa-map' className='aa-map'></div>
        <AAFieldMapLegend layers={sources} />
      </div>
    );
  },

  renderHeader: function (adminName) {
    return (<h1>{`${adminName} Province - Road # ${this.props.params.vpromm}`}</h1>);
  },

  render: function () {
    return (
      <div>
        <div className="aa-headline aa-header">
          { this.props.fetched ? this.renderHeader(this.props.adminName) : ''}
        </div>
        <div className="aa-main__status">
          <div className='aa-map-wrapper'>
            { this.props.fetched ? this.renderMap(this.props.geoJSON) : <div id='aa-map' className='aa-map'></div>}
          </div>
        </div>
      </div>
    );
  }
});

function selector (state) {
  return {
    geoJSON: state.VProMMSidSourceGeoJSON.geoJSON,
    fetched: state.VProMMSidSourceGeoJSON.fetched,
    adminName: state.admin.name
  };
}
function dispatcher (dispatch) {
  return {
    _fetchVProMMsidSourceGeoJSON: (id) => dispatch(fetchVProMMsidSourceGeoJSON(id))
  };
}

module.exports = connect(selector, dispatcher)(AAFieldMap);
