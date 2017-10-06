'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchVProMMsids, fetchFieldVProMMsIds, setCrossWalk } from '../actions/action-creators';

var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    _fetchVProMMsids: React.PropTypes.func,
    _fetchFieldVProMMsids: React.PropTypes.func,
    _setCrossWalk: React.PropTypes.func,
    fieldVProMMSids: React.PropTypes.array,
    children: React.PropTypes.object,
    crosswalk: React.PropTypes.object,
    params: React.PropTypes.object,
    VProMMSids: React.PropTypes.object
  },

  componentWillMount: function () {
    this.props._fetchVProMMsids();
    this.props._fetchFieldVProMMsids();
    this.props._setCrossWalk();
  },

  render: function () {
    return (
      <section classNmae='page'>
        <div className='page__body aa'>
          <div className='aa-main'>
            {React.cloneElement(this.props.children, {crosswalk: this.props.crosswalk, VProMMSids: this.props.VProMMSids, fieldIds: this.props.fieldVProMMSids})}
          </div>
        </div>
      </section>
    );
  }
});

function selector (state) {
  return {
    VProMMSids: state.VProMMSidsAnalytics,
    fieldVProMMSids: state.fieldVProMMSids.ids,
    crosswalk: state.crosswalk
  };
}

function dispatcher (dispatch) {
  return {
    _setCrossWalk: () => dispatch(setCrossWalk()),
    _fetchVProMMsids: () => dispatch(fetchVProMMsids()),
    _fetchFieldVProMMsids: () => dispatch(fetchFieldVProMMsIds())
  };
}

module.exports = connect(selector, dispatcher)(Analytics);
