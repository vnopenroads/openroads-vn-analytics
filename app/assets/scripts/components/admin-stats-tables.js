'use strict';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import c from 'classnames';

import T, {translate} from '../components/t';

import { environment } from '../config';

export const statsColumns = [
  {
    key: 'totalRoads',
    label: 'Total'
  },
  {
    key: 'osmRoads',
    label: 'Field'
  },
  {
    key: 'pending',
    label: 'Pending'
  },
  {
    key: 'done',
    label: 'Done'
  }
];

export const StatsTableHeader = ({type}) => (
  <thead>
    <tr>
      {type === 'province' && <th><T>Provinces</T></th>}
      {type === 'province-district' && <th><T>Province</T></th>}
      {type === 'province' && <th><T>Districts</T></th>}
      {(type === 'province-district' || type === 'district') && <th><T>District</T></th>}
      {statsColumns.map(({key, label}) => <th key={key}><T>{label}</T></th>)}
    </tr>
  </thead>
);

if (environment !== 'production') {
  StatsTableHeader.propTypes = {
    type: PropTypes.string
  };
}

const getPrintValue = (v) => (v === 0 || v) && v !== ' ' ? v : 'n/a';

export const StatsTableRow = ({type, data, lang, provinceId, provinceName, districtId, districtName}) => (
  <tr>
    {type === 'province-district' && <td><Link to={`/${lang}/assets/${provinceId}`} title={translate(lang, 'View province page')}>{provinceName}</Link></td>}
    <td><Link to={`/${lang}/assets/${provinceId}/${districtId}`} title={translate(lang, 'View district page')}>{districtName}</Link></td>
    {statsColumns.map(({key}) => <th key={key}>{getPrintValue(data[key])}</th>)}
  </tr>
);

if (environment !== 'production') {
  StatsTableRow.propTypes = {
    type: PropTypes.string,
    data: PropTypes.object,
    lang: PropTypes.string,
    provinceId: PropTypes.number,
    provinceName: PropTypes.string,
    districtId: PropTypes.number,
    districtName: PropTypes.string
  };
}

export const StatsTableExpandableTbody = ({lang, provinceId, provName, disctrictCount, isExpanded, onExpandToggle, data, children}) => (
  <tbody>
    <tr>
      <td><Link to={`/${lang}/assets/${provinceId}`} title={translate(lang, 'View province page')}>{provName}</Link></td>
      <td><a href='#' title={translate(lang, 'Expand districts')} onClick={onExpandToggle}>{disctrictCount}</a></td>
      {statsColumns.map(({key}) => <th key={key}>{getPrintValue(data[key])}</th>)}
    </tr>
    <tr className={c('table-details', {'table-details--expanded': isExpanded})}>
      <td colSpan={6}>
        {children}
      </td>
    </tr>
  </tbody>
);

if (environment !== 'production') {
  StatsTableExpandableTbody.propTypes = {
    lang: PropTypes.string,
    provinceId: PropTypes.number,
    provName: PropTypes.string,
    disctrictCount: PropTypes.number,
    isExpanded: PropTypes.bool,
    onExpandToggle: PropTypes.func,
    data: PropTypes.object,
    children: PropTypes.node
  };
}
