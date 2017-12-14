import React from 'react';
import {
  map
} from 'lodash';


const RowProperties = ({ properties }) => (
  <div
    className="table-properties"
  >
    <dl className='table-properties-list'>
      {
        map(properties, (prop, key) => (
          <div
            key={key}
          >
            <dt>{key}</dt>
            <dd>{prop}</dd>
          </div>
        ))
      }
    </dl>
  </div>
);


export default RowProperties;
