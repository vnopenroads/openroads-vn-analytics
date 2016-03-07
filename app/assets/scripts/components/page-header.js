'use strict';
import React from 'react';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
    // Actions will probably change to a list...
    actions: React.PropTypes.bool,
    pageTitle: React.PropTypes.string
  },

  renderActions: function () {
    if (this.props.actions) {
      return (
        <div className='page__actions'>
          <ul className='actions-menu'>
            <li><a href='#' className='bttn-edit'>Edit</a></li>
          </ul>
        </div>
      );
    }
  },

  render: function () {
    return (
      <header className='page__header'>
        <div className='inner'>
          <div className='page__headline'>
            <h1 className='page__title'>{this.props.pageTitle}</h1>
          </div>
          {this.renderActions()}
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
