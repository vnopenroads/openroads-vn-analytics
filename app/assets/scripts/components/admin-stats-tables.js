'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import c from 'classnames';
import _ from 'lodash';

import T, { translate } from '../components/t';

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

export const StatsTableHeader = ({ type }) => (
  <thead>
    <tr>
      {type === 'province' && <th><T>Provinces</T></th>}
      {type === 'province-district' && <th><T>Province</T></th>}
      {type === 'province' && <th><T>Districts</T></th>}
      {(type === 'province-district' || type === 'district') && <th><T>District</T></th>}
      {statsColumns.map(({ key, label }) => <th key={key}><T>{label}</T></th>)}
    </tr>
  </thead>
);

if (environment !== 'production') {
  StatsTableHeader.propTypes = {
    type: PropTypes.string
  };
}

const getPrintValue = (v) => (v === 0 || v) && v !== ' ' ? v : 'n/a';

export const StatsTableRow = ({ type, data, lang, provinceId, provinceName, districtId, districtName }) => (
  <tr>
    {type === 'province-district' && <th><Link to={`/${lang}/assets/${provinceId}`} title={translate(lang, 'View province page')}>{provinceName}</Link></th>}
    <th><Link to={`/${lang}/assets/${provinceId}/${districtId}`} title={translate(lang, 'View district page')}>{districtName}</Link></th>
    {statsColumns.map(({ key, accessor }) => <td key={key}>{getPrintValue(accessor(data))}</td>)}
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

export const StatsTableExpandableTbody = ({ lang, provinceId, provName, disctrictCount, isExpanded, onExpandToggle, data, children }) => (
  <tbody className={c({ 'table-details--expanded': isExpanded, 'table-details--collapsed': !isExpanded })}>
    <tr>
      <th><Link to={`/${lang}/assets/${provinceId}`} title={translate(lang, 'View province page')}>{provName}</Link></th>
      <td><a href='#' className='button-expand-collapse' title={translate(lang, 'Expand districts')} onClick={onExpandToggle}>{disctrictCount}</a></td>
      {statsColumns.map(({ key, accessor }) => <td key={key}>{getPrintValue(accessor(data))}</td>)}
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

export const StatsBar = ({ total, completed }) => (
  <div className='stats-bar'>
    <span className='stats-bar__complete' style={{ width: Math.min((completed / total) || 0, 1.0) * 100 + '%' }}></span>
  </div>
);

if (environment !== 'production') {
  StatsBar.propTypes = {
    total: PropTypes.number,
    completed: PropTypes.number
  };
}

export const StatsBlock = ({ title, total, completed, list }) => (
  <div className='stats-block'>
    <h3>{title}</h3>
    <figure>
      <StatsBar total={total} completed={completed} />
      <figcaption>
        <ul className='stats-list'>
          {list.map(({ label, value }) => (
            <li key={label} className='stats-list__item'><span className='value'>{value}</span><small>{label}</small></li>
          ))}
        </ul>
      </figcaption>
    </figure>
  </div>
);

if (environment !== 'production') {
  StatsBlock.propTypes = {
    title: PropTypes.string,
    total: PropTypes.number,
    completed: PropTypes.number,
    list: PropTypes.array
  };
}
