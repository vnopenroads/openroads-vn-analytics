'use strict';
import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import ID from '../utils/id';

var AAList = React.createClass({
  displayName: 'AAList',

  propTypes: {
    adminAreaId: React.PropTypes.number,
    adminAreaName: React.PropTypes.string,
    adminAreas: React.PropTypes.array,
    sliceList: React.PropTypes.bool
  },

  sliceSize: 10,

  // TODO: Define thresholds.
  thresholds: [30, 70],

  // Admin area ID object
  ID: null,

  renderAdminAreaRow: function (o, i) {
    // TODO: Remove randoms.
    let val = Math.floor(Math.random() * 101);
    let colorCoding = {
      'progress-bar--low': val < this.thresholds[0],
      'progress-bar--med': val >= this.thresholds[0] && val <= this.thresholds[1],
      'progress-bar--high': val > this.thresholds[1]
    };

    return (
      <tr key={`adminArea${i}`}>
        <td colSpan='2'><Link to={`/analytics/${o.id}`}>{o.name}</Link>
          <ul className={classnames('progress-bar progress-bar--inline', colorCoding)}><li style={{width: `${val}%`}}><span className='value'>{val}%</span></li></ul>
        </td>
      </tr>
    );
  },

  renderAdminAreaTable: function () {
    if (!this.props.adminAreas.length) {
      return null;
    }

    let adminAreas;
    if (this.props.sliceList) {
      adminAreas = this.props.adminAreas.slice(0, this.sliceSize);
    } else {
      adminAreas = this.props.adminAreas;
    }

    return (
      <div>
        <h2 className='hd-s'>{this.ID.getChildDisplayType(true)} of {this.props.adminAreaName || 'Philippines'}</h2>
        <table className='aa-list__table'>
          <thead>
            <tr>
              <th className='aa-list-title'>{this.ID.getChildDisplayType()} <span className='badge'>{this.props.adminAreas.length}</span></th>
              <th className='aa-list-chart'>Completeness</th>
            </tr>
          </thead>
          <tbody>
            {adminAreas.map(this.renderAdminAreaRow)}
          </tbody>
        </table>
      </div>
    );
  },

  renderViewAll: function () {
    if (!this.props.sliceList || this.props.adminAreas.length <= this.sliceSize) {
      return null;
    }

    return this.props.adminAreaId
      ? <Link to={`/analytics/${this.props.adminAreaId}/admin-areas`} className='bttn-view-more'>View all {this.ID.getChildDisplayType(true)}</Link>
      : <Link to='/admin-areas' className='bttn-view-more'>View all {this.ID.getChildDisplayType(true)}</Link>;
  },

  render: function () {
    this.ID = new ID(this.props.adminAreaId);

    return (
      <div className='aa-list'>
        {this.renderAdminAreaTable()}
        {this.renderViewAll()}
      </div>
    );
  }
});

module.exports = AAList;
