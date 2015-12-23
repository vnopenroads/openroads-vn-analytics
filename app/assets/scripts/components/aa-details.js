'use strict';
import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import ID from '../utils/id';

var AADetails = React.createClass({
  propTypes: {
    level: React.PropTypes.number,
    adminAreaId: React.PropTypes.number,
    adminAreas: React.PropTypes.array
  },

  // Admin area ID object
  ID: null,

  getDefaultProps: function () {
    return {
      level: 0
    };
  },

  renderIndicator: function () {
    let classes = classNames('indicator', {
      country: this.props.level === 0,
      region: this.props.level === 1,
      province: this.props.level === 2,
      municipality: this.props.level === 3,
      barangay: this.props.level === 4
    });
    return (
      <h2 className={classes}><span className='visually-hidden'>Region's provinces</span></h2>
    );
  },

  renderBreadcrumbs: function () {
    return (
      <ul className='breadcrumbs'>
        <li><Link to='/'>Country</Link></li>
        <li className={classNames({disabled: this.props.level < 1})}><Link to={`/analytics/${this.ID.parentID(1)}`}>Region</Link></li>
        <li className={classNames({disabled: this.props.level < 2})}><Link to={`/analytics/${this.ID.parentID(2)}`}>Province</Link></li>
        <li className={classNames({disabled: this.props.level < 3})}><Link to={`/analytics/${this.ID.parentID(3)}`}>Municipality</Link></li>
        <li className={classNames({disabled: this.props.level < 4})}><Link to={`/analytics/${this.ID.parentID(4)}`}>Barangay</Link></li>
      </ul>
    );
  },

  renderAdminAreaRow: function (o, i) {
    return (
      <tr key={`adminArea${i}`}>
        <td><Link to={`/analytics/${o.id}`}>{o.name}</Link></td>
        <td>
          <ul className='progress-bar'><li style={{width: '20%'}}>&nbsp;</li></ul>
        </td>
        <td>
          <ul className='actions-menu'>
            <li><a href='#' className='bttn-verify'>Verify</a></li>
            <li><a href='#' className='bttn-edit'>Edit</a></li>
          </ul>
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
    return (
      <table className='aa-details__table'>
        <thead>
          <tr>
            <th className='aa-details-title'>{this.ID.getChildDisplayType(true)} <span className='badge'>{this.props.adminAreas.length}</span></th>
            <th className='aa-details-chart'>Completeness</th>
            <th className='aa-details-actions'><span className='visually-hidden'>Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {this.props.adminAreas.map(this.renderAdminAreaRow)}
        </tbody>
      </table>
    );
  },

  render: function () {
    console.log('props', this.props);
    this.ID = new ID(this.props.adminAreaId);

    return (
      <section className='aa-details'>
        <div className='inner'>
          <header className='aa-details__header'>
            <h1 className='hd-s'>{this.ID.getDisplayType()}</h1>
            {this.renderBreadcrumbs()}
          </header>
          <div className='aa-details__body'>
            {this.renderIndicator()}
            {this.renderAdminAreaTable()}
          </div>
        </div>
      </section>
    );
  }
});

module.exports = AADetails;
