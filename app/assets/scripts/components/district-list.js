import React from 'react';
import { Link } from 'react-router';
import T from './t';
import {
  ADMIN_MAP
} from '../constants';


const DistrictList = ({ districts, aaId, language }) => (
  <nav className='a-subnav'>
    <h2><T>Districts</T></h2>
    <ul className='a-children'>
      {districts
        .filter(({ id }) => ADMIN_MAP.district[id] !== undefined)
        .map((child, i) => (
          <li
            key={child.id}
          >
            <Link
              className={ADMIN_MAP.district[child.id] === '' ? 'disabled' : ''}
              to={`/${language}/assets/${aaId}/${child.id}`}
            >
              {child.name_en}
            </Link>
          </li>
        ))
      }
    </ul>
  </nav>
);


export default DistrictList;
