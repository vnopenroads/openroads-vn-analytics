import React from 'react';
import {
  getContext
} from 'recompose';
import lineColors from '../utils/line-colors';
import T from './t';


const renderTitle = (layer) => {
  if (layer === 'iri_mean') {
    return <T>IRI</T>;
  } else if (layer === 'or_width') {
    return <T>Width</T>;
  } else if (layer === 'or_condition') {
    return <T>Condition</T>;
  } else if (layer === 'or_surface') {
    return <T>Surface</T>;
  } else if (layer === 'or_section_delivery_vehicle') {
    return <T>Vehicle Count</T>;
  }
};

const MapLegend = ({ layer }) => {
  const colors = lineColors[layer];
  const continuous = (colors.type !== 'categorical');
  const stops = colors.stops;

  let bestColorLabel;
  let worstColorLabel;

  if (continuous) {
    bestColorLabel = stops[0][0];
    worstColorLabel = stops[stops.length - 1][0];
  }

  return (
    <div className='map__controls map__controls--bottom-right'>
      <figcaption className='panel legend-panel'>
        <div className='panel__body'>
          <h3 className='map-legend-title'>{renderTitle(layer)}</h3>
          <div>
            <div className='map-legend-scale-container'>
              <div className='map-legend-scale' />
              <span className='map-legend-scale-label'>{ bestColorLabel }</span>
              <span className='map-legend-scale-label'>{ worstColorLabel }</span>
            </div>
            <div className='map-legend-nodata-container'>
              <div className='map-legend-nodata' />
              <span className='map-legend-nodata-label'><T>No data</T></span>
            </div>
          </div>
        </div>
      </figcaption>
    </div>
  );
};


MapLegend.propTypes = {
  layer: React.PropTypes.string,
  language: React.PropTypes.string
};


export default getContext({ language: React.PropTypes.string })(MapLegend);
