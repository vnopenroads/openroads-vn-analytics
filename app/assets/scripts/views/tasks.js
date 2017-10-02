'use strict';

import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import getExtent from 'turf-extent';

import {
  fetchWayTasks
} from '../actions/action-creators';

const SOURCE = 'collisions';

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
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      failIfMajorPerformanceCaveat: false
    }).addControl(new mapboxgl.NavigationControl(), 'bottom-left');
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
    console.log(task);
    const features = this.featureCollectionFromTask(task);
    const source = this.map.getSource(SOURCE);
    if (!source) {
      this.map.addSource(SOURCE, {
        type: 'geojson',
        data: features
      });
    } else {
      source.setData(features);
    }
    this.map.fitBounds(getExtent(features), { linear: true });
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
