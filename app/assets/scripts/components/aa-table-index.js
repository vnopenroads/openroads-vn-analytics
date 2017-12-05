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


const AATable = React.createClass({
  displayName: 'AATable',

  propTypes: {
    data: React.PropTypes.array.isRequired,
    language: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      sortState: {
        field: 'name',
        order: 'asc'
      }
    };
  },

  sortLinkClickHandler: function (field) {
    const { field: sortField, order: sortOrder } = this.state.sortState;
    let order = 'asc';

    // Same field, switch order; different field, reset order.
    if (sortField === field) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }

    this.setState({
      sortState: {
        field,
        order
      }
    });
  },

  handleSort: function () {
    let sortField = this.state.sortState.field;
    if (sortField === 'progress') {
      sortField = 'percentageComplete';
    }
    let sorted = _(this.props.data).sortBy(sortField);
    if (this.state.sortState.order === 'desc') {
      sorted = sorted.reverse();
    }
    return sorted.value();
  },

  render: function () {
    const { data, language } = this.props;

    return (
      <div className='table'>
        <table>
          <thead>
            <tr>
              {
                [['name', 'Province'], ['field', 'Field'], ['total', 'Total'], ['progress', 'Progress']]
                  .map(([columnKey, columnLabel]) => (
                    <TableColumnHeader
                      key={columnLabel}
                      columnKey={columnKey}
                      label={columnLabel}
                      sortField={this.state.sortState.field}
                      sortOrder={this.state.sortState.order}
                      sortLinkHandler={this.sortLinkClickHandler}
                    />
                  ))
              }
            </tr>
          </thead>
          <tbody>
            {_.map(this.handleSort(data), ({ id, name, route, field, total }) => (
              <TableRow
                key={id}
                id={id}
                name={name}
                route={route}
                field={field}
                total={total}
                language={language}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
});


export default compose(
  getContext({ language: React.PropTypes.string })
)(AATable);
