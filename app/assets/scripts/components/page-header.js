'use strict';
import React from 'react';
import { Link } from 'react-router';
import ID from '../utils/id';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
    pageTitle: React.PropTypes.string,
    adminAreaId: React.PropTypes.number,
    bbox: React.PropTypes.array
  },

  render: function () {
    let adminID = new ID(this.props.adminAreaId);
    let level = adminID.level();
    return (
      <header className='page__header'>
        <div className='inner'>
          <div className='page__breadcrumbs'>
            <ul className='breadcrumbs'>
              <li><Link to='/analytics'>Country</Link></li>
              {level >= 1 ? <li><Link to={`/analytics/${adminID.parentID(1)}`}>Region</Link></li> : null}
              {level >= 2 ? <li><Link to={`/analytics/${adminID.parentID(2)}`}>Province</Link></li> : null}
              {level >= 3 ? <li><Link to={`/analytics/${adminID.parentID(3)}`}>Municipality</Link></li> : null}
              {level >= 4 ? <li><Link to={`/analytics/${adminID.parentID(4)}`}>Barangay</Link></li> : null}
            </ul>
          </div>

          <div className='page__headline'>
            <h1 className='page__title'>{this.props.pageTitle}</h1>
          </div>
          <div className='page__actions'>
            <ul className='actions-menu'>
              <li><Link to={`/editor/bbox=${this.props.bbox.join('/')}`} className='bttn-edit'>Improve map</Link></li>
            </ul>
          </div>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
