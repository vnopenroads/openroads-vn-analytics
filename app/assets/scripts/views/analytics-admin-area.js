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
    VProMMSidsSources: React.PropTypes.array,
    VProMMSidsSourcesFetched: React.PropTypes.bool
  },

  componentDidMount: function () {
    this.provinceId = this.props.routeParams.aaId;
    this.data = this.props.VProMMSids[this.provinceId];
    this.ids = this.data.vpromms;
    const vpromms = this.ids.map(road => road.id);
    // fire request for source data
    this.done = this.ids.filter(v => v.inTheDatabase).length;
    this.total = this.ids.length;
    this.props._fetchVProMMSidsSources(vpromms);
  },

  componentWillReceiveProps: function (nextProps) {
    this.mergeIds();
  },

  mergeIds: function () {
  },

  render: function () {
    if (this.props.VProMMSidsSources.length) {
      const completion = this.total !== 0 ? ((this.done / this.total) * 100) : 0;
      let completionMainText;
      let completionTailText = 'Information on VPRoMMS roads is not available';
      if (this.total !== 0) {
        completionMainText = completion.toFixed(2);
        completionTailText = `% of vPRoMMS IDs added ${this.done.toLocaleString()} of ${this.total.toLocaleString()}`;
      }
      return (
      <div>
        <div className="aa-header">
          <h1>{this.data.provinceName} {t('Province')}</h1>
          { completion ? <a className='bttn-s bttn-road-network' href={config.provinceDumpBaseUrl + this.provinceId + '.geojson'}>{t('Download Roads')}</a> : '' }
        </div>
        <div className='aa-main__status'>
          <h2><strong>{completionMainText}</strong>{completionTailText}</h2>
          <div className='meter'>
           <div className='meter__internal' style={{width: `${completion}%`}}></div>
          </div>
          {this.total ? <AATable data={this.ids} /> : ''}
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
