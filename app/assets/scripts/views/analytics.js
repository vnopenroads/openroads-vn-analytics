'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchVProMMsids, setCrossWalk } from '../actions/action-creators';

var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    _setCrossWalk: React.PropTypes.func,
    children: React.PropTypes.object,
    crosswalk: React.PropTypes.object,
    params: React.PropTypes.object
  },

  componentWillMount: function () {
    this.props._setCrossWalk();
  },

  render: function () {
    return (
      <section classNmae='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            {React.cloneElement(this.props.children, {crosswalk: this.props.crosswalk})}
          </div>
        </div>
      </section>
    );
  }
});

function selector (state) {
  return {
    VProMMSids: state.VProMMSidsAnalytics,
    crosswalk: state.crosswalk
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsids: (use) => dispatch(fetchVProMMsids(use)),
    _setCrossWalk: () => dispatch(setCrossWalk())
  };
}

module.exports = connect(selector, dispatcher)(Analytics);
