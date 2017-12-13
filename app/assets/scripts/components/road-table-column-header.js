import React from 'react';
import {
  withHandlers
} from 'recompose';
import classnames from 'classnames';


const TableColumnHeader = ({
  columnKey, sortField, sortOrder, children, sortColumnAction
}) => (
  <th
    className='table-properties-head sortable'
    onClick={sortColumnAction}
  >
    <i
      className={classnames({
        'collecticon-sort-none': sortField !== columnKey,
        'collecticon-sort-asc': sortField === columnKey && sortOrder === 'asc',
        'collecticon-sort-desc': sortField === columnKey && sortOrder === 'desc'
      })}
    />
    {children}
  </th>
);

TableColumnHeader.propTypes = {
  columnKey: React.PropTypes.string.isRequired,
  sortField: React.PropTypes.string.isRequired,
  sortOrder: React.PropTypes.string.isRequired,
  sortColumnAction: React.PropTypes.func.isRequired
};


export default withHandlers({
  sortColumnAction: ({ columnKey, sortColumnAction }) => () => sortColumnAction(columnKey)
})(TableColumnHeader);
