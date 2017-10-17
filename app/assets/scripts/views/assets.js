'use strict';
import React from 'react';

var Assets = React.createClass({
  displayName: 'Assets',

  propTypes: {
    _setCrossWalk: React.PropTypes.func,
    fieldVProMMsids: React.PropTypes.array,
    children: React.PropTypes.object,
    crosswalk: React.PropTypes.object,
    params: React.PropTypes.object,
    VProMMSids: React.PropTypes.object
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

module.exports = Assets;
