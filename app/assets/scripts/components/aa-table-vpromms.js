// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { api } from '../config';
import { Link } from 'react-router';
import { t, getLanguage } from '../utils/i18n';

import { fetchVProMMSidsSources } from '../actions/action-creators';

const displayHeader = [
  {key: 'id', value: 'VProMMS ID'},
  {key: 'inTheDatabase', value: 'Status'},
  {key: 'FieldData', value: 'Field Data'}
];

const AATable = React.createClass({
  displayName: 'AATable',

  propTypes: {
    aaId: React.PropTypes.string,
    data: React.PropTypes.array,
    province: React.PropTypes.string,
    provinceName: React.PropTypes.string,
    routeParams: React.PropTypes.func,
    sources: React.PropTypes.array,
    _fetchVProMMSidsSources: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      sortState: {
        field: 'inTheDatabase',
        order: 'desc'
      }
    };
  },

  componentWillMount: function () {
    const ids = this.props.data.map(obj => obj.id);
    this.props._fetchVProMMSidsSources(ids);
  },

  renderTableHead: function () {
    return (
      <thead>
        <tr>
          {_.map(displayHeader, (d) => {
            let c = classnames('collecticons', {
              'collecticons-sort-none': this.state.sortState.field !== d.key,
              'collecticons-sort-asc': this.state.sortState.field === d.key && this.state.sortState.order === 'asc',
              'collecticons-sort-desc': this.state.sortState.field === d.key && this.state.sortState.order === 'desc'
            });
            return (
              <th key={d.key} onClick={this.sortLinkClickHandler.bind(null, d.key)}>
                <i className={c}></i>
                <span>{t(d.value)}</span>
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

  renderFieldMapButtons: function (vprommExists, id) {
    return (
      <div>
        <Link className='bttn bttn-s bttn-base-light' to={`/${getLanguage()}/road/${id}/`}>Map</Link>
        <a className='bttn bttn-s bttn-base-light' href={`${api}/field/geometries/${id}?grouped=false&download=true`}>Download</a>
      </div>
    );
  },

  // in renderTableBody, vprommExists represents if a given vpromms id has a field data source attached to it.
  // it is used to decide whether:
  // 1. make a link to the AAFieldMap component in the first column of the table.
  // 2. to a road data dump in the last column
  renderTableBody: function () {
    const sorted = this.handleSort(this.props);
    return (
      <tbody>
        {_.map(sorted, (vpromm, i) => {
          const vprommExists = (this.props.sources.indexOf(vpromm.id) !== -1);
          return (
            <tr key={`vpromm-${vpromm.id}`} className={classnames({'alt': i % 2})}>
              <td><strong>{vpromm.id}</strong></td>
              <td className={classnames({'added': vpromm.inTheDatabase, 'not-added': !vpromm.inTheDatabase})}>{vpromm.inTheDatabase ? 'added' : 'not added'}</td>
              <td className={classnames({'added': vprommExists, 'not-added': !vprommExists})}>{ vprommExists ? this.renderFieldMapButtons(vprommExists, vpromm.id) : ''}</td>
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

function selector (state) {
  return {
    sources: state.VProMMSidsSources.sources
  };
}
function dispatcher (dispatch) {
  return {
    _fetchVProMMSidsSources: (ids) => dispatch(fetchVProMMSidsSources(ids))
  };
}

export default connect(selector, dispatcher)(AATable);
