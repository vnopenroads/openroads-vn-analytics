'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { t } from '../utils/i18n';

import AATable from '../components/aa-table-vpromms';

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
    VProMMSidsSources: React.PropTypes.object
  },

  componentDidMount: function () {
    const vpromms = this.props.VProMMSids[this.props.routeParams.aaId].vpromms.map(road => road.id);
    // fire request for source data
    this.props._fetchVProMMSidsSources(vpromms);
  },

  render: function () {
    // only render the table if the  VProMMSidsSource have been fetched, denoted by them === true when casted to a boolean
    if (this.props.VProMMSidsSources) {
      let provinceId = this.props.routeParams.aaId;
      let data = this.props.VProMMSids[provinceId];
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
          <h1>{data.provinceName} {t('Province')}</h1>
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
    }
    return (<div/>);
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    VProMMSids: state.VProMMSids.data,
    VProMMSidsSources: state.VProMMSidsSources.sources
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMSidsSources: (ids) => dispatch(fetchVProMMSidsSources(ids))
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);
