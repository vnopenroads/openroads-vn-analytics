'use strict';
import React from 'react';
import { Link } from 'react-router';

var AATofixTasks = React.createClass({
  displayName: 'AATofixTasks',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    adminAreaId: React.PropTypes.number,
    adminAreaName: React.PropTypes.string,
    tasks: React.PropTypes.array,
    meta: React.PropTypes.object,
    error: React.PropTypes.string,
    sliceList: React.PropTypes.bool
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

  renderViewAllLink: function () {
    if (!this.props.sliceList) return null;
    let {limit, total} = this.props.meta;

    if (total > limit) {
      let url = this.props.adminAreaId ? `/analytics/${this.props.adminAreaId}/tasks` : '/analytics/tasks';
      return <Link to={url} className='bttn-view-more'>View all tasks</Link>;
    }
  },

  renderContent: function () {
    let content;
    if (this.props.fetching) {
      content = (
        <ul className='loading-placeholder'>
          <AATofixTaskItemLoading />
          <AATofixTaskItemLoading />
          <AATofixTaskItemLoading />
        </ul>
      );
    } else if (this.props.error) {
      content = <p>Ups.. An error occourred. Try again.</p>;
    } else if (!this.props.meta.total) {
      content = <p>Great! All errors are fixed.</p>;
    }

    if (content) {
      return <div className='aa-tofixtasks__contents'>{content}</div>;
    }

    return (
      <div className='aa-tofixtasks__contents'>
        <ul>{this.props.tasks.map(this.renderTasks)}</ul>
        {this.renderViewAllLink()}
      </div>
    );
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }

    let title = 'To fix';
    if (this.props.fetched && !this.props.fetching && this.props.meta.total) {
      title += ` (${this.props.meta.total})`;
    }
    return (
      <div className='aa-tofixtasks'>
        <h2 className='aa-tofixtasks__title'>{title}</h2>
        {this.renderContent()}
      </div>
    );
  }
});

var AATofixTaskItem = React.createClass({
  displayName: 'AATofixTaskItem',

  propTypes: {
    type: React.PropTypes.string,
    details: React.PropTypes.string,
    id: React.PropTypes.number,
    fetching: React.PropTypes.bool
  },

  typeMatrix: {
    'missing-prop': 'Missing Props'
  },

  render: function () {
    return (
      <Link to='' className='aa-tofixtasks__wrapper'>
        <div className='flag'>
          <div className='flag__image'>
            <div className='aa-tofixtasks__map'>MAP-{this.props.id}</div>
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

// Faux task item for loading ghost.
var AATofixTaskItemLoading = React.createClass({
  displayName: 'AATofixTaskItemLoading',

  render: function () {
    return (
      <li className='aa-tofixtasks__wrapper'>
        <div className='flag'>
          <div className='flag__image'>
            <div className='aa-tofixtasks__map'>&nbsp;</div>
          </div>
          <div className='flag__body'>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
          </div>
        </div>
      </li>
    );
  }
});

module.exports = AATofixTasks;
