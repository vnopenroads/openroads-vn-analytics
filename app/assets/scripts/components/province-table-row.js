import React from 'react';
import { Link } from 'react-router';


const ProvinceTableRow = ({
  id, name, routeId, osmCount, count, percentageComplete, language
}) => (
  <tr>
    <td>
      <Link to={`${language}/assets/${routeId}`}>
        <strong>{name}</strong>
      </Link>
    </td>
    <td>{osmCount}</td>
    <td>{count}</td>
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
