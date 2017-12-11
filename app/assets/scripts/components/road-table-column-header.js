import React from 'react';
import {
  withHandlers
} from 'recompose';
import classnames from 'classnames';
import T from './t';


const TableColumnHeader = ({
  columnKey, label, sortField, sortOrder, sortColumnAction
}) => (
  <th
    onClick={sortColumnAction}
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
);

TableColumnHeader.propTypes = {
  columnKey: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  sortField: React.PropTypes.string.isRequired,
  sortOrder: React.PropTypes.string.isRequired,
  sortColumnAction: React.PropTypes.func.isRequired
};


export default withHandlers({
  sortColumnAction: ({ columnKey, sortColumnAction }) => () => sortColumnAction(columnKey)
})(TableColumnHeader);
