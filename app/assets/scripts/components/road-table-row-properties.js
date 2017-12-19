import React from 'react';
import {
  map,
  round
} from 'lodash';
import T from './t';
import RoadRowProperty from '../containers/road-row-property-container';


const RowProperties = ({ roadId, properties }) => (
  <div
    className="table-properties"
  >
    <LengthChart
      platformLength={properties['length']}
      tabularLength={properties['Road Length (VProMMS)']}
    />

    <table className='table-properties-list'>
      <tbody>
        {
          map(properties, (prop, key) => (
            key !== 'Road Length (VProMMS)' && key !== 'length' &&
              <RoadRowProperty
                key={key}
                roadId={roadId}
                propertyKey={key}
                propertyValue={prop}
              />
          ))
        }
      </tbody>
    </table>
  </div>
);


const LengthChart = ({platformLength, tabularLength}) => (
  (typeof platformLength === 'undefined' || typeof tabularLength === 'undefined')
    ? <div />
    : <div className='table-properties-chart'>
      <dt><T>Length (ORMA)</T></dt>
      <dd>
        <div style={{
          width: `${platformLength / (Math.max(platformLength, tabularLength)) * 100 * 0.5}%`
        }} />
        <span>{`${round(platformLength, 1)} km`}</span>
      </dd>
      <dt><T>Length (Tabular)</T></dt>
      <dd>
        <div style={{
          width: `${tabularLength / (Math.max(platformLength, tabularLength)) * 100 * 0.5}%`
        }} />
        <span>{`${round(tabularLength, 1)} km`}</span>
      </dd>
    </div>
);

export default RowProperties;
