'use strict';

import React from 'react';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import {
  generateBbox,
  generateLayer,
  generateSourceFC
} from '../utils/field-map';
// import { t } from '../utils/i18n';

var AAFieldMap = React.createClass({
  displayName: 'AAFieldMap',
  propTypes: {
    road: React.PropTypes.object
  },
  componentDidMount: function () {
    const vprommId = this.props.road.vprommId;
    const featureCollections = this.props.road.geoJSON[0][vprommId][0];
    var fieldDataBbox = generateBbox(featureCollections);
    mapboxgl.accessToken = config.mbToken;
    var map = new mapboxgl.Map({
      container: 'aa-map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    }).fitBounds(fieldDataBbox);
    // featureCollections.forEach(fc => console.log(fc));
  },
  render: function () {
    const vprommId = this.props.road.vprommId;
    const provinceName = this.props.road.provinceName;
    return (
      <div>
        <div className="aa-header">
          <h1>{`${provinceName} - Road # ${vprommId}`}</h1>
        </div>
        <div className='aa-main__status'>
          <div id='aa-map'></div>
        </div>
      </div>
    )
  }
});

module.exports = AAFieldMap;
