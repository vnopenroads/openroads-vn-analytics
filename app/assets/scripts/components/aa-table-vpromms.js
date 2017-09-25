// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)

import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { api } from '../config';
import { Link } from 'react-router';
import { getLanguage } from '../utils/i18n';
import { connect } from 'react-redux';
import { fetchVProMMsidSourceGeoJSON } from '../actions/action-creators';

const displayHeader = [
  {key: 'id', value: 'VProMMS ID'},
  {key: 'inTheDatabase', value: 'Status'},
  {key: 'RouteShoot', value: 'RouteShoot'},
  {key: 'RoadLab', value: 'RoadLabPro'},
  {key: 'FieldData', value: 'Field Data'}
];

const AATable = React.createClass({
  displayName: 'AATable',

  propTypes: {
    data: React.PropTypes.array,
    sources: React.PropTypes.object,
    _fetchVProMMsidSourceGeoJSON: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      sortState: {
        field: 'inTheDatabase',
        order: 'desc'
      }
    };
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
                <span>{d.value}</span>
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

  makeFieldDataLink: function (id) {
    return (<a href={`${api}/field/${id}/geometries?grouped=false&download=true`}>Download</a>);
  },

  renderTableBody: function () {
    const sorted = this.handleSort(this.props);
    return (
      <tbody>
        {_.map(sorted, (vpromm, i) => {
          return (
            <tr key={`vpromm-${vpromm.id}`} className={classnames({'alt': i % 2})}>
              <td><strong><Link to={`${getLanguage()}/analytics/${vpromm.id}`} onClick={(e) => { this.props._fetchVProMMsidSourceGeoJSON(vpromm.id); } }>{vpromm.id}</Link></strong></td>
              <td className={classnames({'added': vpromm.inTheDatabase, 'not-added': !vpromm.inTheDatabase})}>{vpromm.inTheDatabase ? 'added' : 'not added'}</td>
              <td className={classnames({'added': vpromm.RouteShoot, 'not-added': !vpromm.RouteShoot})}>{vpromm.RouteShoot ? <a href={vpromm.RouteShootUrl}>link</a> : ''}</td>
              <td className={classnames({'added': vpromm.RoadLabPro, 'not-added': !vpromm.RoadLabPro})}>{vpromm.RoadLabPro ? 'added' : 'not added'}</td>
              <td className={classnames({'added': this.props.sources[vpromm.id], 'not-added': !this.props.sources[vpromm.id]})}>{this.props.sources[vpromm.id] ? this.makeFieldDataLink(vpromm.id) : 'not added'}</td>
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
  return {};
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsidSourceGeoJSON: (vprommId) => { dispatch(fetchVProMMsidSourceGeoJSON(vprommId)); }
  };
}

export default connect(selector, dispatcher)(AATable);
