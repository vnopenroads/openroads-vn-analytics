'use strict';
import React from 'react';
import { connect } from 'react-redux';

import AATable from '../components/aa-table-vpromms';

import { fetchVProMMSids } from '../actions/action-creators';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

  propTypes: {
    children: React.PropTypes.object,
    routeParams: React.PropTypes.object,
    _fetchVProMMSids: React.PropTypes.func,
    VProMMSids: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchVProMMSids();
  },

  render: function () {
    const provinceId = this.props.routeParams.aaId;
    const data = this.props.VProMMSids.data[provinceId];
    const ids = data.vpromms;
    const done = ids.filter(v => v.inTheDatabase).length;
    const total = ids.length;
    const completion = ((done / total) * 100);
    const bucket = 'https://s3.amazonaws.com/openroads-vn-dumps/by-province-name/';
    const file = data.provinceName.match(/ /g) ? data.provinceName.replace(' ', '+') : data.provinceName;
    return (
      <section className='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            <div className="aa-header">
            <h1>{data.provinceName} Province</h1>
            { completion ? <a className='bttn-s bttn-road-network' href={bucket + file + '.geojson'}>Download Roads</a> : '' }
            </div>
            <div className='aa-main__status'>
              <h2><strong>{!total ? '100' : completion.toFixed(2)}%</strong> of VProMMS IDs added ({done.toLocaleString()} of {total.toLocaleString()})</h2>
              <div className='meter'>
                <div className='meter__internal' style={{width: `${completion}%`}}></div>
              </div>
            </div>
            {total ? <AATable data={ids} /> : ''}
          </div>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    VProMMSids: state.VProMMSids
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMSids: (aaid) => dispatch(fetchVProMMSids())
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);
