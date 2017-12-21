import React from 'react';
import mapboxgl from 'mapbox-gl';
import {
  toPairs,
  find
} from 'lodash';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import {
  compose,
  getContext,
  withProps,
  withHandlers,
  lifecycle
} from 'recompose';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import { Link, withRouter } from 'react-router';
import {
  FETCH_ROAD_GEOMETRY,
  FETCH_ROAD_GEOMETRY_SUCCESS,
  FETCH_ROAD_GEOMETRY_ERROR,
  fetchRoadGeometryEpic
} from '../redux/modules/roads';
import {
  setMapPosition
} from '../redux/modules/map';
import config from '../config';
import {
  ADMIN_MAP
} from '../constants';


var AAFieldMap = React.createClass({
  displayName: 'AAFieldMap',
  propTypes: {
    status: React.PropTypes.string,
    geoJSON: React.PropTypes.object,
    vpromm: React.PropTypes.string,
    provinceName: React.PropTypes.string,
    navigateBack: React.PropTypes.func,
    setMapPosition: React.PropTypes.func
  },

  getInitialState: function () {
    return { layerRendered: false };
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

    if (this.props.geoJSON && !this.state.layerRendered) {
      this.renderLayer();
    }
  },


  componentWillReceiveProps: function ({ geoJSON, lng, lat, zoom }) {
    // TODO - rendering map could be less of a kludge w/ proper react/mapbox-gl bindings
    if (geoJSON && !this.state.layerRendered) {
      this.renderLayer();
    }
  },

  componentWillUnmount: function () {
    const { lng, lat } = this.map.getCenter();
    const zoom = this.map.getZoom();
    this.props.setMapPosition(lng, lat, zoom);
  },

  renderLayer: function () {
    this.setState({ layerRendered: true });

    this.map.on('load', () => {
      const { vpromm, geoJSON } = this.props;

      this.map.addSource(vpromm, { type: 'geojson', data: geoJSON });
      if (geoJSON.features.length > 0) {
        this.map.fitBounds(bbox(geoJSON), { padding: 20 });
      }

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
    const { vpromm, provinceName, navigateBack } = this.props;

    return (
      <div className="aa-map-page">
        <div className="back-button">
          <i className="collecticon-chevron-left" />
          <Link
            onClick={navigateBack}
          >
            {provinceName}
          </Link>
        </div>
        <div className="a-headline a-header">
          <h1>{vpromm}</h1>
        </div>

        <div className="aa-map-container">
          <div id='aa-map' className='aa-map' />
        </div>
      </div>
    );
  }
});


const reducer = (
  state = {
    status: 'complete'
  },
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
  withRouter,
  getContext({
    language: React.PropTypes.string
  }),
  withProps(({ language, params: { vpromm } }) => {
    const [aaId, { name }] = find(
      toPairs(ADMIN_MAP.province),
      ([aaId, { id }]) => id === vpromm.substring(0, 2)
    );

    return {
      vpromm,
      provinceName: name,
      aaId
    };
  }),
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
      geoJSON: state.roads.roadsById[vpromm] && state.roads.roadsById[vpromm].geoJSON
    }),
    (dispatch) => ({
      fetchRoadGeometry: (id) => dispatch(fetchRoadGeometryEpic(id)),
      setMapPosition: (lng, lat, zoom) => dispatch(setMapPosition(lng, lat, zoom))
    })
  ),
  withHandlers({
    navigateBack: ({ router, language, aaId }) => () => (
      router.push({ pathname: `/${language}/assets/${aaId}` })
    )
  }),
  lifecycle({
    componentWillMount: function () {
      const { vpromm, geoJSON, status, fetchRoadGeometry } = this.props;
      if (!geoJSON && status !== 'pending' && status !== 'error') {
        fetchRoadGeometry(vpromm);
      }
    }
  })
)(AAFieldMap);
