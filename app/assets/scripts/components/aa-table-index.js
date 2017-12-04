// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import T from './T';
import classnames from 'classnames';
import { setAdmin } from '../actions/action-creators';
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


const AATable = React.createClass({
  displayName: 'AATable',

  propTypes: {
    _setAdmin: React.PropTypes.func.isRequired,
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

  renderTableBody: function () {
    const sorted = this.handleSort(this.props.data);
    return (
      <tbody>
        {_.map(sorted, (province, i) => {
          return (
            <tr key={`province-${province.id}`} className={classnames({'alt': i % 2})}>
              <th><Link onClick={(e) => { this.props._setAdmin({ id: province.id, name: province.name }); } } to={`${this.props.language}/assets/${province.route}`}>{province.name}</Link></th>
              <td>{province.field}</td>
              <td>{province.total}</td>
              <td>
                <div className='meter'>
                  <div className='meter__internal' style={ province.total > 0 ? {width: `${province.field / province.total * 100}%`} : {width: 0}}></div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  },

  render: function () {
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
          {this.renderTableBody()}
        </table>
      </div>
    );
  }
});


export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    null,
    dispatch => ({ _setAdmin: (admin) => dispatch(setAdmin(admin)) })
  )
)(AATable);
