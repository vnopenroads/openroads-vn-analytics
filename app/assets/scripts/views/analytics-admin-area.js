'use strict';
import React from 'react';
import { connect } from 'react-redux';

import AATable from '../components/aa-table-vpromms';

import { fetchVProMMSids } from '../actions/action-creators';
import config from '../config';

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
    const completion = total !== 0 ? ((done / total) * 100) : 0;
    let completionMainText;
    let completionTailText = 'Information on VPRoMMS roads is not available';
    if (total !== 0) {
      completionMainText = completion.toFixed(2);
      completionTailText = `% of vPRoMMS IDs added ${done.toLocaleString()} of ${total.toLocaleString()}`;
    }
    return (
      <section className='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            <div className="aa-header">
            <h1>{data.provinceName} Province</h1>
            { completion ? <a className='bttn-s bttn-road-network' href={config.provinceDumpBaseUrl + data.provinceName + '.geojson'}>Download Roads</a> : '' }
            </div>
            <div className='aa-main__status'>
              <h2><strong>{completionMainText}</strong>{completionTailText}</h2>
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
