'use strict';
import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import ID from '../utils/id';

var AAList = React.createClass({
  displayName: 'AAList',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
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
    let val = '-';
    let colorCoding = null;
    if (!isNaN(o.completeness)) {
      val = Math.round(o.completeness * 1000) / 10;
      colorCoding = {
        'progress-bar--low': val < this.thresholds[0],
        'progress-bar--med': val >= this.thresholds[0] && val <= this.thresholds[1],
        'progress-bar--high': val > this.thresholds[1]
      };
      val = val + '%';
    }

    return (
      <tr key={`adminArea${i}`}>
        <td colSpan='2'><Link to={`/analytics/${o.id}`}>{o.name}</Link>
          <ul className={classnames('progress-bar progress-bar--inline', colorCoding)}><li style={{width: `${val}`}}><span className='value'>{val}</span></li></ul>
        </td>
      </tr>
    );
  },

  renderAdminAreaTable: function () {
    if (!this.props.adminAreas.length) {
      if (this.ID.identify() === this.ID.BARANGAY) {
        return (
          <div>
            <h2 className='hd-s'>Administrative Areas</h2>
            <p className='aa-list__empty'><strong>{this.props.adminAreaName}</strong> is a barangay and there are no lower administrative areas to show</p>
          </div>
        );
      }
      return <p>No data available</p>;
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
      : <Link to='/analytics/admin-areas' className='bttn-view-more'>View all {this.ID.getChildDisplayType(true)}</Link>;
  },

  renderLoadingPlaceholder: function () {
    return (
      <div className='aa-list placeholder'>
        <h2 className='hd-s'>&nbsp;</h2>
        <table className='aa-list__table'>
          <thead>
            <tr>
              <th className='aa-list-title'><span>&nbsp;</span></th>
              <th className='aa-list-chart'><span>&nbsp;</span></th>
            </tr>
          </thead>
          <tbody>
            {[0, 0, 0].map((o, i) => {
              return (<tr key={i}>
                <td colSpan='2'>
                  <p>&nbsp;</p>
                  <ul className='progress-bar progress-bar--inline'>
                    <li><span className='value'>&nbsp;</span></li>
                  </ul>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    );
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }

    if (this.props.fetching) {
      return this.renderLoadingPlaceholder();
    }

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
