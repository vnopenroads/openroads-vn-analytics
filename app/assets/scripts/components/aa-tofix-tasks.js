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

  renderWayTasks: function (way) {
    return (
      <li key={way.way_id}>
        <AATofixTaskItem
          id={way.way_id}
          state={way.state}
          items={way.tasks} />
      </li>
    );
  },

  renderViewAllLink: function () {
    if (!this.props.sliceList) return null;
    let {limit, total} = this.props.meta;

    if (total > limit) {
      let url = `/analytics/${this.props.adminAreaId}/tasks`;
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
      content = <p className='aa-tofixtasks--empty'>Oops... An error occurred.</p>;
    } else if (!this.props.meta.total) {
      content = <p className='aa-tofixtasks--empty'>No errors to show.</p>;
    }

    if (content) {
      return <div className='aa-tofixtasks__contents'>{content}</div>;
    }

    return (
      <div className='aa-tofixtasks__contents'>
        <ul>{this.props.tasks.map(this.renderWayTasks)}</ul>
        {this.renderViewAllLink()}
      </div>
    );
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }

    let title = 'Errors Detected';
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
    items: React.PropTypes.array,
    id: React.PropTypes.number,
    state: React.PropTypes.string
  },

  render: function () {
    return (
      <Link to={`editor/id=w${this.props.id}`} className='aa-tofixtasks__wrapper'>
        <div className='flag'>
          <div className='flag__image'>
            <div className='aa-tofixtasks__map'>{this.props.id}</div>
          </div>
          <div className='flag__body'>
            <h2>Way {this.props.id} {this.props.state === 'pending' ? <small>In review</small> : null}</h2>
            <ul>
              {this.props.items.map((o, i) => <li key={i}>{o.details}</li>)}
            </ul>
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
