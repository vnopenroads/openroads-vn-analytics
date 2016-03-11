'use strict';
import React from 'react';

var UhOh = React.createClass({
  displayName: 'UhOh',

  render: function () {
    return (
      <div>
        <h2>404 Not found</h2>
        <p>UhOh that is a bummer.</p>
      </div>
    );
  }
});

module.exports = UhOh;
