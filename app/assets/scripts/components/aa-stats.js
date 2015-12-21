'use strict';
import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

var AAStats = React.createClass({
  propTypes: {
    level: React.PropTypes.number,
    activeStat: React.PropTypes.string,
    chandeTabFn: React.PropTypes.func
  },

  getNav: function () {
    switch (this.props.level) {
      case 0:
        return [
          {key: 'responsibility', display: 'Responsibility'},
          {key: 'condition', display: 'Condition'},
          {key: 'completeness', display: 'Completeness'},
          {key: 'projects', display: 'Projects'},
          {key: 'errors', display: 'Errors'}
        ];
      case 1:
        return [
          {key: 'responsibility', display: 'Responsibility'},
          {key: 'condition', display: 'Condition'},
          {key: 'completeness', display: 'Completeness'}
        ];
      default:
        return [];
    }
  },

  getNextNavItem: function () {
    let items = this.getNav();
    let i = _.findIndex(items, 'key', this.props.activeStat);
    return ++i >= items.length ? items[0] : items[i];
  },

  getPrevNavItem: function () {
    let items = this.getNav();
    let i = _.findIndex(items, 'key', this.props.activeStat);
    return --i >= 0 ? items[i] : items[items.length - 1];
  },

  renderNav: function () {
    return this.getNav().map((o, i) => {
      return (
        <li key={`aa-stats-nav-${i}`} className={classNames({active: this.props.activeStat === o.key})}><a href='#' onClick={this.navClickHandler.bind(this, o)}>{o.display}</a></li>
      );
    });
  },

  navClickHandler: function (o, e) {
    e.preventDefault();
    this.changeTab(o);
  },

  changeTab: function (item) {
    this.props.chandeTabFn(item.key);
  },

  renderContent: function () {
    switch (this.props.activeStat) {
      case 'responsibility':
        return (
          <div className='chart-wrapper'>responsibility</div>
        );
      case 'condition':
        return (
          <div className='chart-wrapper'>condition</div>
        );
      case 'completeness':
        return (
          <div className='chart-wrapper'>completeness</div>
        );
      case 'projects':
        return (
          <div className='chart-wrapper'>projects</div>
        );
      case 'errors':
        return (
          <div className='chart-wrapper'>errors</div>
        );
    }
  },

  render: function () {
    return (
      <div className='aa-stats'>
        <nav className='aa-stats__nav'>
          <ul>
            {this.renderNav()}
          </ul>
        </nav>

        {this.renderContent()}

        <div className='aa-stats__controls'>
          <button className='bttn-stats-prev' onClick={() => this.changeTab(this.getPrevNavItem())}><span>Previous stat</span></button>
          <button className='bttn-stats-next' onClick={() => this.changeTab(this.getNextNavItem())}><span>Next stat</span></button>
        </div>
      </div>
    );
  }
});

module.exports = AAStats;
