import React from 'react';
import { Link } from 'react-router';


const ProvinceTableRow = ({
  id, name, routeId, field, total, percentageComplete, language
}) => (
  <tr>
    <td>
      <Link to={`${language}/assets/${routeId}`}>
        <strong>{name}</strong>
      </Link>
    </td>
    <td>{field}</td>
    <td>{total}</td>
    <td>
      <div className='meter'>
        <div
          className='meter__internal'
          style={{width: `${percentageComplete}%`}}
        />
      </div>
    </td>
  </tr>
);


export default ProvinceTableRow;
