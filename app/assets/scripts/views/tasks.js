'use strict';

import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import getExtent from 'turf-extent';

import {
  fetchWayTasks
} from '../actions/action-creators';

const source = 'collisions';
const layers = [{
  id: 'road',
  type: 'line',
  paint: { 'line-width': 4 },
  layout: { 'line-cap': 'round' },
  filter: ['has', '_collisions']
}, {
  id: 'collisions',
  type: 'line',
  paint: { 'line-width': 4 },
  layout: { 'line-cap': 'round' },
  filter: ['!has', '_collisions']
}].map(layer => Object.assign({source}, layer));
const layerIds = layers.map(layer => layer.id);

var Tasks = React.createClass({
  getInitialState: function () {
    return {
      currentTaskId: null,
      currentTaskStatus: null,
      currentTask: null
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
        let features = map.queryRenderedFeatures(e.point, { layers: layerIds });
        if (features.length) {
          map.getCanvas().style.cursor = 'pointer';
        } else {
          map.getCanvas().style.cursor = '';
        }
      });
    });
  },

  componentWillReceiveProps: function ({meta, taskIds, currentTask}) {
    if (taskIds) {
      const { currentTaskId, currentTaskStatus } = this.state;
      if ((!currentTask || currentTaskStatus === 'done') && !meta.fetching) {
        // Current task is done (or there's no current task), query the next task
        let nextTask = this.getNextTask(currentTaskId, taskIds);
        return nextTask ? this.props._fetchWayTask(nextTask) : null;
      } else if (currentTask && currentTaskId !== currentTask._id) {
        // We've queried and received a new task
        this.setNewTask(currentTask);
        return this.onMapLoaded(() => this.syncMapToTask(currentTask));
      }
    }
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
      currentTaskStatus: 'new',
      currentTask: task
    });
  },

  onMapLoaded: function (fn) {
    if (this.map.loaded()) fn();
    else this.map.once('load', fn);
  },

  featureCollectionFromTask: function (task) {
    return {
      type: 'FeatureCollection',
      features: Array.concat.apply([], [[task], task._collisions])
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

  render: function () {
    return (
      <div className='task-container'>
        <div className='map-container'>
          <div id='map' />
        </div>
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
