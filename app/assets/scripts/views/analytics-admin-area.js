'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { t } from '../utils/i18n';

import AATable from '../components/aa-table-vpromms';
import AAFieldMap from '../components/aa-field-map';

import { fetchVProMMSidsSources } from '../actions/action-creators';
import config from '../config';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

  propTypes: {
    children: React.PropTypes.object,
    routeParams: React.PropTypes.object,
    _fetchVProMMSids: React.PropTypes.func,
    _fetchVProMMSidsSources: React.PropTypes.func,
    VProMMSids: React.PropTypes.object,
    VProMMSidsSources: React.PropTypes.object,
    VProMMSidsSourcesFetched: React.PropTypes.bool,
    VProMMSidSourceGeoJSON: React.PropTypes.object,
    VProMMSidSourceGeoJSONFetched: React.PropTypes.bool
  },

  componentDidMount: function () {
    const vpromms = this.props.VProMMSids[this.props.routeParams.aaId].vpromms.map(road => road.id);
    this.provinceName = '';
    // fire request for source data
    this.props._fetchVProMMSidsSources(vpromms);
  },

  renderTable: function () {
    let provinceId = this.props.routeParams.aaId;
    let data = this.props.VProMMSids[provinceId];
    let ids = data.vpromms;
    this.provinceName = data.provinceName;
    let done = ids.filter(v => v.inTheDatabase).length;
    let total = ids.length;
    const completion = total !== 0 ? ((done / total) * 100) : 0;
    let completionMainText;
    let completionTailText = 'Information on VPRoMMS roads is not available';
    if (total !== 0) {
      completionMainText = completion.toFixed(2);
      completionTailText = `% of vPRoMMS IDs added ${done.toLocaleString()} of ${total.toLocaleString()}`;
    }
    return (
    <div>
      <div className="aa-header">
        <h1>{this.provinceName} {t('Province')}</h1>
        { completion ? <a className='bttn-s bttn-road-network' href={config.provinceDumpBaseUrl + provinceId + '.geojson'}>{t('Download Roads')}</a> : '' }
      </div>
      <div className='aa-main__status'>
        <h2><strong>{completionMainText}</strong>{completionTailText}</h2>
        <div className='meter'>
         <div className='meter__internal' style={{width: `${completion}%`}}></div>
        </div>
        {total ? <AATable data={ids} sources={this.props.VProMMSidsSources} province={this.props.routeParams.aaId}/> : ''}
      </div>
    </div>
    );
  },

  renderFieldMap: function () {
    return (
      <div>
        <div className="aa-header">
          <h1>{`${this.provinceName} ${t('Province')} - Road`}</h1>
        </div>
        <div className='aa-main__status'>
          <AAFieldMap/>
        </div>
      </div>
     );
  },

  render: function () {
    // only render the table if
    // 1) VProMMSidsSource have been fetched, denoted by them === true when casted to a boolean
    // 2) source geojsons have not been added to the store via an api query
    if (this.props.VProMMSidsSourcesFetched) {
      if (!this.props.VProMMSidSourceGeoJSONFetched) {
        return this.renderTable();
      } else {
        return this.renderFieldMap();
      }
    }
    return (<div/>);
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    VProMMSids: state.VProMMSids.data,
    VProMMSidsSources: state.VProMMSidsSources.sources,
    VProMMSidsSourcesFetched: state.VProMMSidsSources.fetched,
    VProMMSidSourceGeoJSON: state.VProMMSidSourceGeoJSON.geoJSON,
    VProMMSidSourceGeoJSONFetched: state.VProMMSidSourceGeoJSON.fetched
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMSidsSources: (ids) => dispatch(fetchVProMMSidsSources(ids))
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);
