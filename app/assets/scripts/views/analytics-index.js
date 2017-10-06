'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { t } from '../utils/i18n';
import { fetchProvinces } from '../actions/action-creators';

import AATable from '../components/aa-table-index';

var AnalyticsIndex = React.createClass({
  displayName: 'AnalyticsIndex',

  propTypes: {
    children: React.PropTypes.object,
    _fetchProvinces: React.PropTypes.func,
    _fetchVProMMsids: React.PropTypes.func,
    _setCrossWalk: React.PropTypes.func,
    fetched: React.PropTypes.bool,
    provinces: React.PropTypes.object,
    crosswalk: React.PropTypes.object,
    params: React.PropTypes.object,
    VProMMSids: React.PropTypes.object
  },

  componentWillMount: function () {
    this.props._fetchProvinces();
  },

  renderAnalyticsIndex: function () {
    let accumulator = { done: 0, total: 0 };
    const provinceData = _.map(this.props.VProMMSids.data, (data, id) => {
      const name = data.provinceName;
      // generate route to province's admin_boundaires id.
      const route = this.props.crosswalk.province[id];
      const done = data.vpromms.filter(v => v.inTheDatabase).length;
      const total = data.vpromms.length;
      accumulator.done += done;
      accumulator.total += total;
      const percentageComplete = (done / total).toFixed(2);
      return {
        id,
        name,
        done,
        total,
        percentageComplete,
        route
      };
    });
    const { done, total } = accumulator;
    const completion = (accumulator.done / accumulator.total) * 100;
    return (
      <div>
        <div className='a-header'>
          <div className='a-headline'>
            <h1>{t('VProMMS Edits By Province')}</h1>
          </div>
        </div>

        <div className='a-main__status'>
          <h2><strong>{completion.toFixed(2)}%</strong> {t('of VProMMS Ids added')} ({done.toLocaleString()} of {total.toLocaleString()})</h2>
          <div className='meter'>
            <div className='meter__internal' style={{width: `${completion}%`}}></div>
          </div>
        </div>
        <div>
          <AATable data={provinceData} crosswalk={this.props.crosswalk} vpromms={this.props.VProMMSids} />
        </div>
      </div>
    );
  },

  render: function () {
    return this.props.fetched ? this.renderAnalyticsIndex() : (<div/>);
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    provinces: state.provinces.data,
    fetched: state.provinces.fetched
  };
}

function dispatcher (dispatch) {
  return {
    _fetchProvinces: () => dispatch(fetchProvinces())
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsIndex);
