'use strict';
import React from 'react';
import { connect } from 'react-redux';
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
    const ids = this.props.VProMMSids.data;
    const done = ids.filter(v => v.inTheDatabase).length;
    const total = ids.length;
    const percentageComplete = (done / total).toFixed(2);
    return (
      <section className='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            <h2 className='complete'>{percentageComplete} % of VProMMS Ids added ({done} of {total})</h2>
            <ul>
              {ids.map(v => {
                return <li key={v.id}>{v.id}: {v.inTheDatabase ? 'added' : 'not added'}</li>;
              })}
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
