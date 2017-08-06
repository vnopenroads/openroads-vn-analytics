'use strict';
import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';

import { updateGlobalZoom } from '../actions/action-creators';
import config from '../config';

var Explore = React.createClass({
  displayName: 'Explore',

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    _updateGlobalZoom: React.PropTypes.func,
    globZoom: React.PropTypes.object
  },

  componentDidMount: function () {
    const makeXYZobj = function () {
      const xyzObj = map.getCenter();
      xyzObj['zoom'] = map.getZoom();
      return xyzObj;
    };
    mapboxgl.accessToken = config.mbToken;
    const map = new mapboxgl.Map({
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
        paint: {
          'line-color': {
            property: 'iri',
            type: 'exponential',
            colorSpace: 'lab',
            stops: [
              [2, '#8CCA1B'],
              [20, '#DA251D']
            ]
          },
          'line-width': 4
        },
        'line-cap': 'round',
        filter: ['has', 'or_vpromms']
      });
    });
  },

  render: function () {
    return (
      <div className='map-container'>
        <div id='map'></div>
        {/*
        <div className='map-options'>
          <div className='input-group'>
            <input type='checkbox' id='show-no-vpromms' className='map-options-checkbox' />
            <label htmlFor='show-no-vpromms' className='map-options-label'>Show roads without VPRoMMS ID (these will have no properties)</label>
          </div>

          <div className='input-group'>
            <p className='map-options-label'>Select visualized variable</p>
            <select>
              <option value='iri'>IRI</option>
              <option value='or_width'>Width</option>
              <option value='or_condition'>Condition</option>
              <option value='or_surface'>Surface</option>
            </select>
          </div>
        </div>

        <div className='map-legend'>
          <div className='map-legend-scale'></div>
          <p className='map-legend-label'>Best</p>
          <p className='map-legend-label'>Worst</p>
        </div>
        */}
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
