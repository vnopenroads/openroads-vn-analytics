/* eslint-disable react/no-deprecated */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  toPairs,
  find,
  get,
  without
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
import center from '@turf/center';
import length from '@turf/length';
import mapboxgl from 'mapbox-gl';
import c from 'classnames';
import T, {
  translate
} from '../components/t';

import sectionFields from '../utils/section-fields';
import { getSectionValue } from '../utils/sections';
import Dropdown from '../components/dropdown';
import AssetsEditModal from '../components/assets-edit-modal';
import AssetsSectionRow from '../components/assets-section-row';
import UhOh from './uhoh';

import {
  FETCH_ROAD_GEOMETRY,
  FETCH_ROAD_GEOMETRY_SUCCESS,
  FETCH_ROAD_GEOMETRY_ERROR,
  FETCH_ROAD_PROPERTY,
  FETCH_ROAD_PROPERTY_ERROR,
  FETCH_ROAD_PROPERTY_SUCCESS,
  OP_ON_ROAD_PROPERTY,
  OP_ON_ROAD_PROPERTY_SUCCESS,
  OP_ON_ROAD_PROPERTY_ERROR,
  EDIT_ROAD_STATUS_SUCCESS,
  fetchRoadGeometryEpic,
  fetchRoadPropertyEpic,
  deleteRoadEpic,
  editRoadEpic,
  opOnRoadPropertyEpic,
  editRoadStatusEpic
} from '../redux/modules/roads';
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
      editModalOpen: false,
      activeTab: 'attributes'
    };
  }

  componentWillMount () {
    const { vpromm, fetchRoadProperty, fetchRoadGeometry } = this.props;
    fetchRoadProperty(vpromm);
    fetchRoadGeometry(vpromm);
  }

  componentDidMount () {
    this.map = new mapboxgl.Map({
      container: 'asset-map',
      center: [106.12774207395364, 16.185396038978936],
      zoom: 4,
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    });

    this.map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }));
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    this.map.on('load', () => {
      this.setupMapStyle();
    });

    // Disable map rotation using right click + drag.
    this.map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture.
    this.map.touchZoomRotate.disableRotation();

    // Remove compass.
    document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.vpromm !== nextProps.vpromm) {
      this.props.fetchRoadProperty(nextProps.vpromm);
      this.props.fetchRoadGeometry(nextProps.vpromm);
    }

    if (this.props.roadGeo.fetching && !nextProps.roadGeo.fetching && !nextProps.roadGeo.error) {
      // do this once props have been set
      process.nextTick(() => this.setupMapStyle());
    }
  }

  setupMapStyle () {
    const { fetched, data } = this.props.roadGeo;

    if (!fetched) return;
    if (!data.features.length) return;

    if (!this.map.getSource('road-geometry')) {
      this.map.on('load', () => {
        this.map.addSource('road-geometry', { type: 'geojson', data: data });
        this.map.addLayer({
          id: `road-geometry-layer`,
          type: 'line',
          source: 'road-geometry',
          paint: {
            'line-width': 4,
            'line-color': '#da251d'
          }
        });
        this.map.addLayer({
          id: 'road-geometry-highlight',
          type: 'line',
          source: 'road-geometry',
          paint: {
            'line-width': 5,
            'line-color': '#000'
          },
          filter: ['==', 'way_id', '']
        });
      });
    } else {
      const source = this.map.getSource('road-geometry');
      source.setData(data);
    }


    if (data.features.length > 0) {
      this.map.fitBounds(bbox(data), { padding: 20 });
    }
  }

  onModalClose (data = {}) {
    this.setState({ editModalOpen: false });
    if (data.action === 'refresh') {
      // Why the setTimeout you ask?
      // For some reason redux-fractal doesn't play well with thunks.
      // It thinks that the action is being dispatched from a reducer and
      // throws an error. "Reducers may not dispatch actions."
      // This is meant to refresh the data after properties are saved.
      setTimeout(() => { this.props.fetchRoadProperty(this.props.vpromm); }, 0);
    } else if (data.action === 'redirect') {
      setTimeout(() => { this.props.router.push({pathname: `/${this.props.language}/assets/road/${data.vpromm}/`}); }, 0);
    }
  }

  onEditProperties (e) {
    e.preventDefault();
    this.setState({ editModalOpen: true });
  }

  onEditDelete (e) {
    e.preventDefault();
    showConfirm({
      title: 'Delete asset',
      body: (
        <div>
          <p><T>Are you sure you want to delete road <strong>{this.props.vpromm}</strong>?<br /> Note that this action is irreversible.</T></p>
        </div>
      )
    }, () => {
      this.props.deleteRoad(this.props.vpromm);
      this.props.router.push({pathname: `/${this.props.language}/assets`});
    });
  }

  async onStateChange (status, e) {
    e.preventDefault();

    try {
      const res = await this.props.editRoadStatus(this.props.vpromm, status);
      if (res.error) throw new Error(res.error);
    } catch (error) {
      alert('An error occurred while saving. Please try again.');
    }
  }

  hasGeometry () {
    const { roadGeo } = this.props;
    return roadGeo.fetched ? get(roadGeo, 'data.features', []).length > 0 : true;
  }

  renderProperties () {
    const { fetched, data } = this.props.roadProps;
    if (!fetched) return null;

    // calculate length if length is null
    if (this.props.roadGeo && this.props.roadGeo.data && this.props.roadGeo.data.features && this.props.roadGeo.data.features.length > 0 && !data.properties.length) {
      const roadGeo = this.props.roadGeo.data;
      const roadLength = length(roadGeo, {units: 'kilometers'});
      data.properties.length = roadLength;
    }

    const nameToLabel = {
      'length': 'Road Length (ORMA)',
      'Road Length': 'Road Length (VPROMM)'
    };

    const convertToFloat = ['Road Length (ORMA)', 'Road Length (VPROMM)', 'iri_mean', 'iri_med', 'iri_min', 'iri_max'];

    // setup the order for rendering attributes
    const renderOrder = ['Road Name', 'Road Number', 'Management', 'Province Name', 'Province GSO code', 'Road Start Location', 'Road End Location', 'Road Length', 'length', 'iri_mean', 'iri_med', 'iri_min', 'iri_max'];

    let propNames = Object.keys(data.properties);

    // remove lat long attributes https://github.com/orma/openroads-vn-analytics/issues/533
    propNames = without(propNames, 'Road Start Latitude', 'Road Start Longitude', 'Road End Latitude', 'Road End Longitude');

    // sort based on the render order
    propNames.sort((a, b) => renderOrder.indexOf(a) > renderOrder.indexOf(b) ? 1 : -1);

    const renderDlItem = (name) => {
      return [
        nameToLabel.hasOwnProperty(name) ? <dt key={`dt-${name}`}><T>{nameToLabel[name]}</T></dt> : <dt key={`dt-${name}`}>{name}</dt>,
        convertToFloat.indexOf(name) > -1 ? <dd key={`dd-${name}`}>{parseFloat(data.properties[name]).toFixed(2) || '-'}</dd> : <dd key={`dd-${name}`}>{data.properties[name] || '-'}</dd>
      ];
    };

    return (
      <section>
        {propNames.length ? (
          <dl className='attributes-list'>
            {propNames.map(renderDlItem)}
          </dl>
        ) : (
          <div className='no-content no-content--attributes'>
            <p><T>This asset doesn't have any attributes.</T></p>
            <p><a className='button button--base-raised-light' href='#' onClick={this.onEditProperties}><T>Edit attributes</T></a></p>
          </div>
        )}
      </section>
    );
  }

  highlightMap (id) {
    this.map.setFilter('road-geometry-highlight', ['==', 'way_id', id]);
  }

  unhighlightMap (id) {
    this.map.setFilter('road-geometry-highlight', ['==', 'way_id', '']);
  }

  renderSections () {
    if (!this.hasGeometry()) {
      return (
        <div>No Section Data Available</div>
      );
    }
    const { fetched, data } = this.props.roadGeo;
    if (!fetched) return null;
    const allProps = [...new Set(data.features.map(f => Object.keys(f.properties)).flat())];
    const ignoreProps = [];
    // const ignoreProps = [
    //   'id',
    //   'way_id',
    //   'or_vpromms',
    //   'highway'
    // ];
    let filteredProps = allProps.filter(p => {
      return ignoreProps.indexOf(p) === -1;
    });
    let header = ['Way ID'];
    let rows = [];
    if (filteredProps.length === 0) {
      header.push('');
      rows = data.features.map(f => {
        return [
          f.properties.way_id,
          'No Section Data'
        ];
      });
    } else {
      filteredProps = filteredProps.filter(p => sectionFields.hasOwnProperty(p));
      const headerLabels = filteredProps.map(p => {
        return sectionFields[p].label;
      });
      headerLabels.sort();
      header = header.concat(headerLabels);
      filteredProps.sort((a, b) => {
        return headerLabels.indexOf(sectionFields[a].label) > headerLabels.indexOf(sectionFields[b].label) ? 1 : -1;
      });
      rows = data.features.map(f => {
        const cols = filteredProps.map(p => {
          return f.properties[p] ? getSectionValue(p, f.properties[p]) : 'NA';
        });
        return [f.properties.way_id].concat(cols);
      });
    }
    return (
      <section>
        <div className="scrollable">
          <table className="table">
            <thead>
              <tr>
                {header.map((h, i) => {
                  return (
                    <th key={i}>{h}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                return (
                  <AssetsSectionRow
                    key={r[0]}
                    data={r}
                    onMouseOver={this.highlightMap.bind(this)}
                    onMouseOut={this.unhighlightMap.bind(this)}
                  />
                );
              })
              }
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  renderReviewStatus () {
    const stateMap = {
      'pending': translate(this.props.language, 'Pending'),
      'reviewed': translate(this.props.language, 'Reviewed')
    };

    const reviewState = this.props.roadProps.data.status || 'pending';
    const triggerText = this.props.roadProps.fetched ? stateMap[reviewState] : 'Loading';
    const classForState = (state) => c('drop__menu-item', {'drop__menu-item--active': reviewState === state});

    return (
      <Dropdown
        className='review-status-menu'
        triggerClassName='button-review-status'
        triggerActiveClassName='button--active'
        triggerText={triggerText}
        triggerTitle='Change review state'
        direction='down'
        alignment='left' >
        <h3 className='drop__title'><T>Review status</T></h3>
        <ul className='drop__menu drop__menu--select'>
          <li><a href='#' className={classForState('pending')} onClick={this.onStateChange.bind(this, 'pending')} data-hook='dropdown:close'>{stateMap['pending']}</a></li>
          <li><a href='#' className={classForState('reviewed')} onClick={this.onStateChange.bind(this, 'reviewed')} data-hook='dropdown:close'>{stateMap['reviewed']}</a></li>
        </ul>
      </Dropdown>
    );
  }

  onTabClick (tab, e) {
    e.preventDefault();
    this.setState({ activeTab: tab });
  }

  renderTabs () {
    const tabs = [
      {key: 'attributes', label: 'Attributes'},
      {key: 'sections', label: 'Sections'}
    ];
    return (
      <ul className='nav-tabs'>
        {tabs.map(t => (
          <li key={t.key}>
            <a href='#' className={c({'tab--active': this.state.activeTab === t.key})} title={translate(this.props.language, 'Switch tab')} onClick={this.onTabClick.bind(this, t.key)}><T>{t.label}</T></a>
          </li>
        ))}
      </ul>
    );
  }

  render () {
    const { vpromm, language, roadProps, roadGeo } = this.props;
    const disId = get(roadProps, 'data.district.id', null);
    const disName = get(roadProps, 'data.district.name', null);
    const provId = get(roadProps, 'data.province.id', null);
    const provName = get(roadProps, 'data.province.name', null);
    const hasGeometry = this.hasGeometry();

    let featCenter = [0, 0];
    if (roadProps.error) {
      return (<UhOh />);
    }

    if (roadGeo.fetched) {
      featCenter = center(roadGeo.data).geometry.coordinates;
    }

    return (
      <div className='incontainer'>
        <div className='incontainer__header'>
          <div className='incontainer__headline'>
            <h2 className='incontainer__title'>{vpromm}</h2>

            <ol className='incontainer__breadcrumb'>
              <li><Link title='View assets page' to={`/${language}/assets`}>Overview</Link></li>
              {provId && <li><Link title='View province page' to={`/${language}/assets/${provId}`}>{provName}</Link></li>}
              {disId && <li><Link title='View district page' to={`/${language}/assets/${provId}/${disId}`}>{disName}</Link></li>}
            </ol>
          </div>
          <div className='incontainer__hactions'>
            {this.renderReviewStatus()}

            <a href={`${api}/properties/roads/${vpromm}.geojson?download`} className='ica-download'><T>Download</T></a>

            <Dropdown
              className='browse-menu'
              triggerClassName='ica-pencil ica-main'
              triggerActiveClassName='button--active'
              triggerText='Edit'
              triggerTitle='Toggle menu options'
              direction='down'
              alignment='right' >
              <ul className='drop__menu drop__menu--iconified edit-menu'>
                <li><a href='#' className='drop__menu-item em-attributes' onClick={this.onEditProperties}>Attributes</a></li>
                <li><Link to={`/${language}/editor?center=${featCenter.join('/')}`} className={c('drop__menu-item em-geometry', {disabled: !hasGeometry})} disabled={!hasGeometry}>Geometry</Link></li>
              </ul>
              <ul className='drop__menu drop__menu--iconified'>
                <li><a href='#' className='drop__menu-item em-delete' onClick={this.onEditDelete}>Delete</a></li>
              </ul>
            </Dropdown>
          </div>
        </div>

        <figure className='map map--detail'>
          <div className='map__media' id='asset-map' />
          {!hasGeometry ? (
            <div className='no-content no-content--geometry'>
              <p><T>This asset doesn't have geometry.</T></p>
              <p><Link to={`/${language}/upload`} className='button button--achromic-glass'><T>Upload geometry</T></Link></p>
            </div>
          ) : null}
          <figcaption className='map__caption'><p><T>Asset geometry</T></p></figcaption>
        </figure>

        {this.renderTabs()}
        {this.state.activeTab === 'attributes' && this.renderProperties()}

        {this.state.activeTab === 'sections' && this.renderSections()}

        {this.props.roadProps.fetched ? <AssetsEditModal
          revealed={this.state.editModalOpen}
          onCloseClick={this.onModalClose}
          opOnRoadProperty={this.props.opOnRoadProperty}
          editRoad={this.props.editRoad}
          vpromm={vpromm}
          roadPropsOp={this.props.roadPropsOp}
          roadProps={this.props.roadProps} /> : null}
      </div>
    );
  }
}

if (environment !== 'production') {
  AssetsDetail.propTypes = {
    vpromm: PropTypes.string,
    router: PropTypes.object,
    roadGeo: PropTypes.object,
    roadProps: PropTypes.object,
    roadPropsOp: PropTypes.object,
    language: PropTypes.string,
    fetchRoadProperty: PropTypes.func,
    fetchRoadGeometry: PropTypes.func,
    deleteRoad: PropTypes.func,
    opOnRoadProperty: PropTypes.func,
    editRoad: PropTypes.func,
    editRoadStatus: PropTypes.func
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
      return {...state, fetching: true, fetched: false, error: false};
    case FETCH_ROAD_PROPERTY_ERROR:
      return {...state, fetching: false, fetched: true, error: true};
    case FETCH_ROAD_PROPERTY_SUCCESS:
      return {...state, fetching: false, fetched: true, data: action.properties};
    case EDIT_ROAD_STATUS_SUCCESS:
      return {...state, data: {...state.data, status: action.value}};
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
      return {...state, fetching: true, fetched: false, error: false};
    case FETCH_ROAD_GEOMETRY_ERROR:
      return {...state, fetching: false, fetched: true, error: true};
    case FETCH_ROAD_GEOMETRY_SUCCESS:
      return {...state, fetching: false, fetched: true, data: action.geoJSON};
  }

  return state;
};

// Road operations state and reducer.
// Handles operations done to the properties.
const stateOpOnRoad = {
  processing: false,
  data: {}
};

const reducerOpOnRoad = (state = stateOpOnRoad, action) => {
  switch (action.type) {
    case OP_ON_ROAD_PROPERTY:
      return {...state, processing: true, error: false};
    case OP_ON_ROAD_PROPERTY_SUCCESS:
      return {...state, processing: false, error: false, data: action.data};
    case OP_ON_ROAD_PROPERTY_ERROR:
      return {...state, processing: false, error: true};
  }

  return state;
};

const reducer = combineReducers({
  properties: reducerRoadProps,
  geometry: reducerRoadGeo,
  operations: reducerOpOnRoad
});

// Notes:
// The state for each road is handled locally with redux-fractal.
// The data from the api is also saved in the global state but since each
// mapStateToProps (either local() or connect()) causes a render is difficult
// to merge both therefore we're handling everything here.
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
      roadGeo: state.geometry,
      roadPropsOp: state.operations
    }),
    filterGlobalActions: ({ type }) => [
      FETCH_ROAD_GEOMETRY,
      FETCH_ROAD_GEOMETRY_SUCCESS,
      FETCH_ROAD_GEOMETRY_ERROR,
      FETCH_ROAD_PROPERTY,
      FETCH_ROAD_PROPERTY_SUCCESS,
      FETCH_ROAD_PROPERTY_ERROR,
      OP_ON_ROAD_PROPERTY,
      OP_ON_ROAD_PROPERTY_SUCCESS,
      OP_ON_ROAD_PROPERTY_ERROR,
      EDIT_ROAD_STATUS_SUCCESS
    ].indexOf(type) > -1
  }),
  connect(
    (state, props) => ({}),
    (dispatch) => ({
      fetchRoadGeometry: (...args) => dispatch(fetchRoadGeometryEpic(...args)),
      fetchRoadProperty: (...args) => dispatch(fetchRoadPropertyEpic(...args)),
      opOnRoadProperty: (...args) => dispatch(opOnRoadPropertyEpic(...args)),
      deleteRoad: (...args) => dispatch(deleteRoadEpic(...args)),
      editRoad: (...args) => dispatch(editRoadEpic(...args)),
      editRoadStatus: (...args) => dispatch(editRoadStatusEpic(...args))
    })
  )
)(AssetsDetail);
