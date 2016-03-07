'use strict';
import React from 'react';
import { Link } from 'react-router';
import ID from '../utils/id';

var AAList = React.createClass({
  displayName: 'AAList',

  propTypes: {
    adminAreaId: React.PropTypes.number,
    adminAreas: React.PropTypes.array,
    sliceList: React.PropTypes.bool
  },

  sliceSize: 10,

  // Admin area ID object
  ID: null,

  renderAdminAreaRow: function (o, i) {
    return (
      <tr key={`adminArea${i}`}>
        <td><Link to={`/analytics/${o.id}`}>{o.name}</Link></td>
        <td>
          <ul className='progress-bar'><li style={{width: '20%'}}>&nbsp;</li></ul>
        </td>
      </tr>
    );
  },

  renderAdminAreaTable: function () {
    if (!this.props.adminAreas.length) {
      return (
        <p>No more areas to show</p>
      );
    }

    let adminAreas;
    if (this.props.sliceList) {
      adminAreas = this.props.adminAreas.slice(0, this.sliceSize);
    } else {
      adminAreas = this.props.adminAreas;
    }

    return (
      <table className='aa-list__table'>
        <thead>
          <tr>
            <th className='aa-list-title'>{this.ID.getChildDisplayType(true)} <span className='badge'>{this.props.adminAreas.length}</span></th>
            <th className='aa-list-chart'>Completeness</th>
          </tr>
        </thead>
        <tbody>
          {adminAreas.map(this.renderAdminAreaRow)}
        </tbody>
      </table>
    );
  },

  renderViewAll: function () {
    if (!this.props.sliceList || this.props.adminAreas.length <= this.sliceSize) {
      return null;
    }

    return this.props.adminAreaId
      ? <Link to={`/analytics/${this.props.adminAreaId}/admin-areas`}>View all</Link>
      : <Link to='/admin-areas'>View all</Link>;
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
