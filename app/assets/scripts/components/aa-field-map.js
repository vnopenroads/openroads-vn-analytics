'use strict';

import React from 'react';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import {
  generateBbox,
  generateSourceFC,
  generateLayer
} from '../utils/field-map';
// import { t } from '../utils/i18n';

var AAFieldMap = React.createClass({
  displayName: 'AAFieldMap',
  propTypes: {
    road: React.PropTypes.object
  },
  componentDidMount: function () {
    // pull featureCollections from the road props object
    const vprommId = this.props.road.vprommId;
    const featureCollection = this.props.road.geoJSON[0][vprommId][0];
    // generate the bounding box used to set initial zoom of gl map
    var fieldDataBbox = generateBbox(featureCollection);
    mapboxgl.accessToken = config.mbToken;
    // add the map to the 'aa-map' canvas
    var map = new mapboxgl.Map({
      container: 'aa-map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    }).fitBounds(fieldDataBbox, { padding: 10 });
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
    return (
      <div>
        <div className="aa-header">
          <h1>{`${provinceName} - Road # ${vprommId}`}</h1>
        </div>
        <div className='aa-main__status'>
          <div className='aa-map-wrapper'>
            <div id='aa-map' className='aa-map'></div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AAFieldMap;
