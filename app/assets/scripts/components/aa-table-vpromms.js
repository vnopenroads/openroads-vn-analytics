// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';
import { t, getLanguage } from '../utils/i18n';

import { setGlobalZoom, fetchVProMMsBbox } from '../actions/action-creators';

const displayHeader = [
  {key: 'id', value: 'VProMMS ID'},
  {key: 'inTheDatabase', value: 'Status'},
  {key: 'RouteShoot', value: 'RouteShoot'},
  {key: 'RoadLab', value: 'RoadLabPro'}
];

const AATable = React.createClass({
  displayName: 'AATable',

  propTypes: {
    _fetchVProMMsBbox: React.PropTypes.func,
    bbox: React.PropTypes.object,
    data: React.PropTypes.array,
    fetched: React.PropTypes.bool
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

  renderTableBody: function () {
    const sorted = this.handleSort(this.props.data);
    return (
      <tbody>
        {_.map(sorted, (vpromm, i) => {
          return (
            <tr key={`vpromm-${vpromm.id}`} className={classnames({'alt': i % 2})}>
              <td><Link to={`/${getLanguage()}/explore`} onClick={(e) => { this.props._fetchVProMMsBbox(vpromm.id); } }><strong>{vpromm.id}</strong></Link></td>
              <td className={classnames({'added': vpromm.inTheDatabase, 'not-added': !vpromm.inTheDatabase})}>{vpromm.inTheDatabase ? t('added') : t('not added')}</td>
              <td className={classnames({'added': vpromm.RouteShoot, 'not-added': !vpromm.RouteShoot})}>{vpromm.RouteShoot ? <a href={vpromm.RouteShootUrl}>link</a> : ''}</td>
              <td className={classnames({'added': vpromm.RoadLabPro, 'not-added': !vpromm.RoadLabPro})}>{vpromm.RoadLabPro ? t('added') : t('not added')}</td>
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
    bbox: state.VProMMsWayBbox.bbox,
    fetched: state.VProMMsWayBbox.fetched
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsBbox: (id, source) => dispatch(fetchVProMMsBbox(id, source)),
    _setGlobalZoom: (xyz) => dispatch(setGlobalZoom(xyz))
  };
}

export default connect(selector, dispatcher)(AATable);
