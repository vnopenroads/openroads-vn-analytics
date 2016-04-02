'use strict';
/* global L */
import React from 'react';
import _ from 'lodash';

var AAMap = React.createClass({
  displayName: 'AAMap',

  propTypes: {
    bounds: React.PropTypes.array
  },

  mapInitialView: [10.995, 122.267],
  mapInitialZoom: 6,

  map: null,

  setupMap: function () {
    this.map = L.mapbox.map(this.refs.map, 'devseed.524e060f', { zoomControl: false, scrollWheelZoom: false })
      .setView(this.mapInitialView, this.mapInitialZoom);

    new L.Control.Zoom({ position: 'bottomright' }).addTo(this.map);
  },

  componentDidMount: function () {
    this.setupMap();
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.bounds && this.props.bounds.length && !_.isEqual(prevProps.bounds, this.props.bounds)) {
      let b = this.props.bounds;
      this.map.fitBounds([
        [b[1], b[0]],
        [b[3], b[2]]
      ]);
    }
  },

  render: function () {
    return (
      <div className='aa-map-wrapper'>
        <div ref='map' className='aa-map'>{/* Map renders here */}</div>
      </div>
    );
  }
});

module.exports = AAMap;
