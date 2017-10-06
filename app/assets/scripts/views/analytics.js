'use strict';
import React from 'react';
import { connect } from 'react-redux';
var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    children: React.PropTypes.object,
    history: React.PropTypes.object,
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

module.exports = connect(selector)(Analytics);
