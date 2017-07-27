'use strict';
import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';

var Explore = React.createClass({
  displayName: 'Explore',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentDidMount: () => {
    mapboxgl.accessToken = config.mbToken;

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    }).fitBounds([
      [102.1, 7.3],
      [109.4, 23.4]
    ], {padding: 15, animate: false});

    map.on('load', () => {
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
      </div>
    );
  }
});

module.exports = connect()(Explore);
