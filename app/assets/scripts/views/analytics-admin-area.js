'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { t } from '../utils/i18n';

import AATable from '../components/aa-table-vpromms';

import { fetchVProMMsids } from '../actions/action-creators';
import config from '../config';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

  propTypes: {
    children: React.PropTypes.object,
    routeParams: React.PropTypes.object,
    _fetchVProMMsids: React.PropTypes.func,
    VProMMSids: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchVProMMsids('analytics');
  },

  render: function () {
    const provinceId = this.props.routeParams.aaId;
    const data = this.props.VProMMSids.data[provinceId];
    const ids = data.vpromms;
    const done = ids.filter(v => v.inTheDatabase).length;
    const total = ids.length;
    const completion = total !== 0 ? ((done / total) * 100) : 0;
    let completionMainText;
    let completionTailText = t('Information on VPRoMMS roads is not available');
    if (total !== 0) {
      completionMainText = completion.toFixed(2);
      completionTailText = `% ${t('of VProMMS Ids added')} ${done.toLocaleString()} of ${total.toLocaleString()}`;
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
        {total ? <AATable data={ids} /> : ''}
      </div>
    </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    VProMMSids: state.VProMMSidsAnalytics
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsids: (use) => dispatch(fetchVProMMsids(use))
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);
