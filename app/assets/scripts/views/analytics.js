'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchVProMMSids } from '../actions/action-creators';

var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object
  },
  render: function () {
    return (
      <section classNmae='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            {this.props.children}
          </div>
        </div>
      </section>
    );
  }
});

function selector (state) {
  return {
    VProMMSids: state.VProMMSidsAnalytics
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMSids: (use) => dispatch(fetchVProMMSids(use))
  };
}

module.exports = connect(selector, dispatcher)(Analytics);
