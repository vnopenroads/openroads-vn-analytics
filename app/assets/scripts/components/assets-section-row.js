'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class AssetsSectionRow extends React.Component {

  handleMouseOver() {
    const { data, onMouseOver } = this.props;
    onMouseOver(data[0]);
  }

  handleMouseOut() {
    const { data, onMouseOut } = this.props;
    onMouseOut(data[0]);
  }

  render() {
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
};

AssetsSectionRow.propTypes = {
  data: PropTypes.array,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func
};