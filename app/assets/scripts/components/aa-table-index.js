// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';

const displayHeader = [
  {key: 'name', value: 'Province'},
  {key: 'done', value: 'Done'},
  {key: 'total', value: 'Total'},
  {key: 'percentageComplete', value: '% Complete'}
];

const AATable = React.createClass({
  displayName: 'AATable',

  propTypes: {
    data: React.PropTypes.array
  },

  getInitialState: function () {
    return {
      sortState: {
        field: 'province',
        order: 'asc'
      }
    };
  },

  renderTableHead: function () {
    return (
      <thead>
        <tr>
          {_.map(displayHeader, (d) => {
            let c = classnames('sort-header', {
              'collecticon-sort-none': this.state.sortState.field !== d.key,
              'collecticon-sort-asc': this.state.sortState.field === d.key && this.state.sortState.order === 'asc',
              'collecticon-sort-desc': this.state.sortState.field === d.key && this.state.sortState.order === 'desc'
            });
            return (
              <th key={d.key} onClick={this.sortLinkClickHandler.bind(null, d.key)}>
                <span className={c}>{d.value}</span>
              </th>
            );
          })}
        </tr>
      </thead>
    );
  },

  sortLinkClickHandler: function (field, e) {
    e.preventDefault();
    let {field: sortField, order: sortOrder} = this.state.sortState;
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
    let sorted = _(this.props.data).sortBy(this.state.sortState.field);
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
              <td><Link to={`analytics/${province.id}`}>{province.name}</Link></td>
              <td>{province.done}</td>
              <td>{province.total}</td>
              <td>{!isNaN(province.done / province.total) ? `${((province.done / province.total * 100)).toFixed(2)}% Complete` : '0.00% Complete'}</td>
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
          {this.renderTableHead()}
          {this.renderTableBody()}
        </table>
      </div>
    );
  }
});

export default AATable;
