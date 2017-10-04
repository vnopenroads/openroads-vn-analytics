'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchVProMMsids } from '../actions/action-creators';

var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    VProMMSids: React.PropTypes.object,
    _fetchVProMMsids: React.PropTypes.func
  },

  render: function () {
    return (
      <section classNmae='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            { React.cloneElement(this.props.children, { VProMMSids: this.props.VProMMSids }) }
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
    _fetchVProMMsids: (use) => dispatch(fetchVProMMsids(use))
  };
}

module.exports = connect(selector, dispatcher)(Analytics);
