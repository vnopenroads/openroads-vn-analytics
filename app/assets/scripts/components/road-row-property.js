import React from 'react';


const RowProperty = ({ propertyKey, propertyValue }) => (
  <tr
    className="table-properties-row"
  >
    <td
      className="property-key"
    >
      {propertyKey}
    </td>
    <td
      className="property-value"
    >
      {propertyValue}
    </td>
  </tr>
);


export default RowProperty;
