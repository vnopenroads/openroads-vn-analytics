'use strict';

import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import getExtent from 'turf-extent';
import { t } from '../utils/i18n';
import c from 'classnames';
import intersect from '@turf/line-intersect';

import {
  fetchWayTasks,
  setGlobalZoom
} from '../actions/action-creators';

const source = 'collisions';
const roadHoverId = 'road-hover';
const collisionHoverId = 'collision-hover';
const roadSelected = 'road-selected';
const layers = [{
  id: 'road',
  type: 'line',
  paint: {
    'line-width': 6,
    'line-opacity': 0.8,
    'line-color': '#FCF009'
  },
  layout: { 'line-cap': 'round' },
  filter: ['has', '_main']
}, {
  id: 'collision',
  type: 'line',
  paint: {
    'line-width': 4,
    'line-opacity': 0.2
  },
  layout: { 'line-cap': 'round' },
  filter: ['!has', '_main']
}, {
  id: roadHoverId,
  type: 'line',
  paint: {
    'line-width': 8,
    'line-opacity': 0.9,
    'line-color': '#FCF009'
  },
  layout: { 'line-cap': 'round' },
  filter: ['all', ['has', 'main'], ['==', '_id', '']]
}, {
  id: collisionHoverId,
  type: 'line',
  paint: {
    'line-width': 6,
    'line-opacity': 0.9
  },
  layout: { 'line-cap': 'round' },
  filter: ['all', ['!has', 'main'], ['==', '_id', '']]
}, {
  id: roadSelected,
  type: 'line',
  paint: {
    'line-width': 6,
    'line-opacity': 0.9,
    'line-color': '#FF0000'
  },
  layout: { 'line-cap': 'round' },
  filter: ['all', ['!has', 'main'], ['==', '_id', '']]
}].map(layer => Object.assign({source}, layer));

const layerIds = layers.map(layer => layer.id);

