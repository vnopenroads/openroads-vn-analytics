'use strict';
import React from 'react';
import _ from 'lodash';

var Home = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    networkData: React.PropTypes.object
  },

  render: function () {
    return (
      <div>
        This is HOME
      </div>
    );
  }
});

module.exports = Home;
