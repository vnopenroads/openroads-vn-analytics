'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchVProMMSids } from '../actions/action-creators';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

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
    const provinceData = this.props.VProMMSids.data;
    let accumulator = { done: 0, total: 0 };
    const ids = _.map(provinceData, (data, id) => {
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
    return (
      <section className='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            <h2 className='complete'>{(accumulator.done / accumulator.total).toFixed(2)} % of VProMMS Ids added ({done.toLocaleString()} of {total.toLocaleString()})</h2>
            <ul>
              {/* {ids.map(v => {
                return <li key={v.id}>{v.id}: {v.inTheDatabase ? 'added' : 'not added'}</li>;
              })} */}
            </ul>
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
