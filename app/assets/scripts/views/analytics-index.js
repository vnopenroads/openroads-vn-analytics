'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import AATable from '../components/aa-table-index';

import { fetchVProMMSids } from '../actions/action-creators';

var AnalyticsIndex = React.createClass({
  displayName: 'AnalyticsIndex',

  propTypes: {
    children: React.PropTypes.object,
    _fetchVProMMSids: React.PropTypes.func,
    VProMMSids: React.PropTypes.object,
    params: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchVProMMSids();
  },

  render: function () {
    let accumulator = { done: 0, total: 0 };
    const provinceData = _.map(this.props.VProMMSids.data, (data, id) => {
      const name = data.provinceName;
      const done = data.vpromms.filter(v => v.inTheDatabase).length;
      const total = data.vpromms.length;
      accumulator.done += done;
      accumulator.total += total;
      const percentageComplete = (done / total).toFixed(2);
      return {
        id,
        name,
        done,
        total,
        percentageComplete
      };
    });
    const { done, total } = accumulator;
    const completion = (accumulator.done / accumulator.total) * 100;
    return (
      <section className='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            <h1>VProMMS Edits By Region</h1>
            <div className='aa-main__status'>
              <h2><strong>{completion.toFixed(2)}%</strong> of VProMMS Ids added ({done.toLocaleString()} of {total.toLocaleString()})</h2>
              <div className='meter'>
                <div className='meter__internal' style={{width: `${completion}%`}}></div>
              </div>
            </div>
            <AATable data={provinceData} />
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

module.exports = connect(selector, dispatcher)(AnalyticsIndex);
