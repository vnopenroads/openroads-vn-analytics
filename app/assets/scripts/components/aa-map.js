'use strict';
import React from 'react';

var AAMap = React.createClass({
  displayName: 'AAMap',

  propTypes: {
  },

  render: function () {
    return (
      <div className='aa-map-wrapper'>
        <div className='aa-map'>Map will render here</div>
      </div>
    );
  }
});

module.exports = AAMap;
