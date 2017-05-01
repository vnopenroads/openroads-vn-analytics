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
    return (
      <section className='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            <ul>
              {this.props.VProMMSids.data.map(v => {
                return <li key={v.id}>{v.id}</li>;
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
