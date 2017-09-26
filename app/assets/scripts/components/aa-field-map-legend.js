import React from 'react';
import lineColors from '../utils/line-colors';

const AAFieldMapLegend = React.createClass({
  displayName: 'AAFieldMapLegend',

  propTypes: {
    layers: React.PropTypes.array
  },

  renderLegendElements: function () {
    return this.props.layers.map((source, i) => {
      return (
        <li key={i}>
          <div>
            <span className='aa-map-legend-label'>{source}</span>
            <svg width="100" height="15">
              <path d="M 25 11 H 65" stroke={lineColors[source].stops[1]} strokeWidth='6' strokeLinecap='round' />
            </svg>
          </div>
        </li>
      );
    });
  },

  render: function () {
    return (
      <div className='aa-map-legend'>
        <h3 className='aa-map-legend-title'>Field Data Sources</h3>
        <ul>
          {this.renderLegendElements()}
        </ul>
      </div>
    );
  }
});

module.exports = AAFieldMapLegend;
