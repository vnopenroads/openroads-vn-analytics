import React from 'react';
import { Link } from 'react-router';


const ProvinceTableRow = ({
  id, name, route, field, total, language
}) => (
  <tr>
    <td>
      <Link to={`${language}/assets/${route}`}>
        <strong>{name}</strong>
      </Link>
    </td>
    <td>{field}</td>
    <td>{total}</td>
    <td>
      <div className='meter'>
        <div
          className='meter__internal'
          style={ total > 0 ? {width: `${field / total * 100}%`} : {width: 0}}
        />
      </div>
    </td>
  </tr>
);


export default ProvinceTableRow;
