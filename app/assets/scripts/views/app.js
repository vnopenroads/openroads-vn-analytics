'use strict';
import React from 'react';
import Reflux from 'reflux';

var App = React.createClass({
  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div> App
      </div>
    );
  }
});

module.exports = App;
