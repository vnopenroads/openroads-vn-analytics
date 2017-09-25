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
    params: React.PropTypes.object,
    vpromm: React.PropTypes.string,
    _fetchVProMMSids: React.PropTypes.func,
    _fetchVProMMSidsSources: React.PropTypes.func,
    VProMMSids: React.PropTypes.object,
    VProMMSidsSources: React.PropTypes.object,
    VProMMSidSourceGeoJSON: React.PropTypes.object,
    VProMMSidSourceGeoJSONisFetched: React.PropTypes.bool
  },

  componentDidMount: function () {
    const vpromms = this.props.VProMMSids[this.props.routeParams.aaId].vpromms.map(road => road.id);
    // fire request for source data
    this.props._fetchVProMMSidsSources(vpromms);
  },

  renderTable: function () {
    let provinceId = this.props.routeParams.aaId;
    let data = this.props.VProMMSids[provinceId];
    let provinceName = data.provinceName;
    let ids = data.vpromms;
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
        <h1>{provinceName} {t('Province')}</h1>
        { completion ? <a className='bttn-s bttn-road-network' href={config.provinceDumpBaseUrl + provinceId + '.geojson'}>{t('Download Roads')}</a> : '' }
      </div>
      <div className='aa-main__status'>
        <h2><strong>{completionMainText}</strong>{completionTailText}</h2>
        <div className='meter'>
         <div className='meter__internal' style={{width: `${completion}%`}}></div>
        </div>
        {total ? <AATable data={ids} sources={this.props.VProMMSidsSources} provinceName={data.provinceName} province={this.props.routeParams.aaId}/> : ''}
      </div>
    </div>
    );
  },

  renderFieldMap: function () {
    return (
      <div>
        <AAFieldMap road={this.props.VProMMSidSourceGeoJSON}/>
      </div>
     );
  },

  render: function () {
    console.log(this.props);
    const vprommsParam = Boolean(this.props.params.vpromm);
    const fetchedVProMMsGeoJSON = this.props.VProMMSidSourceGeoJSONisFetched;
    // if there there is not a vprommId in the route path parameters, which === the hash being located at the admin-area-analytics view, only render the table
    if (!vprommsParam) {
      return this.renderTable();
      // if there is a vpromms id in the route path, render the map.
    } else if (vprommsParam && fetchedVProMMsGeoJSON) {
      return this.renderFieldMap();
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
    VProMMSidSourceGeoJSON: state.VProMMSidSourceGeoJSON,
    VProMMSidSourceGeoJSONisFetched: state.VProMMSidSourceGeoJSON.fetched
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMSidsSources: (ids) => dispatch(fetchVProMMSidsSources(ids))
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);
