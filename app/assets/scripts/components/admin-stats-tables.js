'use strict';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import c from 'classnames';
import _ from 'lodash';

import T, {translate} from '../components/t';

import { environment } from '../config';

// Curry lodash's get function to construct the value accessor.
// _.get(obj, path, default) => fn(default)(path)(data)
const createAcessor = _.curryRight(_.get)(null);

export const statsColumns = [
  {
    key: 'totalRoads',
    accessor: createAcessor('totalRoads'),
    label: 'Total'
  },
  {
    key: 'osmRoads',
    accessor: createAcessor('osmRoads'),
    label: 'Field'
  },
  {
    key: 'pending',
    accessor: createAcessor('status.pending'),
    label: 'Pending'
  },
  {
    key: 'done',
    accessor: createAcessor('status.reviewed'),
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
    {statsColumns.map(({key, accessor}) => <th key={key}>{getPrintValue(accessor(data))}</th>)}
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
  <tbody className={c({'table-details--expanded': isExpanded, 'table-details--collapsed': !isExpanded})}>
    <tr>
      <td><Link to={`/${lang}/assets/${provinceId}`} title={translate(lang, 'View province page')}>{provName}</Link></td>
      <td><a href='#' className='button-expand-collapse' title={translate(lang, 'Expand districts')} onClick={onExpandToggle}>{disctrictCount}</a></td>
      {statsColumns.map(({key, accessor}) => <th key={key}>{getPrintValue(accessor(data))}</th>)}
    </tr>
    <tr className={c('table-details')}>
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
