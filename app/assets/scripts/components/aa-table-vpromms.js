// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { api } from '../config';
import { Link } from 'react-router';
import { t, getLanguage } from '../utils/i18n';
import { fetchVProMMsBbox, fetchVProMMSidsSources, fetchVProMMSidsProperties } from '../actions/action-creators';

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
    _fetchVProMMSidsSources: React.PropTypes.func,
    _fetchVProMMsBbox: React.PropTypes.func,
    _fetchVProMMSidsProperties: React.PropTypes.func,
    bbox: React.PropTypes.array,
    fetched: React.PropTypes.bool,
    properties: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      sortState: {
        field: 'inTheDatabase',
        order: 'desc',
        expandedId: null
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
          <th className='table-properties-head'>Properties</th>
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
        <Link className='bttn bttn-s bttn-base-light' to={`/${getLanguage()}/analytics/road/${id}/`}>Map</Link>
        <a className='bttn bttn-s bttn-base-light' href={`${api}/field/geometries/${id}?grouped=false&download=true`}>Download</a>
      </div>
    );
  },

  // in renderTableBody, vprommExists represents if a given vpromms id has a field data source attached to it.
  // it is used to decide whether:
  // 1. make a link to the AAFieldMap component in the first column of the table.
  // 2. to a road data dump in the last column
  renderVProMMsLink: function (id) {
    return (
      <Link to={`/${getLanguage()}/explore`} onClick={(e) => { this.props._fetchVProMMsBbox(id); } }><strong>{id}</strong></Link>
    );
  },

  onPropertiesClick: function (vprommId) {
    let curId = this.state.expandedId;
    let newId = curId === vprommId ? null : vprommId;
    this.setState({expandedId: newId});
  },

  renderTableBody: function () {
    const sorted = this.handleSort(this.props.data);
    const inDbIds = Object.keys(this.props.properties);
    return (
      <tbody>
        {_.map(sorted, (vpromm, i) => {
          const vprommFieldInDB = (this.props.sources.indexOf(vpromm.id) !== -1);
          const vprommInDB = (inDbIds.indexOf(vpromm.id) !== -1);
          let propBtnLabel = this.state.expandedId === vpromm.id ? 'Hide' : 'Show';
          let propBtnClass = classnames('bttn-table-expand', {
            'bttn-table-expand--show': this.state.expandedId !== vpromm.id,
            'bttn-table-expand--hide': this.state.expandedId === vpromm.id
          });
          let propContainerClass = classnames('table-properties', {
            'table-properties--hidden': this.state.expandedId !== vpromm.id
          });

          return (
            <tr key={`vpromm-${vpromm.id}`} className={classnames({'alt': i % 2})}>
              <th className={classnames({'added': vprommInDB, 'not-added': !vprommInDB})}>{ vprommInDB ? this.renderVProMMsLink(vpromm.id) : vpromm.id }</th>
              <td className={classnames({'added': vpromm.inTheDatabase, 'not-added': !vpromm.inTheDatabase})}>{vpromm.inTheDatabase ? t('added') : t('not added')}</td>
              <td className={classnames({'added': vprommFieldInDB, 'not-added': !vprommFieldInDB})}>{ vprommFieldInDB ? this.renderFieldMapButtons(vprommFieldInDB, vpromm.id) : ''}</td>
              <td className='table-properties-cell'>
                <button type='button' className={propBtnClass} onClick={this.onPropertiesClick.bind(null, vpromm.id)}><span>{propBtnLabel}</span></button>
                <div className={propContainerClass}>
                  <dl className='table-properties-list'>
                    <dt>Key 1</dt>
                    <dd>Value 1</dd>
                    <dt>Very_long_key_here_yes_it_is</dt>
                    <dd>A_very_long_value_for_a_very_long_key</dd>
                    <dt>Key 3</dt>
                    <dd>Value 3</dd>
                    <dt>Key 4</dt>
                    <dd>Value 4</dd>
                    <dt>Key 5</dt>
                    <dd>Value 5</dd>
                  </dl>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  },

  render: function () {
    return this.props.fetched ? (
      <div className='table'>
        <table>
          {this.renderTableHead()}
          {this.renderTableBody()}
        </table>
      </div>
    ) : (<div/>);
  }
});

function selector (state) {
  return {
    bbox: state.VProMMsWayBbox.bbox,
    fetched: state.VProMMSidsSources.fetched,
    sources: state.VProMMSidsSources.sources,
    properties: state.VProMMsidProperties.properties
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsBbox: (id, source) => dispatch(fetchVProMMsBbox(id, source)),
    _fetchVProMMSidsSources: (id) => dispatch(fetchVProMMSidsSources(id)),

  };
}

export default connect(selector, dispatcher)(AATable);
