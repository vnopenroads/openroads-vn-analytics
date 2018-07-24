import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  toPairs,
  find
} from 'lodash';
import {
  compose,
  getContext,
  withProps
} from 'recompose';
import { local } from 'redux-fractal';
import { createStore, combineReducers } from 'redux';
import { Link, withRouter } from 'react-router';
import bbox from '@turf/bbox';
import mapboxgl from 'mapbox-gl';

import Dropdown from '../components/dropdown';
import AssetsEditModal from '../components/assets-edit-modal';

import {
  FETCH_ROAD_GEOMETRY,
  FETCH_ROAD_GEOMETRY_SUCCESS,
  FETCH_ROAD_GEOMETRY_ERROR,
  FETCH_ROAD_PROPERTY,
  FETCH_ROAD_PROPERTY_ERROR,
  FETCH_ROAD_PROPERTY_SUCCESS,
  fetchRoadGeometryEpic,
  fetchRoadPropertyEpic
} from '../redux/modules/roads';
import {
  setMapPosition
} from '../redux/modules/map';
import {
  ADMIN_MAP
} from '../constants';
import { mbToken, api, environment } from '../config';
import { showConfirm } from '../components/confirmation-prompt';

mapboxgl.accessToken = mbToken;

class AssetsDetail extends React.Component {
  constructor (props) {
    super(props);

    this.onEditDelete = this.onEditDelete.bind(this);
    this.onEditProperties = this.onEditProperties.bind(this);
    this.onModalClose = this.onModalClose.bind(this);

    this.state = {
      layerRendered: false,
      editModalOpen: false
    };
  }

  componentWillMount () {
    const { vpromm, fetchRoadProperty, fetchRoadGeometry } = this.props;
    fetchRoadProperty(vpromm);
    fetchRoadGeometry(vpromm);
  }

  componentDidMount () {
    this.map = new mapboxgl.Map({
      container: 'aa-map',
      center: [106.12774207395364, 16.185396038978936],
      zoom: 4,
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    });

    this.map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }));
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.setupMapStyle();
    });
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.roadGeo.fetching && nextProps.roadGeo.fetching && !nextProps.roadGeo.error) {
      this.setupMapStyle();
    }
  }

  // componentWillUnmount () {
  //   const { lng, lat } = this.map.getCenter();
  //   const zoom = this.map.getZoom();
  //   this.props.setMapPosition(lng, lat, zoom);
  // }

  setupMapStyle () {
    const { fetched, data } = this.props.roadGeo;

    if (!fetched || this.map.getSource('road-geometry')) return;

    this.map.addSource('road-geometry', { type: 'geojson', data: data });
    this.map.addLayer({
      id: `road-geometry-layer`,
      type: 'line',
      source: 'road-geometry',
      paint: {
        'line-width': 2,
        'line-color': '#808080'
      }
    });

    if (data.features.length > 0) {
      this.map.fitBounds(bbox(data), { padding: 20 });
    }
  }

  onModalClose () {
    this.setState({ editModalOpen: false });
  }

  onEditProperties (e) {
    e.preventDefault();
    this.setState({ editModalOpen: true });
  }

  onEditDelete (e) {
    e.preventDefault();
    showConfirm({
      title: 'Delete road',
      body: (
        <div>
          <p>Are you sure you want to delete road {this.props.vpromm}?</p>
          <p>This action is irreversible.</p>
        </div>
      )
    }, () => {
      console.log('deleted');
    });
  }

  renderProperties () {
    const { fetched, data } = this.props.roadProps;

    if (!fetched) return null;

    const propNames = Object.keys(data.properties);
    const renderDlItem = (name) => {
      return [
        <dt key={`dt-${name}`}>{name}</dt>,
        <dd key={`dd-${name}`}>{data.properties[name] || '-'}</dd>
      ];
    };

    return (
      <section>
        <h1>Properties</h1>
        <dl>
          {propNames.map(renderDlItem)}
        </dl>
      </section>
    );
  }

  render () {
    const { vpromm, language } = this.props;

    return (
      <div className="aa-map-page">
        <div className="a-headline a-header">
          <h1>{vpromm}</h1>

          <a href={`${api}/properties/roads/${vpromm}.geojson`} className='button button--base-raised-light'>Download</a>
          <Dropdown
            className='browse-menu'
            triggerClassName='button button--primary-raised-dark'
            triggerActiveClassName='button--active'
            triggerText='Edit'
            triggerTitle='Toggle menu options'
            direction='down'
            alignment='right' >
            <ul className='drop__menu drop__menu--iconified'>
              <li><a href='#' className='drop__menu-item' onClick={this.onEditProperties}>Properties</a></li>
              <li><Link to={`/${language}/editor?way=823`} className='drop__menu-item'>Geometry</Link></li>
            </ul>
            <ul className='drop__menu drop__menu--iconified'>
              <li><a href='#' className='drop__menu-item' onClick={this.onEditDelete}>Delete</a></li>
            </ul>

          </Dropdown>
        </div>

        <div className='aa-map-container'>
          <div id='aa-map' className='aa-map' />
        </div>

        {this.renderProperties()}

        {this.props.roadProps.fetched ? <AssetsEditModal
          revealed={this.state.editModalOpen}
          onCloseClick={this.onModalClose}
          vpromm={vpromm}
          roadProps={this.props.roadProps} /> : null}
      </div>
    );
  }
}

