import React from 'react';
import {
  forEach
} from 'lodash';
import T from './t';


const RowPropertiesList = ({
  vpromm, adminRoadProperties, shouldShowProperties, toggleProperties
}) => {
  // TODO - properly render props dropdown
  const roadPropDropDown = [];
  const adminProp = adminRoadProperties.find((prop) => prop.id === vpromm);

  if (adminProp) {
    forEach(adminProp.properties, (prop, key, j) => {
      roadPropDropDown.push(<dt key={`${vpromm}-${key}-${j}-key`}>{key}</dt>);
      roadPropDropDown.push(<dd key={`${vpromm}-${key}-${j}-prop`}>{prop}</dd>);
    });
  }

  return adminRoadProperties.length !== 0 ?
    <td className='table-properties-cell'>
      <button
        type='button'
        className={`button-table-expand ${shouldShowProperties ? 'button-table-expand--show' : 'button-table-expand--hide'}`}
        onClick={toggleProperties}
      >
        <span>{shouldShowProperties ? <T>Hide</T> : <T>Show</T>}</span>
      </button>
      {
        shouldShowProperties &&
          <div
            className="table-properties"
          >
            <dl className='table-properties-list'>{roadPropDropDown}</dl>
          </div>
      }
    </td> :
    <td/>;
};


export default RowPropertiesList;
