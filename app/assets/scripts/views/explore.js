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
        'source-layer': 'conflatedgeojson',
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
      <div id='map'></div>
    );
  }
});

module.exports = connect()(Explore);
