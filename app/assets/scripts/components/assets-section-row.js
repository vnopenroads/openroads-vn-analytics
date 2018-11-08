'use strict';

import React from 'react';

const AssetsSectionRow = React.createClass({
  'displayName': 'AssetsSectionRow',

  propTypes: {
    data: React.PropTypes.array,
    onMouseOver: React.PropTypes.func,
    onMouseOut: React.PropTypes.func
  },

  handleMouseOver: function () {
    const { data, onMouseOver } = this.props;
    onMouseOver(data[0]);
  },

  handleMouseOut: function () {
    const { data, onMouseOut } = this.props;
    onMouseOut(data[0]);
  },

  render: function () {
    const { data } = this.props;
    return (
      <tr onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        {data.map((val, i) => {
          return (
            <td key={i}>{val}</td>
          );
        })}
      </tr>
    );
  }
});

module.exports = AssetsSectionRow;