var Tasks = React.createClass({
  getInitialState: function () {
    return {
      currentTaskId: null,
      currentTask: null,
      hoverId: null,
      selectedIds: []
    };
  },

  propTypes: {
    _fetchWayTasks: React.PropTypes.func,
    _fetchWayTask: React.PropTypes.func,
    _setGlobalZoom: React.PropTypes.func,

    meta: React.PropTypes.object,
    currentTask: React.PropTypes.object,
    taskIds: React.PropTypes.array
  },

  componentWillMount: function () {
    this.props._fetchWayTasks();
  },

  componentDidMount: function () {
    mapboxgl.accessToken = config.mbToken;
    const map = this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    }).addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    this.onMapLoaded(() => {
      let makeXYZ = function () {
        const xyz = map.getCenter();
        xyz.zoom = map.getZoom();
        return xyz;
      };

      map.on('zoom', () => {
        this.props._setGlobalZoom(makeXYZ());
      });

      map.on('moveend', () => {
        this.props._setGlobalZoom(makeXYZ());
      });

      map.on('mousemove', (e) => {
        // toggle cursor and hover filters on mouseover
        let features = map.queryRenderedFeatures(e.point, { layers: layerIds });
        if (features.length && features[0].properties._id) {
          map.getCanvas().style.cursor = 'pointer';
          this.setHoverFilter(features[0].properties._id);
          this.setState({hoverId: features[0].properties._id});
        } else {
          map.getCanvas().style.cursor = '';
          this.setHoverFilter('');
          this.setState({hoverId: null});
        }
      });

      map.on('click', (e) => {
        let features = map.queryRenderedFeatures(e.point, { layers: [ roadHoverId, collisionHoverId ] });
        if (features.length && features[0].properties._id) {
          let featId = features[0].properties._id;
          // Clone the selected array.
          let selectedIds = [].concat(this.state.selectedIds);
          let idx = findIndex(selectedIds, o => o === featId);

          if (idx === -1) {
            selectedIds.push(featId);
          } else {
            selectedIds.splice(idx, 1);
          }

          this.map.setFilter(roadSelected, ['all', ['in', '_id'].concat(selectedIds)]);
          this.setState({ selectedIds });
        }
      });
    });
  },

  setHoverFilter: function (id) {
    this.map.setFilter(collisionHoverId, ['all', ['!has', '_main'], ['==', '_id', id]]);
    this.map.setFilter(roadHoverId, ['all', ['has', '_main'], ['==', '_id', id]]);
  },

  componentWillReceiveProps: function ({meta, taskIds, currentTask}) {
    if (taskIds) {
      const { currentTaskId } = this.state;
      if (!currentTask && !meta.fetching) {
        // Current task is done (or there's no current task), query the next task
        this.fetchNextTask(currentTaskId, taskIds);
      } else if (currentTask && currentTaskId !== currentTask._id) {
        // We've queried and received a new task
        this.setNewTask(currentTask);
        return this.onMapLoaded(() => this.syncMapToTask(currentTask));
      }
    }
  },

  fetchNextTask: function (currentTaskId, taskIds) {
    let nextTask = this.getNextTask(currentTaskId, taskIds);
    return nextTask ? this.props._fetchWayTask(nextTask) : null;
  },

  getNextTask: function (currentTaskId, taskIds) {
    if (!currentTaskId) { return taskIds[0]; }
    for (var i = 0; i < taskIds.length; ++i) {
      if (taskIds[i] === currentTaskId && i < taskIds.length - 1) {
        return taskIds[i + 1];
      }
    }
    return null;
  },

  setNewTask: function (task) {
    this.setState({
      currentTaskId: task._id,
      currentTask: task
    });
  },

  onMapLoaded: function (fn) {
    if (this.map.loaded()) fn();
    else this.map.once('load', fn);
  },

  featureCollectionFromTask: function (task) {
    // For setting interaction filters, apply _main property to the road,
    // and make sure the _id property is present at feature.properties.
    task.properties._main = true;
    const features = Array.concat.apply([], [[task], task._collisions]);
    features.forEach(feature => {
      feature.properties._id = feature._id;
    });
    return {
      type: 'FeatureCollection',
      features
    };
  },

  syncMapToTask: function (task) {
    const { map } = this;
    const features = this.featureCollectionFromTask(task);
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
  },

  renderPlaceholder: function () {
    return (
      <div className='placeholder__fullscreen'>
        <h3 className='placeholder__message'>Loading your first task...</h3>
      </div>
    );
  },

  renderPropertiesOverlay: function () {
    const { currentTaskId, currentTask, hoverId } = this.state;
    const properties = hoverId === currentTaskId ? currentTask.properties
      : currentTask._collisions.find(c => hoverId === c._id).properties;
    const displayList = Object.keys(properties).map(key => key.charAt(0) === '_' ? null : [
      <dt key={`${key}-key`}><strong>{key}</strong></dt>,
      <dd key={`${key}-value`}>{properties[key] || '--'}</dd>
    ]).filter(Boolean);
    return (
      <aside className='properties__overlay'>
        <dl>
          {displayList}
        </dl>
      </aside>
    );
  },

  renderMapLegend: function () {
    return (
      <div className='map-legend map-panel'>
        <ul className='map__legend--split'>
          <li>
            <span className='legend__line legend__line--primary' />
            <p className='legend__label'>{t('Current Road')}</p>
          </li>
          <li>
            <span className='legend__line legend__line--secondary' />
            <p className='legend__label'>{t('Intersecting Road')}</p>
          </li>
        </ul>
      </div>
    );
  },

  renderInstrumentPanel: function () {
    let taskIds = this.props.taskIds || [];
    let currId = this.props.currentTask ? this.props.currentTask._id : null;
    let currTaskIdx = findIndex(taskIds, o => o === currId);

    return (
      <div className='map-options map-panel'>
        <h2>Task {currTaskIdx + 1} of {taskIds.length}</h2>
        <div className='form-group'>
          <p>1. Select the roads to fix</p>
          {this.renderSelectedIds()}
        </div>
        <div className={c('form-group', {disabled: this.state.selectedIds.length < 2})}>
          <p>2. Select the action</p>
          <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.onMerge}>Merge Geometries</button>
          <button className={c('bttn bttn-m bttn-secondary', {disabled: this.state.selectedIds.length > 2})} type='button' onClick={this.onJoin}>Join Intersection</button>
        </div>
        <div className='form-group'>
          <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.next}>Next task</button>
        </div>
      </div>
    );
  },

  onJoin: function () {
    // Get the 2 selected roads. There's a strict maximum of 2 for intersection.
    let roadA = this.props.currentTask._collisions.find(o => o._id === this.state.selectedIds[0]);
    let roadB = this.props.currentTask._collisions.find(o => o._id === this.state.selectedIds[1]);

    let intersection = intersect(roadA, roadB);

    if (!intersection.features.length) {
      alert('Error: Roads do not intersect.');
    }

    // - Create the appropriate structure from ALL the intersecting points in
    // intersection.features
    // - Submit to the API
    // - The UI should be refreshed to show the changes. (re-retch the
    // same task?)
    console.log('intersection', intersection);
  },

  onMerge: function () {
    // - Get the selected roads.
    // - Merge them?
    // - Create the appropriate structure
    // - Submit to the API
    // - The UI should be refreshed to show the changes. (re-retch the
    // same task?)
  },

  next: function () {
    // Deselect roads.
    this.map.setFilter(roadSelected, ['all', ['in', '_id', '']]);
    this.setState({ selectedIds: [] });
    this.fetchNextTask(this.state.currentTaskId, this.props.taskIds);
  },

  renderSelectedIds: function () {
    const { selectedIds } = this.state;
    if (!selectedIds.length) {
      return <p className='empty'>No roads selected yet. Click a road to select it.</p>;
    }
    if (selectedIds.length === 1) {
      return <p>1 road selected. Select at least another one.</p>;
    }
    return <p>{selectedIds.length} roads selected.</p>;
  },

  render: function () {
    const { currentTaskId, hoverId } = this.state;
    return (
      <div className='task-container'>
        <div className='map-container'>
          <div id='map' />
        </div>
        {!currentTaskId ? this.renderPlaceholder() : null}
        {hoverId ? this.renderPropertiesOverlay() : null}
        {this.renderInstrumentPanel()}
        {this.renderMapLegend()}
      </div>
    );
  }
});

function selector (state) {
  return {
    meta: state.waytasks,
    taskIds: state.waytasks.data.taskIds,
    currentTask: state.waytasks.data.currentTask
  };
}

function dispatcher (dispatch) {
  return {
    _fetchWayTask: function (id) { dispatch(fetchWayTasks(id)); },
    _fetchWayTasks: function () { dispatch(fetchWayTasks()); },
    _setGlobalZoom: function (...args) { dispatch(setGlobalZoom(...args)); }
  };
}

module.exports = connect(selector, dispatcher)(Tasks);

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
