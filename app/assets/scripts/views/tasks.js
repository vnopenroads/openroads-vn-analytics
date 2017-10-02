'use strict';

import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import getExtent from 'turf-extent';
import { t } from '../utils/i18n';

import {
  fetchWayTasks
} from '../actions/action-creators';

const source = 'collisions';
const roadHoverId = 'road-hover';
const collisionHoverId = 'collision-hover';
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
}].map(layer => Object.assign({source}, layer));

const layerIds = layers.map(layer => layer.id);

var Tasks = React.createClass({
  getInitialState: function () {
    return {
      currentTaskId: null,
      currentTask: null,
      mode: null,
      hoverId: null,
      selectedIds: []
    };
  },

  propTypes: {
    _fetchWayTasks: React.PropTypes.func,
    _fetchWayTask: React.PropTypes.func,

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
        // TODO add selected road IDs to state, and render them with a selected appearance.
        // Probably need to make new style layers for this.
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
    const { mode } = this.state;
    return (
      <div className='map-options map-panel'>
        <div className='form-group'>
          <label className='map-options-label'>{t('Select an action')}</label>
          <select className='map__options--select' onChange={this.enterMode} value={mode}>
            <option value=''></option>
            <option value='merge'>Merge line geometries</option>
            <option value='join'>Join at intersection</option>
          </select>
        </div>
        { mode === 'merge' ? this.renderMergeMode() : null }
        { mode === 'join' ? this.renderJoinMode() : null }
        <div className='form-group'>
          {/* TODO if we've already completed an action, don't show the skip button */}
          <button className='bttn bttn-m bttn-primary' type='button' onClick={this.skip}>Skip</button>
          <button className='bttn bttn-m bttn-secondary' type='button' onClick={this.done}>Done</button>
        </div>
      </div>
    );
  },

  skip: function () {
    this.fetchNextTask(this.state.currentTaskId, this.props.taskIds);
  },

  done: function () {
    // TODO post an API call to mark the current task ID as 'in progress'
    this.fetchNextTask(this.state.currentTaskId, this.props.taskIds);
  },

  enterMode: function (e) {
    const mode = e.currentTarget.value;
    this.setState({ mode, selectedIds: [] });
  },

  renderMergeMode: function () {
    return (
      <div className='form-group'>
        <label className='map-options-label'>Select a group of roads to merge.</label>
        {this.renderSelectedIds()}
      </div>
    );
  },

  renderJoinMode: function () {
    return (
      <div className='form-group'>
        <label className='map-options-label'>Select two roads to join with an intersection.</label>
        {this.renderSelectedIds()}
      </div>
    );
  },

  renderSelectedIds: function () {
    const { selectedIds } = this.state;
    if (!selectedIds.length) {
      return <p className='empty'>No roads selected yet. Click a road to select it.</p>;
    }
    return (
      <ul className='map__options--selected'>
        {/* TODO render selected road ids. We should try to get the vprom id or name if it's available */}
      </ul>
    );
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
    _fetchWayTasks: function () { dispatch(fetchWayTasks()); }
  };
}

module.exports = connect(selector, dispatcher)(Tasks);
