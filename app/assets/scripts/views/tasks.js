import React from 'react';
import {
  compose,
  lifecycle
} from 'recompose';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import getExtent from 'turf-extent';
import c from 'classnames';
import intersect from '@turf/line-intersect';
import pointOnLine from '@turf/point-on-line';
import point from 'turf-point';
import {
  queryOsmEpic,
  deleteEntireWaysEpic
} from '../redux/modules/osm';
import {
  setMapPosition
} from '../redux/modules/map';
import {
  fetchNextWayTaskEpic,
  fetchWayTaskCountEpic,
  markWayTaskPendingEpic,
  skipTask,
  selectWayTaskProvince,
  dedupeWayTaskEpic
} from '../redux/modules/tasks';
import { fetchProvinces } from '../actions/action-creators.js';
import { createModifyLineString } from '../utils/to-osm';
import T from '../components/t';
import Select from 'react-select';
import _ from 'lodash';

const source = 'collisions';
const roadHoverId = 'road-hover';
const roadSelected = 'road-selected';
const layers = [{
  id: 'road',
  type: 'line',
  source,
  paint: {
    'line-width': 4,
    'line-opacity': 0.2
  },
  layout: { 'line-cap': 'round' }
}, {
  id: roadHoverId,
  type: 'line',
  source,
  paint: {
    'line-width': 6,
    'line-opacity': 0.9
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}, {
  id: roadSelected,
  type: 'line',
  source,
  paint: {
    'line-width': 6,
    'line-opacity': 0.9,
    'line-color': '#FF0000'
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}];

const layerIds = layers.map(layer => layer.id);

var Tasks = React.createClass({
  getInitialState: function () {
    return {
      renderedFeatures: null,
      mode: null,
      hoverId: null,
      selectedIds: [],
      selectedProvince: null,
      selectedVprommids: [],
      dedupeVprommid: null
    };
  },

  propTypes: {
    fetchNextTask: React.PropTypes.func,
    setMapPosition: React.PropTypes.func,
    _queryOsm: React.PropTypes.func,
    _markTaskAsDone: React.PropTypes.func,
    _deleteWays: React.PropTypes.func,
    skipTask: React.PropTypes.func,
    fetchTaskCount: React.PropTypes.func,
    osmStatus: React.PropTypes.string,
    taskStatus: React.PropTypes.string,
    meta: React.PropTypes.object,
    task: React.PropTypes.object,
    taskId: React.PropTypes.number,
    taskCount: React.PropTypes.number,
    selectOptions: React.PropTypes.object,
    selectedProvince: React.PropTypes.number,
    selectNextTaskProvince: React.PropTypes.func,
    dedupeWayTask: React.PropTypes.func
  },

  componentDidMount: function () {
    mapboxgl.accessToken = config.mbToken;
    const map = this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false,
      zoom: 12
    }).addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    this.onMapLoaded(() => {
      map.on('mousemove', (e) => {
        // toggle cursor and hover filters on mouseover
        let features = map.queryRenderedFeatures(e.point, { layers: layerIds });
        let id;

        if (features.length && features[0].properties._id) {
          map.getCanvas().style.cursor = 'pointer';
          id = features[0].properties._id;
        } else {
          map.getCanvas().style.cursor = '';
          id = '';
        }

        this.setState({hoverId: id}); // eslint-disable-line react/no-did-mount-set-state
        map.setFilter(roadHoverId, ['==', '_id', id]);
      });

      map.on('click', (e) => {
        let features = map.queryRenderedFeatures(e.point, { layers: [ roadHoverId ] });
        if (features.length && features[0].properties._id) {
          let featId = features[0].properties._id;
          let selectedIds;
          let vprommid = [features[0].properties.or_vpromms ? features[0].properties.or_vpromms : 'No ID'];
          let selectedVprommids = vprommid.concat(this.state.selectedVprommids);
          if (this.state.mode === 'dedupe') {
            selectedIds = [featId];
          } else if (this.state.mode === 'join') {
            if (this.state.selectedIds[0] === featId) {
              // in join, don't allow de-selecting the initially selected road
              selectedIds = [].concat(this.state.selectedIds);
            } else {
              // in join, there can only be 2 selections
              selectedIds = [this.state.selectedIds[0], featId];
            }
          } else {
            // Clone the selected array.
            selectedIds = [].concat(this.state.selectedIds);
            let idx = findIndex(selectedIds, o => o === featId);

            if (idx === -1) {
              selectedIds.push(featId);
            } else {
              selectedIds.splice(idx, 1);
            }
          }

          map.setFilter(roadSelected, ['in', '_id'].concat(selectedIds));
          this.setState({ selectedIds, selectedVprommids }); // eslint-disable-line react/no-did-mount-set-state
        }
      });
    });
  },

  componentWillReceiveProps: function ({ task: nextTask, taskId: nextTaskId, osmStatus: nextOsmStatus }) {
    if (this.props.task !== nextTask) {
      // TODO - ANTIPATTERN: should not mirror properties task and taskId in state
      this.setState({ renderedFeatures: nextTask }, () => this.onMapLoaded(() => this.syncMap()));
    } else if (this.props.osmStatus === 'pending' && nextOsmStatus === 'complete') {
      // We've just successfully completed an osm changeset

      // TODO - move this state into redux store so it can be modified directly by actions
      // specifically, COMPLETE_OSM_CHANGE
      this.setState({
        selectedIds: [],
        mode: null
      });
    }
  },

  componentWillUnmount: function () {
    const { lng, lat } = this.map.getCenter();
    const zoom = this.map.getZoom();
    this.props.setMapPosition(lng, lat, zoom);
  },

  onMapLoaded: function (fn) {
    if (this.map.loaded()) fn();
    else this.map.once('load', fn);
  },

  syncMap: function () {
    const features = this.state.renderedFeatures;
    const { map } = this;
    const existingSource = map.getSource(source);
    if (!existingSource) {
      map.addSource(source, {
        type: 'geojson',
        data: features
      });
      layers.forEach(layer => {
        map.addLayer(layer);
      });
    } else {
      existingSource.setData(features);
    }
    map.fitBounds(getExtent(features), {
      linear: true,
      padding: 25
    });
    map.setFilter(roadSelected, ['in', '_id'].concat(this.state.selectedIds));
  },

  renderPropertiesOverlay: function () {
    const { hoverId } = this.state;
    const { task } = this.props;
    const properties = task.features.find(c => hoverId === c.properties._id).properties;
    const displayList = Object.keys(properties).map(key => key.charAt(0) === '_' ? null : [
      <dt key={`${key}-key`}><strong>{key}</strong></dt>,
      <dd key={`${key}-value`}>{properties[key] ? properties[key] : '--'}</dd>
    ]).filter(Boolean);
    return (
      <div className='map__controls map__controls--top-left'>
        <figcaption className='panel properties-panel'>
          <div className='panel__body'>
            <dl>
              {displayList}
            </dl>
          </div>
        </figcaption>
      </div>
    );
  },

  renderInstrumentPanel: function () {
    const { mode, renderedFeatures } = this.state;
    const { taskCount, osmStatus } = this.props;

    if (osmStatus === 'pending') {
      return (
        <div className='map__controls map__controls--top-right'>
          <div className='panel tasks-panel'>
            <div className='panel__body'>
              <h2><T>Performing action...</T></h2>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='map__controls map__controls--top-right'>
        <div className='panel tasks-panel'>
          {renderedFeatures &&
            <div className='panel__header'>
              <div className='panel__headline'>
                <div>
                  <h2 className='panel__title'><T>Task</T></h2>
                  {taskCount && <p className='panel__subtitle tasks-remaining'>({taskCount} <T>Tasks Remaining</T>)</p>}
                </div>
                <p className='panel__subtitle'><T>Showing</T> {renderedFeatures.features.length} <T>Roads</T></p>
              </div>
            </div>
          }
          <div className='panel__body'>
            { this.props.selectOptions.province && this.props.selectOptions.province.length && this.renderProvinceSelect() }
            { mode === null && this.renderSelectMode() }
            { mode === 'dedupe' && this.renderDedupeMode() }
            { mode === 'join' && this.renderJoinMode() }
          </div>
        </div>
      </div>
    );
  },

  onJoin: function () {
    this.setState({mode: 'join'});
  },

  onDedupe: function () {
    const { selectedIds } = this.state;
    const { task } = this.props;
    const selectedFeatures = {
      type: 'FeatureCollection',
      features: selectedIds.map(id => task.features.find(f => f.properties._id === id))
    };

    this.setState({mode: 'dedupe', renderedFeatures: selectedFeatures}, this.syncMap);
  },

  exitMode: function () {
    const { task } = this.props;
    this.setState({mode: null, renderedFeatures: task, selectedIds: []}, this.syncMap);
  },

  renderDedupeMode: function () {
    const uniqVprommids = _.uniq(this.state.selectedVprommids);
    const chooseVprommids = uniqVprommids.length > 1;

    return (
      <div className='form-group map__panel--form'>
        <h2><T>Remove Duplicate Roads</T></h2>
        <p><T>Click on a road to keep. The other roads here will be deleted.</T></p>
        { chooseVprommids && this.renderVprommidSelect() }
        <button className={c('button button--secondary-raised-dark', {disabled: !(this.state.selectedIds.length === 1) || !(chooseVprommids && this.state.dedupeVprommid)})} type='button' onClick={this.commitDedupe}><T>Confirm</T></button>
        <br />
        <button className='button button--base-raised-dark' type='button' onClick={this.exitMode}><T>Cancel</T></button>
      </div>
    );
  },

  renderVprommidSelect: function () {
    const uniqVprommids = _.uniq(this.state.selectedVprommids);
    const vprommidOptions = uniqVprommids.map(x => { return {value: x, label: x}; });
    let value = this.state.dedupeVprommid;
    return (
      <Select
        name="form-vprommid-select"
        searchable={ false }
        value={value}
        onChange={ this.handleSelectVprommid }
        options={ vprommidOptions }
        placeholder = "Select a VPROMMID to apply"
      />
    );
  },

  handleSelectVprommid: function (selectedVprommid) {
    this.setState({ dedupeVprommid: selectedVprommid });
  },

  renderJoinMode: function () {
    return (
      <div className='form-group map__panel--form'>
        <h2>Create an Intersection</h2>
        <p>Click on a road to create an intersection with.</p>
        <button className={c('button button--secondary-raised-dark', {disabled: this.state.selectedIds.length !== 2})} type='button' onClick={this.commitJoin}><T>Confirm</T></button>
        <br />
        <button className='button button--base-raised-dark' type='button' onClick={this.exitMode}><T>Cancel</T></button>
      </div>
    );
  },

  renderSelectMode: function () {
    return (
      <div>
        <div className='form-group'>
          <p>1. <T>Select roads to work on</T></p>
          <div className='map__panel--selected'>
            {this.renderSelectedIds()}
          </div>
        </div>
        <div className='form-group map__panel--form'>
          <p>2. <T>Choose an action to perform</T></p>
          <button
            className={c('button button--base-raised-light', {disabled: this.state.selectedIds.length < 2})}
            type='button'
            onClick={this.onDedupe}
          >
            <T>Remove Duplicates</T>
          </button>
          <br />
          <button
            className={c('button button--base-raised-light', {disabled: this.state.selectedIds.length !== 1})}
            type='button'
            onClick={this.onJoin}
          >
            <T>Create Intersection</T>
          </button>
        </div>
        <div className='form-group map__panel--form'>
          <button
            className='button button--base-raised-light'
            type='button'
            onClick={this.markAsDone}
          >
            <T>Finish task</T>
          </button>
          <br />
          <button
            className='button button--secondary-raised-dark'
            type='button'
            onClick={this.next}
          >
            <T>Skip task</T>
          </button>
        </div>
      </div>
    );
  },

  commitDedupe: function () {
    const { selectedIds, renderedFeatures, dedupeVprommid } = this.state;
    const { features } = renderedFeatures;
    const toDelete = features.filter(feature => selectedIds[0] !== feature.properties._id);
    const wayIdToKeep = selectedIds[0];
    this.props.dedupeWayTask(this.props.taskId, toDelete.map(feature => feature.properties._id), wayIdToKeep, dedupeVprommid.value);
    // this.props._deleteWays(this.props.taskId, toDelete.map(feature => feature.properties._id));

    // TODO - should deduping mark task as done?
    this.props._markTaskAsDone(toDelete.map(feature => feature.properties._id));
  },

  commitJoin: function () {
    const { selectedIds, renderedFeatures } = this.state;
    const { features } = renderedFeatures;
    const line1 = features.find(f => f.properties._id === selectedIds[0]);
    const line2 = features.find(f => f.properties._id === selectedIds[1]);
    const intersectingFeatures = intersect(line1, line2);
    const changes = [];

    if (!intersectingFeatures.features.length) {
      // lines don't intersect, join them from the nearest endpoint of line 1
      // find the end of line 1 that's closest to line 2
      // add that point to both ways
      let start = pointOnLine(line2, point(line1.geometry.coordinates[0]));
      let end = pointOnLine(line2, point(line1.geometry.coordinates[line1.geometry.coordinates.length - 1]));
      let fromStart = start.properties.dist < end.properties.dist;
      let intersection = fromStart ? start : end;
      let connectingFeature = Object.assign({}, line1, {
        geometry: {
          type: 'LineString',
          coordinates: fromStart
            ? [intersection.geometry.coordinates].concat(line1.geometry.coordinates)
            : line1.geometry.coordinates.concat([intersection.geometry.coordinates])
        }
      });
      changes.push(connectingFeature);
      changes.push(insertPointOnLine(line2, intersection));
    } else {
      let intersection = intersectingFeatures.features[0];
      changes.push(insertPointOnLine(line1, intersection));
      changes.push(insertPointOnLine(line2, intersection));
    }

    const changeset = createModifyLineString(changes);

    this.props._queryOsm(this.props.taskId, changeset);

    // TODO - should deduping mark task as done?
    this.props._markTaskAsDone([line1.properties._id, line2.properties._id]);
  },

  markAsDone: function () {
    // This function is different from #next, in that it allows you
    // to specify all visible roads as 'done'
    this.props._markTaskAsDone(this.state.renderedFeatures.features.map(feature => Number(feature.properties._id)));
    this.props.fetchTaskCount();
    this.next();
  },

  next: function () {
    this.map.setFilter(roadSelected, ['all', ['in', '_id', '']]);
    this.props.skipTask(this.props.taskId);
    this.setState({ selectedIds: [], mode: null }, this.props.fetchNextTask);
  },

  renderSelectedIds: function () {
    const { selectedIds } = this.state;
    if (!selectedIds.length) {
      return <p className='empty'><T>No roads selected yet. Click a road to select it</T></p>;
    }
    if (selectedIds.length === 1) {
      return <p><T>1 road selected. Select at least one more</T></p>;
    }
    return <p>{selectedIds.length} <T>roads selected</T></p>;
  },

  handleProvinceChange: function (selectedProvince) {
    const value = selectedProvince ? selectedProvince.value : null;
    this.props.selectNextTaskProvince(value);
    this.props.fetchNextTask();
  },

  renderProvinceSelect: function () {
    const { selectedProvince } = this.props;
    const provinceOptions = this.props.selectOptions.province.map((p) => { return {value: p.id, label: p.name_en}; });
    const value = selectedProvince;
    return (
      <Select
        name="form-province-select"
        value={value}
        onChange= {this.handleProvinceChange}
        options={ provinceOptions }
        placeholder = "Filter tasks by province..."
      />
    );
  },

  render: function () {
    const { taskId, taskStatus } = this.props;
    const { hoverId } = this.state;

    return (
      <section className='inpage inpage--alt'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>Tasks</T></h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>

            <div className='task-container'>
              <figure className='map'>
                <div className='map__media' id='map'></div>
              </figure>
              {
                hoverId && this.renderPropertiesOverlay()
              }
              {
                taskStatus === 'error' &&
                  <div className='placeholder__fullscreen'>
                    <h3 className='placeholder__message'><T>Error</T></h3>
                  </div>
              }
              {
                !taskId && taskStatus === 'pending' &&
                  <div className='placeholder__fullscreen'>
                    <h3 className='placeholder__message'><T>Loading</T></h3>
                  </div>
              }
              {
                this.renderInstrumentPanel()
              }
            </div>

          </div>
        </div>
      </section>
    );
  }
});


export default compose(
  connect(
    state => ({
      task: state.waytasks.geoJSON,
      taskId: state.waytasks.id,
      taskCount: state.waytasks.taskCount,
      taskStatus: state.waytasks.status,
      osmStatus: state.osmChange.status,
      selectOptions: state.provinces.data,
      selectedProvince: state.waytasks.selectedProvince
    }),
    dispatch => ({
      fetchProvinces: () => dispatch(fetchProvinces()),
      selectNextTaskProvince: (provinceId) => dispatch(selectWayTaskProvince(provinceId)),
      dedupeWayTask: (taskId, wayIds, wayIdToKeep, dedupeVprommid) => dispatch(dedupeWayTaskEpic(taskId, wayIds, wayIdToKeep, dedupeVprommid)),
      fetchNextTask: () => dispatch(fetchNextWayTaskEpic()),
      fetchTaskCount: () => dispatch(fetchWayTaskCountEpic()),
      skipTask: (id) => dispatch(skipTask(id)),
      _markTaskAsDone: (taskIds) => dispatch(markWayTaskPendingEpic(taskIds)),
      _queryOsm: (taskId, payload) => dispatch(queryOsmEpic(taskId, payload)),
      _deleteWays: (taskId, wayIds) => dispatch(deleteEntireWaysEpic(taskId, wayIds)),
      setMapPosition: (lng, lat, zoom) => dispatch(setMapPosition(lng, lat, zoom))
    })
  ),
  lifecycle({
    componentDidMount: function () {
      // TODO - data fetching for this page should be moved into a route container
      // fire to get all the provinces here.
      this.props.fetchProvinces();
      this.props.fetchNextTask();
      this.props.fetchTaskCount();
    }
  })
)(Tasks);

function findIndex (haystack, fn) {
  let idx = -1;
  haystack.some((o, i) => {
    if (fn(o)) {
      idx = i;
      return true;
    }
    return false;
  });
  return idx;
}

function insertPointOnLine (feature, point) {
  const nearest = pointOnLine(feature, point);
  const coordinates = feature.geometry.coordinates.slice();
  coordinates.splice(nearest.properties.index + 1, 0, point.geometry.coordinates);
  return Object.assign({}, feature, {
    geometry: {
      type: 'LineString',
      coordinates
    }
  });
}
