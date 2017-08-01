'use strict';

import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';

import { updateGlobalZoom } from '../actions/action-creators';
import config from '../config';
import lineColors from '../utils/line-colors';
import {
  selectExploreMapLayer,
  exploreMapShowNoVpromms
} from '../actions/action-creators';
import MapOptions from '../components/map-options';
import MapLegend from '../components/map-legend';

var map;

var Explore = React.createClass({
  displayName: 'Explore',

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    _updateGlobalZoom: React.PropTypes.func,
    globZoom: React.PropTypes.object
    layer: React.PropTypes.string,
    showNoVpromms: React.PropTypes.bool,
    dispatch: React.PropTypes.func
  },

  componentDidMount: function () {
    const makeXYZobj = function () {
      const xyzObj = map.getCenter();
      xyzObj['zoom'] = map.getZoom();
      return xyzObj;
    };
    mapboxgl.accessToken = config.mbToken;
    const map = new mapboxgl.Map({

    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [
        this.props.globZoom.data.x,
        this.props.globZoom.data.y
      ],
      zoom: this.props.globZoom.data.z,
      failIfMajorPerformanceCaveat: false
    });

    map.on('zoom', () => {
      this.props._updateGlobalZoom(makeXYZobj());
    });

    map.on('move', () => {
      this.props._updateGlobalZoom(makeXYZobj());
    });

    map.on('load', () => {
      this.props._updateGlobalZoom(makeXYZobj());
      // Load all roads with VPRoMMS values, and color by IRI
      map.addLayer({
        id: 'conflated',
        type: 'line',
        source: {
          type: 'vector',
          url: 'mapbox://openroads.vietnam-conflated'
        },
        'source-layer': 'conflated',
        paint: { 'line-width': 4 },
        layout: { 'line-cap': 'round' }
      }).setPaintProperty(
        'conflated',
        'line-color',
        lineColors['iri']
      ).setFilter('conflated', ['has', 'or_vpromms']);
    });
  },

  handleLayerChange: function (e) {
    const property = e.target.value;
    this.props.dispatch(selectExploreMapLayer(property));
    map.setPaintProperty(
      'conflated',
      'line-color',
      lineColors[property]
    );
  },

  handleShowNoVpromms: function (e) {
    const show = e.target.checked;
    this.props.dispatch(exploreMapShowNoVpromms(show));
    if (show) {
      map.setFilter('conflated', null);
    } else {
      map.setFilter('conflated', ['has', 'or_vpromms']);
    }
  },

  render: function () {
    return (
      <div className='map-container'>
        <div id='map'></div>

        <MapOptions
          handleLayerChange={ this.handleLayerChange }
          handleShowNoVpromms={ this.handleShowNoVpromms }
        />

        <MapLegend
          layer={this.props.layer}
        />
      </div>
    );
  }
});

function selector (state) {
  return {
    globZoom: state.globZoom
  };
}

function dispatcher (dispatch) {
  return {
    _updateGlobalZoom: (xyzObj) => dispatch(updateGlobalZoom(xyzObj))
  };
}

module.exports = connect(selector, dispatcher)(Explore);