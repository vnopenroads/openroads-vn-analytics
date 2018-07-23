import React from 'react';
import T from './t';
import classnames from 'classnames';
import {
  withHandlers
} from 'recompose';


const ProvinceTableColumnHeader = withHandlers({
  sortLink: ({ columnKey, sortLinkHandler }) => () => sortLinkHandler(columnKey)
})(({ columnKey, label, sortField, sortOrder, sortLink }) => (
  <th
    className="table-properties-head sortable"
    onClick={sortLink}
  >
    <i
      className={classnames({
        'collecticon-sort-none': sortField !== columnKey,
        'collecticon-sort-asc': sortField === columnKey && sortOrder === 'asc',
        'collecticon-sort-desc': sortField === columnKey && sortOrder === 'desc'
      })}
    />
    <T>{label}</T>
  </th>
));


export default ProvinceTableColumnHeader;
