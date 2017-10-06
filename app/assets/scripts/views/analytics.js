'use strict';
import React from 'react';
import { connect } from 'react-redux';
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

module.exports = connect(selector)(Analytics);
