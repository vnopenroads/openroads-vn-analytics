import React from 'react';
import {
  map,
  round
} from 'lodash';
import T from './t';
import CreateRoadPropertyForm from '../containers/create-road-property-form-container';
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

    <CreateRoadPropertyForm
      roadId={roadId}
    />
  </div>
);


const LengthChart = ({platformLength, tabularLength}) => (
  typeof platformLength !== 'undefined' && typeof tabularLength !== 'undefined' ?
    <div className='table-properties-chart'>
      <dt><T>Length (ORMA)</T></dt>
      <dd>
        <span
          className="bar"
          style={{
            width: `${platformLength / (Math.max(platformLength, tabularLength)) * 100 * 0.5}%`
          }}
        />
        <span
          className="value"
        >
          {round(platformLength, 1)} <em>km</em>
        </span>
      </dd>
      <dt><T>Length (Tabular)</T></dt>
      <dd>
        <span
          className="bar"
          style={{
            width: `${tabularLength / (Math.max(platformLength, tabularLength)) * 100 * 0.5}%`
          }}
        />
        <span
          className="value"
        >
          {round(tabularLength, 1)} <em>km</em>
        </span>
      </dd>
    </div> :
    <div/>
);

export default RowProperties;
