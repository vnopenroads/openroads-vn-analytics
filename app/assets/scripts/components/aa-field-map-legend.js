import React from 'react';
import PropTypes from 'prop-types';
import lineColors from '../utils/line-colors';
import T from './t';

export default class AAFieldMapLegend extends React.Component {

  renderLegendElements() {
    // for each source as the source name
    // as well as a small svg path with the color
    // matching source in the lineColors config
    return this.props.sources.map((source, i) => {
      return (
        <li key={source}>
          <div>
            <span className='aa-map-legend-label'>{source}</span>
            <svg width="100" height="15">
              <path d="M 25 11 H 65" stroke={lineColors[source].stops[1]} strokeWidth='6' strokeLinecap='round' />
            </svg>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div className='aa-map-legend'>
        <h3 className='aa-map-legend-title'><T>Field Data Sources</T></h3>
        <ul>
          {/* {this.renderLegendElements()} */}
        </ul>
      </div>
    );
  }
};

AAFieldMapLegend.propTypes = {
  sources: PropTypes.array
};