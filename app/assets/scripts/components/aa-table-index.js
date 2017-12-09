// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import T from './t';
import classnames from 'classnames';
import {
  compose,
  withHandlers,
  withStateHandlers,
  getContext
} from 'recompose';


const TableColumnHeader = withHandlers({
  sortLink: ({ columnKey, sortLinkHandler }) => () => sortLinkHandler(columnKey)
})
  (({ columnKey, label, sortField, sortOrder, sortLink }) => (
    <th
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


const TableRow = ({
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


const AATable = ({ data, language, sortField, sortOrder, sortHandler }) => (
  <div className='table'>
    <table>
      <thead>
        <tr>
          {
            [['name', 'Province'], ['field', 'Field'], ['total', 'Total'], ['percentageComplete', 'Progress']]
              .map(([columnKey, columnLabel]) => (
                <TableColumnHeader
                  key={columnLabel}
                  columnKey={columnKey}
                  label={columnLabel}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  sortLinkHandler={sortHandler}
                />
              ))
          }
        </tr>
      </thead>
      <tbody>
        {_.map(
          _.orderBy(data, [sortField], [sortOrder]),
          ({ id, name, route, field, total }) => (
            <TableRow
              key={id}
              id={id}
              name={name}
              route={route}
              field={field}
              total={total}
              language={language}
            />
          )
        )}
      </tbody>
    </table>
  </div>
);


export default compose(
  getContext({ language: React.PropTypes.string }),
  withStateHandlers(
    { sortField: 'name', sortOrder: 'asc' },
    {
      sortHandler: ({ sortField, sortOrder }) => (field) => (
        sortField === field ?
          { sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' } :
          { sortField: field, sortOrder: 'asc' }
      )
    }
  )
)(AATable);
