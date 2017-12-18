import React from 'react';
import {
  map,
  round
} from 'lodash';
import T from './t';

const RowProperties = ({ properties }) => (
  <div
    className="table-properties"
  >
    <dl className='table-properties-list'>
      <LengthChart
        platformLength={properties['length']}
        tabularLength={properties['Road Length (VProMMS)']}
      />
      {
        map(properties, (prop, key) =>
          // Since we have the above chart, no need to include length values
          key.startsWith('Road Length') || key === 'length'
            ? ''
            : (
              <div
                key={key}
              >
                <dt>{key}</dt>
                <dd>{prop}</dd>
              </div>
            )
        )
      }
    </dl>
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
