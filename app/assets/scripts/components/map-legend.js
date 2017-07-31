import React from 'react';
import lineColors from '../utils/line-colors';

const MapLegend = React.createClass({
  displayName: 'MapLegend',

  propTypes: {
    layer: React.PropTypes.string
  },

  render: function () {
    const title = {
      'iri': 'IRI',
      'or_width': 'Width',
      'or_condition': 'Condition',
      'or_surface': 'Surface'
    }[this.props.layer];

    const colors = lineColors[this.props.layer];
    const continuous = (colors.type !== 'categorical');
    const stops = colors.stops;

    let bestColorLabel;
    let worstColorLabel;

    if (continuous) {
      bestColorLabel = stops[0][0];
      worstColorLabel = stops[stops.length - 1][0];
    }

    return (
      <div className='map-legend'>
        <p className='map-legend-title'>{ title }</p>
        { continuous
          ? <div>
            <div className='map-legend-scale'></div>
            <p className='map-legend-label'>{ bestColorLabel }</p>
            <p className='map-legend-label'>{ worstColorLabel }</p>
          </div>
          : <div>
            {stops.map(s =>
              <div id={s[0]}>
                <p>{ String(s[0]) }</p>
                <div style={{ 'background-color': s[1], width: '20px', height: '20px' }}></div>
              </div>
            )}
          </div>
        }
      </div>
    );
  }
});

module.exports = MapLegend;
