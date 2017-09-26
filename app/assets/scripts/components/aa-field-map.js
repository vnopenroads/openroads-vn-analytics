'use strict';

import React from 'react';
import mapboxgl from 'mapbox-gl';
import { flatten } from 'lodash';
import { connect } from 'react-redux';
import { fetchVProMMsidSourceGeoJSON, removeVProMMsSourceGeoJSON } from '../actions/action-creators';
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
    roadId: React.PropTypes.string,
    geoJSON: React.PropTypes.array,
    fetched: React.PropTypes.bool,
    provinceName: React.PropTypes.string,
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

  componentWillMount: function () {
    this.props._fetchVProMMsidSourceGeoJSON(this.props.roadId);
    this.map = '';
  },

  generateMap: function (geoJSON) {
    // pull featureCollections from the road props object
    // generate the bounding box used to set initial zoom of gl map
    var lngLatZoom = this.generateLngLatZoom(geoJSON);
    mapboxgl.accessToken = config.mbToken;
    // add the map to the 'aa-map' canvas
    this.map = new mapboxgl.Map({
      container: 'aa-map',
      center: [lngLatZoom.lng, lngLatZoom.lat],
      zoom: lngLatZoom.zoom,
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    });
    this.map.on('load', () => {
      // add the feature collection source to the gl map
      var sourceId = `${this.props.roadId}-field-data`;
      this.map.addSource(sourceId, generateSourceFC(geoJSON));
      // then for each feature, add a layer
      geoJSON.features.forEach(feature => {
        // grab the feature's field data source from its properties
        var fieldDataSource = feature.properties.source;
        // generate a layer for the feature on the map
        this.map.addLayer(generateLayer(sourceId, fieldDataSource, this.props.roadId));
      });
    });
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.fetched) {
      const geoJSON = nextProps.geoJSON[0][nextProps.roadId][0];
      this.generateMap(geoJSON);
    }
  },

  componentWillUnmount: function () {
    this.props._removeVProMMsSourceGeoJSON();
  },

  renderMap: function (geoJSON) {
    const layers = geoJSON[0][this.props.roadId][0].features.map(feature => feature.properties.source);
    return (
      <div>
        <div id='aa-map' className='aa-map'></div>
        <AAFieldMapLegend layers={layers} />
      </div>
    );
  },

  renderHeader: function (provinceName) {
    return (<h1>{`${provinceName} Province - Road # ${this.props.roadId}`}</h1>);
  },

  render: function () {
    return (
      <div>
        <div className="aa-header">
          {this.props.fetched ? this.renderHeader(this.props.provinceName) : ''}
        </div>
        <div className="aa-main__status">
          <div className='aa-map-wrapper'>
            {this.props.fetched ? this.renderMap(this.props.geoJSON) : <div id='aa-map' className='aa-map'/> }
          </div>
        </div>
      </div>
    );
  }
});

function selector (state) {
  return {
    geoJSON: state.VProMMSidSourceGeoJSON.geoJSON,
    fetched: state.VProMMSidSourceGeoJSON.fetched
  };
}
function dispatcher (dispatch) {
  return {
    _fetchVProMMsidSourceGeoJSON: (id) => dispatch(fetchVProMMsidSourceGeoJSON(id)),
    _removeVProMMsSourceGeoJSON: () => dispatch(removeVProMMsSourceGeoJSON())
  };
}

module.exports = connect(selector, dispatcher)(AAFieldMap);
