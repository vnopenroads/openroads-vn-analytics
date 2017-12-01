'use strict';

import React from 'react';
import {
  debounce
} from 'lodash';
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
  setGlobalZoom
} from '../actions/action-creators';
import {
  queryOsmEpic,
  deleteEntireWaysEpic
} from '../redux/modules/osm';
import {
  fetchNextWayTaskEpic,
  fetchWayTaskCountEpic,
  markWayTaskPendingEpic,
  skipTask
} from '../redux/modules/tasks';
import { createModifyLineString } from '../utils/to-osm';
import { t } from '../utils/i18n';


const source = 'collisions';
const roadHoverId = 'road-hover';
const roadSelected = 'road-selected';
const layers = [{
  id: 'road',
  type: 'line',
  paint: {
    'line-width': 4,
    'line-opacity': 0.2
  },
  layout: { 'line-cap': 'round' }
}, {
  id: roadHoverId,
  type: 'line',
  paint: {
    'line-width': 6,
    'line-opacity': 0.9
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}, {
  id: roadSelected,
  type: 'line',
  paint: {
    'line-width': 6,
    'line-opacity': 0.9,
    'line-color': '#FF0000'
  },
  layout: { 'line-cap': 'round' },
  filter: ['==', '_id', '']
}].map(layer => Object.assign({source}, layer));

const layerIds = layers.map(layer => layer.id);

var Tasks = React.createClass({
  getInitialState: function () {
    return {
      currentTaskId: null,
      renderedFeatures: null,
      mode: null,
      hoverId: null,
      selectedIds: []
    };
  },

  propTypes: {
    fetchNextTask: React.PropTypes.func,
    _setGlobalZoom: React.PropTypes.func,
    _queryOsm: React.PropTypes.func,
    _markTaskAsDone: React.PropTypes.func,
    _deleteWays: React.PropTypes.func,
    skipTask: React.PropTypes.func,
    osmInflight: React.PropTypes.bool,
    meta: React.PropTypes.object,
    task: React.PropTypes.object,
    taskId: React.PropTypes.number,
    taskCount: React.PropTypes.number
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
      map.on('zoom', () => {
        const { lat, lng } = map.getCenter();
        this.props._setGlobalZoom({ lat, lng, zoom: map.getZoom() });
      });

      map.on('moveend', () => {
        const { lat, lng } = map.getCenter();
        this.props._setGlobalZoom({ lat, lng, zoom: map.getZoom() });
      });

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
          this.setState({ selectedIds }); // eslint-disable-line react/no-did-mount-set-state
        }
      });
    });
  },

  componentWillReceiveProps: function ({ taskId, task, lastUpdated }) {
    // TODO - ANTIPATTERN: should not mirror properties task and taskId in state

    if (taskId && taskId !== this.state.currentTaskId) {
      // We've queried and received a new task
      this.setState({
        currentTaskId: taskId,
        renderedFeatures: task
      }, () => this.onMapLoaded(() => this.syncMap()));
    } else if (lastUpdated && lastUpdated === this.state.currentTaskId) {
      // We've just successfully completed an osm changeset

      // TODO - move this state into redux store so it can be modified directly by actions
      // specifically, COMPLETE_OSM_CHANGE
      this.setState({
        currentTaskId: null,
        selectedIds: [],
        mode: null
      });
    }
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
      <dt key={`${key}-key`}><strong>{t('key')}</strong></dt>,
      <dd key={`${key}-value`}>{t(`${properties[key] || '--'}`)}</dd>
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
    const { taskCount } = this.props;

    return (
      <div className='map__controls map__controls--top-right'>
        <div className='panel tasks-panel'>
          {renderedFeatures ? (
          <div className='panel__header'>
            <div className='panel__headline'>
              <div>
                <h2 className='panel__title'>{t('Task')}</h2>
                {taskCount && <p className='panel__subtitle tasks-remaining'>({taskCount} {t('Tasks Remaining')})</p>}
              </div>
              <p className='panel__subtitle'>{t('Showing')} {renderedFeatures.features.length} {t('Roads')}</p>
            </div>
          </div>
          ) : null }
          <div className='panel__body'>
            {mode ? null : (
              <div>
                <div className='form-group'>
                  <p>{`1. ${t('Select roads to work on')}.`}</p>
                  <div className='map__panel--selected'>
                    {this.renderSelectedIds()}
                  </div>
                </div>
                <div className='form-group map__panel--form'>
                  <p>{`2. ${t('Choose an action to perform')}.`}</p>
                  <button className={c('button button--base-raised-light', {disabled: this.state.selectedIds.length < 2})} type='button' onClick={this.onDedupe}>{t('Remove Duplicates')}</button>
                  <br />
                  <button className={c('button button--base-raised-light', {disabled: this.state.selectedIds.length !== 1})} type='button' onClick={this.onJoin}>{t('Create Intersection')}</button>
                </div>
                <div className='form-group map__panel--form'>
                  <button className='button button--base-raised-light' type='button' onClick={this.markAsDone}>{t('Finish task')}</button>
                  <br />
                  <button className='button button--secondary-raised-dark' type='button' onClick={this.next}>{t('Skip task')}</button>
                </div>
              </div>
            )}
            {mode === 'dedupe' ? this.renderDedupeMode() : null}
            {mode === 'join' ? this.renderJoinMode() : null}
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
    this.setState({mode: 'dedupe', renderedFeatures: selectedFeatures, selectedIds: []}, this.syncMap);
  },

  exitMode: function () {
    const { task } = this.props;
    this.setState({mode: null, renderedFeatures: task, selectedIds: []}, this.syncMap);
  },

  renderDedupeMode: function () {
    return (
      <div className='form-group map__panel--form'>
        <h2>{t('Remove Duplicate Roads')}</h2>
        <p>{t('Click on a road to keep. The other roads here will be deleted.')}</p>
        <button className={c('button button--secondary-raised-dark', {disabled: !this.state.selectedIds.length})} type='button' onClick={this.commitDedupe}>{t('Confirm')}</button>
        <br />
        <button className='button button--base-raised-dark' type='button' onClick={this.exitMode}>{t('Cancel')}</button>
      </div>
    );
  },

  renderJoinMode: function () {
    return (
      <div className='form-group map__panel--form'>
        <h2>Create an Intersection</h2>
        <p>Click on a road to create an intersection with.</p>
        <button className={c('button button--secondary-raised-dark', {disabled: this.state.selectedIds.length !== 2})} type='button' onClick={this.commitJoin}>{t('Confirm')}</button>
        <br />
        <button className='button button--base-raised-dark' type='button' onClick={this.exitMode}>{t('Cancel')}</button>
      </div>
    );
  },

  commitDedupe: function () {
    const { selectedIds, renderedFeatures, currentTaskId } = this.state;
    const { features } = renderedFeatures;
    const toDelete = features.filter(feature => selectedIds[0] !== feature.properties._id);

    this.props._deleteWays(currentTaskId, toDelete.map(feature => feature.properties._id));

    // TODO - should deduping mark task as done?
    this.props._markTaskAsDone(toDelete.map(feature => feature.properties._id));
  },

  commitJoin: function () {
    const { selectedIds, renderedFeatures, currentTaskId } = this.state;
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

    this.props._queryOsm(currentTaskId, changeset);

    // TODO - should deduping mark task as done?
    this.props._markTaskAsDone([line1.properties._id, line2.properties._id]);
  },

  markAsDone: function () {
    // This function is different from #next, in that it allows you
    // to specify all visible roads as 'done'
    this.props._markTaskAsDone(this.state.renderedFeatures.features.map(feature => Number(feature.properties._id)));
    this.next();
  },

  next: function () {
    this.map.setFilter(roadSelected, ['all', ['in', '_id', '']]);
    this.props.skipTask(this.state.currentTaskId);
    this.setState({ selectedIds: [], mode: null }, this.props.fetchNextTask);
  },

  renderSelectedIds: function () {
    const { selectedIds } = this.state;
    if (!selectedIds.length) {
      return <p className='empty'>{`${t('No roads selected yet. Click a road to select it')}.`}</p>;
    }
    if (selectedIds.length === 1) {
      return <p>{t('1 road selected. Select at least one more')}</p>;
    }
    return <p>{`${selectedIds.length} ${t('roads selected')}.`}</p>;
  },

  renderInflight: function () {
    return (
      <div className='map__controls map__controls--top-right'>
        <div className='panel tasks-panel'>
          <div className='panel__body'>
            <h2>{t('Performing action...')}</h2>
          </div>
        </div>
      </div>
    );
  },

  render: function () {
    const { hoverId } = this.state;
    const { osmInflight } = this.props;
    return (
      <section className='inpage inpage--alt'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{t('Tasks')}</h1>
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
                status === 'error' &&
                  <div className='placeholder__fullscreen'>
                    <h3 className='placeholder__message'>{t('Error')}</h3>
                  </div>
              }
              {
                status === 'pending' &&
                  <div className='placeholder__fullscreen'>
                    <h3 className='placeholder__message'>{t('Loading')}</h3>
                  </div>
              }
              {hoverId ? this.renderPropertiesOverlay() : null}
              {osmInflight ? this.renderInflight() : this.renderInstrumentPanel()}
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
      status: state.waytasks.status,
      osmInflight: state.osmChange.fetching,
      lastUpdated: state.osmChange.taskId
    }),
    dispatch => ({
      fetchNextTask: () => dispatch(fetchNextWayTaskEpic()),
      fetchTaskCount: () => dispatch(fetchWayTaskCountEpic()),
      skipTask: (id) => dispatch(skipTask(id)),
      _markTaskAsDone: (taskIds) => dispatch(markWayTaskPendingEpic(taskIds)),
      _queryOsm: (taskId, payload) => dispatch(queryOsmEpic(taskId, payload)),
      _deleteWays: (taskId, wayIds) => dispatch(deleteEntireWaysEpic(taskId, wayIds)),
      _setGlobalZoom: debounce((mapPosition) => dispatch(setGlobalZoom(mapPosition)), 500, { leading: true, trailing: true })
    })
  ),
  lifecycle({
    componentDidMount: function () {
      // TODO - data fetching for this page should be moved into a route container
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