if (environment !== 'production') {
  AssetsDetail.propTypes = {
    vpromm: PropTypes.string,
    roadGeo: PropTypes.object,
    roadProps: PropTypes.object,
    language: PropTypes.string,
    fetchRoadProperty: PropTypes.func,
    fetchRoadGeometry: PropTypes.func
  };
}

//
//
//

// Road properties state and reducer.
const stateRoadProps = {
  fetched: false,
  fetching: false,
  data: {}
};

const reducerRoadProps = (state = stateRoadProps, action) => {
  switch (action.type) {
    case FETCH_ROAD_PROPERTY:
      return {...state, fetching: true};
    case FETCH_ROAD_PROPERTY_ERROR:
      return {...state, fetching: false, fetched: true, error: true};
    case FETCH_ROAD_PROPERTY_SUCCESS:
      return {...state, fetching: false, fetched: true, data: action.properties};
  }

  return state;
};

// Road geometry state and reducer.
const stateRoadGeo = {
  fetched: false,
  fetching: false,
  data: {}
};

const reducerRoadGeo = (state = stateRoadGeo, action) => {
  switch (action.type) {
    case FETCH_ROAD_GEOMETRY:
      return {...state, fetching: true};
    case FETCH_ROAD_GEOMETRY_ERROR:
      return {...state, fetching: false, fetched: true, error: true};
    case FETCH_ROAD_GEOMETRY_SUCCESS:
      return {...state, fetching: false, fetched: true, data: action.geoJSON};
  }

  return state;
};

const reducer = combineReducers({
  properties: reducerRoadProps,
  geometry: reducerRoadGeo
});

export default compose(
  withRouter,
  getContext({ language: React.PropTypes.string }),
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
    mapStateToProps: (state) => ({
      roadProps: state.properties,
      roadGeo: state.geometry
    }),
    filterGlobalActions: ({ type }) => [
      FETCH_ROAD_GEOMETRY,
      FETCH_ROAD_GEOMETRY_SUCCESS,
      FETCH_ROAD_GEOMETRY_ERROR,
      FETCH_ROAD_PROPERTY,
      FETCH_ROAD_PROPERTY_SUCCESS,
      FETCH_ROAD_PROPERTY_ERROR
    ].indexOf(type) > -1
  }),
  connect(
    (state, props) => ({}),
    (dispatch) => ({
      setMapPosition: (...args) => dispatch(setMapPosition(...args)),
      fetchRoadGeometry: (...args) => dispatch(fetchRoadGeometryEpic(...args)),
      fetchRoadProperty: (...args) => dispatch(fetchRoadPropertyEpic(...args))
    })
  )
)(AssetsDetail);
