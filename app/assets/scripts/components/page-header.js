'use strict';
import React from 'react';
import { Link } from 'react-router';
import ID from '../utils/id';
import Dropdown from '../components/dropdown';
import config from '../config';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
    pageTitle: React.PropTypes.string,
    adminAreaId: React.PropTypes.number,
    roadNetworkStatus: React.PropTypes.object,
    bbox: React.PropTypes.array
  },

  renderDownloaRoadNetwork: function () {
    let {fetched, fetching, data, error} = this.props.roadNetworkStatus;

    if (!fetched || fetching) {
      return <li><Link to='/' className='bttn-road-network disabled'>Checking download</Link></li>;
    }

    return data.dataAvailable ? (
      <li><a href={`${config.api}/admin/${this.props.adminAreaId}?roadNetwork=true`} className='bttn-road-network' title='Download road network' target='_blank'>Download road network</a></li>
    ) : (
      <Dropdown element='li' className='dropdown center' triggerClassName='bttn-road-network disabled' triggerText='Download road network' evtClick={false}>
        <div className='drop-info'>
          {error ? (
            <p>There was an error with the server. Please contact an administrator.</p>
          ) : (
            <p>It's not possible to download the road network for such a large area.</p>
          )}
        </div>
      </Dropdown>
    );
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
              {this.renderDownloaRoadNetwork()}
            </ul>
          </div>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
