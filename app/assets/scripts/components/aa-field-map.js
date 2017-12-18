import React from 'react';
import mapboxgl from 'mapbox-gl';
import { flatten } from 'lodash';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import {
  compose,
  getContext,
  withProps,
  lifecycle
} from 'recompose';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import {
  FETCH_ROAD_GEOMETRY,
  FETCH_ROAD_GEOMETRY_SUCCESS,
  FETCH_ROAD_GEOMETRY_ERROR,
  fetchRoadGeometryEpic
} from '../redux/modules/roads';
import config from '../config';
import {
  makeNWSE,
  makeNewZoom,
  makeCenterpoint,
  newZoomScale,
  pixelDistances,
  transformGeoToPixel
} from '../utils/zoom';


const generateLngLatZoom = (featureCollection) => {
  // see test for this util for helpful description of
  // what all is happening here.
  var bounds = flatten(bbox(featureCollection));
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
};


var AAFieldMap = React.createClass({
  displayName: 'AAFieldMap',
  propTypes: {
    adminName: React.PropTypes.string,
    roadId: React.PropTypes.string,
    geoJSON: React.PropTypes.object,
    provinceName: React.PropTypes.string,
    vpromm: React.PropTypes.string,
    location: React.PropTypes.object,
    _removeVProMMsSourceGeoJSON: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      layerRendered: false
    };
  },

  componentDidMount: function () {
    mapboxgl.accessToken = config.mbToken;

    this.map = new mapboxgl.Map({
      container: 'aa-map',
      center: [106.12774207395364, 16.185396038978936],
      zoom: 4,
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    });

    this.map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }));
    this.map.addControl(new mapboxgl.NavigationControl());
  },


  componentWillReceiveProps: function ({ status, geoJSON }) {
    // TODO - rendering map could be less of a kludge w/ proper react/mapbox-gl bindings
    if (status === 'complete' && geoJSON && !this.state.layerRendered) {
      this.renderLayer(geoJSON);
    }
  },

  renderLayer: function () {
    this.setState({ layerRendered: true });

    this.map.on('load', () => {
      const { vpromm, geoJSON } = this.props;

      var lngLatZoom = generateLngLatZoom(this.props.geoJSON);

      this.map.addSource(vpromm, { type: 'geojson', data: geoJSON });
      this.map.flyTo({
        center: [lngLatZoom.lng, lngLatZoom.lat],
        zoom: lngLatZoom.zoom
      });

      this.map.addLayer({
        id: `${vpromm}-layer`,
        type: 'line',
        source: vpromm,
        paint: {
          'line-width': 2,
          'line-color': '#808080'
        }
      });
    });
  },


  render: function () {
    const { vpromm } = this.props;

    return (
      <div>
        <div className="a-headline a-header">
          <h1>{vpromm}</h1>
        </div>

        <div className="a-main__status">
          <div className='aa-map-wrapper'>
            <div id='aa-map' className='aa-map' />
            {/* <AAFieldMapLegend sources={uniq(sources)} /> */}
          </div>
        </div>
      </div>
    );
  }
});


const reducer = (
  state = {},
  action
) => {
  if (action.type === FETCH_ROAD_GEOMETRY) {
    return Object.assign({}, state, { status: 'pending' });
  } else if (action.type === FETCH_ROAD_GEOMETRY_ERROR) {
    return Object.assign({}, state, { status: 'error' });
  } else if (action.type === FETCH_ROAD_GEOMETRY_SUCCESS) {
    return Object.assign({}, state, { status: 'complete' });
  }

  return state;
};

module.exports = compose(
  getContext({ language: React.PropTypes.string }),
  withProps(({ params: { vpromm } }) => ({ vpromm })),
  local({
    key: ({ vpromm }) => `${vpromm}-road-map`,
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch, { vpromm }) => ({
    }),
    filterGlobalActions: ({ type }) =>
      [FETCH_ROAD_GEOMETRY, FETCH_ROAD_GEOMETRY_SUCCESS, FETCH_ROAD_GEOMETRY_ERROR].indexOf(type) > -1
  }),
  connect(
    (state, { vpromm }) => ({
      geoJSON: state.roads.roadsById[vpromm] && state.roads.roadsById[vpromm].geoJSON,
      adminName: '' // TODO - request province name from /admin/:unit_id/info.  Or, name likely already availble in store in state.provinces
    }),
    (dispatch) => ({
      fetchRoadGeometry: (id) => dispatch(fetchRoadGeometryEpic(id))
    })
  ),
  lifecycle({
    componentWillMount: function () {
      const { vpromm, geoJSON, status, fetchRoadGeometry } = this.props;
      if (!geoJSON && status !== 'pending' && status !== 'complete') {
        fetchRoadGeometry(vpromm);
      }
    }
  })
)(AAFieldMap);
