'use strict';

import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import {
  fetchWayTasks
} from '../actions/action-creators';

var Tasks = React.createClass({

  getInitialState: function () {
    return {
      currentTaskId: null,
      currentTaskStatus: null,
      currentTask: null
    }
  },

  componentWillMount: function () {
    this.props._fetchWayTasks();
  },

  componentWillReceiveProps: function ({meta, taskIds, currentTask}) {
    if (taskIds) {
      const { currentTaskId, currentTaskStatus } = this.state;

      if ((!currentTaskId || currentTaskStatus === 'done') && !meta.fetching) {
        // Current task is done (or there's no current task), query the next task
        let nextTask = this.getNextTask(currentTaskId, taskIds)
        return nextTask ? this.props._fetchWayTask(nextTask) : null

      } else if (currentTask && currentTaskId !== currentTask._id) {
        // Queried and received a new task
        return this.setNewTask(currentTask);

      }
    }
  },

  setNewTask: function (task) {
    this.setState({
      currentTaskId: task._id,
      currentTaskStatus: 'new',
      currentTask: task
    });
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

  render: function () {
    console.log(this.state.currentTaskId);
    return <div />;
  }
});

function selector (state) {
  return {
    meta: state.waytasks,
    taskIds: state.waytasks.data.taskIds,
    currentTask: state.waytasks.data.currentTask
  }
};

function dispatcher (dispatch) {
  return {
    _fetchWayTask: function (id) { dispatch(fetchWayTasks(id)) },
    _fetchWayTasks: function () { dispatch(fetchWayTasks()) }
  };
}

module.exports = connect(selector, dispatcher)(Tasks);
