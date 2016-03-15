'use strict';
import React from 'react';
import { Link } from 'react-router';

var AATofixTasks = React.createClass({
  displayName: 'AATofixTasks',

  propTypes: {
    tasks: React.PropTypes.array,
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool
  },

  typeMatrix: {
    'missing-props': 'Missing Props',
    'invalid-one-way': 'Invalid One-way'
  },

  renderTasks: function (task) {
    return (
      <li key={task.id}>
        <AATofixTaskItem
          id={task.id}
          type={task.type}
          details={task.details} />
      </li>
    );
  },

  renderContent: function () {
    if (this.props.fetching) {
      return <p>Loading data...</p>;
    }

    let tasks = this.props.tasks;
    if (!tasks.length) {
      return <p>No tasks</p>;
    }

    return <ul>{tasks.map(this.renderTasks)}</ul>;
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }
    let tasks = this.props.tasks;
    let title = 'To fix';
    if (this.props.fetched && !this.props.fetching && tasks.length) {
      title += ` (${tasks.length})`;
    }
    return (
      <div className='aa-tofixtasks'>
        <h2 className='aa-tofixtasks__title'>{title}</h2>
        <div className='aa-tofixtasks__contents'>
          {this.renderContent()}
        </div>
      </div>
    );
  }
});

var AATofixTaskItem = React.createClass({
  displayName: 'AATofixTaskItem',

  propTypes: {
    type: React.PropTypes.string,
    details: React.PropTypes.string,
    fetching: React.PropTypes.bool
  },

  typeMatrix: {
    'missing-props': 'Missing Props',
    'invalid-one-way': 'Invalid One-way'
  },

  render: function () {
    return (
      <Link to='' className='aa-tofixtasks__wrapper'>
        <div className='flag'>
          <div className='flag__image'>
            <div className='aa-tofixtasks__map'>MAP</div>
          </div>
          <div className='flag__body'>
            <p><strong>Type:</strong> {this.typeMatrix[this.props.type]}</p>
            <p><strong>Details:</strong> {this.props.details}</p>
          </div>
        </div>
      </Link>
    );
  }
});

module.exports = AATofixTasks;
