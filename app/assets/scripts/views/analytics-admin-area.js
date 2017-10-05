'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { _ } from 'lodash';
import { t } from '../utils/i18n';

import AATable from '../components/aa-table-vpromms';
import Headerdrop from '../components/headerdrop';

import { fetchVProMMsids } from '../actions/action-creators';
import config from '../config';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

  propTypes: {
    children: React.PropTypes.object,
    routeParams: React.PropTypes.object,
    _fetchVProMMsids: React.PropTypes.func,
    provinceCrossWalk: React.PropTypes.object,
    VProMMSids: React.PropTypes.object,
    crosswalk: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchVProMMsids('analytics');
  },

  renderDataDumpLinks: function (provinceId) {
    return (
        <Headerdrop
          id='datadump-selector'
          className='drop-road-network'
          triggerClassName='drop-toggle drop-road-network caret bttn bttn-secondary bttn-road-network'
          triggerText={`${t('Download')} ${t('Roads')}`}
          triggerElement='a'
          direction='down'
          alignment='right'>
          <ul className='drop-menu drop-menu--select' role='menu'>
            {
            ['CSV', 'GeoJSON'].map((type, i) => {
              let cl = 'drop-menu-item';
              return (
                <li>
                  <a className={cl} href={`${config.provinceDumpBaseUrl}${provinceId}.${type.toLowerCase()}`}>
                    {`${t('Download')} ${type}`}
                  </a>
                </li>
              );
            })
            }
          </ul>
        </Headerdrop>
    );
  },

  render: function () {
    const provinceId = _.invert(this.props.crosswalk.province)[this.props.routeParams.aaId];
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
      <div className='a-header'>
        <div className='a-headline'>
          <h1>{data.provinceName} {t('Province')}</h1>
        </div>
        <div className='a-head-actions'>
          { completion ? this.renderDataDumpLinks(provinceId) : '' }
        </div>
      </div>

      <div className='a-main__status'>
        <h2><strong>{completionMainText}</strong>{completionTailText}</h2>
        <div className='meter'>
          <div className='meter__internal' style={{width: `${completion}%`}}></div>
        </div>
      </div>

      <div>
        {total ? <AATable data={ids} /> : ''}
      </div>
    </div>
    );
    return (<div/>);
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    VProMMSids: state.VProMMSidsAnalytics,
    provinceCrossWalk: state.crosswalk.province
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsids: (use) => dispatch(fetchVProMMsids(use))
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);
