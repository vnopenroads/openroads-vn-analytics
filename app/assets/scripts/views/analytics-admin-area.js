'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { _ } from 'lodash';
import { t } from '../utils/i18n';

import AATable from '../components/aa-table-vpromms';
import Headerdrop from '../components/headerdrop';

import { fetchVProMMsids, fetchFieldVProMMsids, fetchVProMMsidsProperties, setCrossWalk } from '../actions/action-creators';

import config from '../config';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

  propTypes: {
    _fetchVProMMsids: React.PropTypes.func,
    _fetchFieldVProMMsids: React.PropTypes.func,
    _fetchVProMMsidsProperties: React.PropTypes.func,
    _setCrossWalk: React.PropTypes.func,
    children: React.PropTypes.object,
    routeParams: React.PropTypes.object,
    crosswalk: React.PropTypes.object,
    params: React.PropTypes.object,
    provinceCrossWalk: React.PropTypes.object,
    VProMMSids: React.PropTypes.object,
    VProMMsProps: React.PropTypes.object,
    fieldIds: React.PropTypes.array,
    fieldFetched: React.PropTypes.bool,
    propsFetched: React.PropTypes.bool
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
            ['CSV'].map((type, i) => {
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

  componentWillMount: function () {
    this.props._fetchVProMMsidsProperties();
    this.props._fetchFieldVProMMsids();
  },

  renderAnalyticsAdmin: function () {
    const provinceId = _.invert(this.props.crosswalk.province)[this.props.routeParams.aaId];
    const provinceName = this.props.VProMMSids.data[provinceId].provinceName;
    const idTest = new RegExp(provinceId);
    const adminData = Object.keys(this.props.VProMMsProps).filter(id => idTest.test(id));
    const propertiesData = _.pickBy(this.props.VProMMsProps, (prop, vpromm) => (adminData.indexOf(vpromm) !== -1));
    const field = this.props.fieldIds.filter(vpromm => idTest.test(vpromm)).length;
    const total = adminData.length;
    const completion = total !== 0 ? ((field / total) * 100) : 0;
    let completionMainText;
    let completionTailText = t('Information on VPRoMMS roads is not available');
    if (total !== 0) {
      completionMainText = completion.toFixed(2);
      completionTailText = `% ${t('of VProMMS Ids have field data')} ${field.toLocaleString()} of ${total.toLocaleString()}`;
    }
    // completion text is comprised of a main text component and a tail component, both need to be distinct per the existence of ids for the province.
    return (
      <div>
        <div className='a-header'>
          <div className='a-headline'>
            <h1>{provinceName} {t('Province')}</h1>
          </div>
          <div className='a-head-actions'>
            { completion ? this.renderDataDumpLinks(provinceId) : '' }
          </div>
        </div>
        <div>
          <div className='a-main__status'>
            <h2><strong>{completionMainText}</strong>{completionTailText}</h2>
            <div className='meter'>
              <div className='meter__internal' style={{width: `${completion}%`}}></div>
            </div>
          </div>
          <div>
            {total ? <AATable data={adminData} propertiesData={propertiesData} /> : ''}
          </div>
        </div>
      </div>
    );
  },

  render: function () {
    const allFetched = (this.props.propsFetched && this.props.fieldFetched);
    return allFetched ? this.renderAnalyticsAdmin() : (<div/>);
  }
});

function selector (state) {
  return {
    fieldIds: state.fieldVProMMsids.ids,
    crosswalk: state.crosswalk,
    propsFetched: state.VProMMsidProperties.fetched,
    fieldFetched: state.fieldVProMMsids.fetched,
    VProMMSids: state.VProMMSidsAnalytics,
    VProMMsProps: state.VProMMsidProperties.properties
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsids: () => dispatch(fetchVProMMsids()),
    _fetchFieldVProMMsids: () => dispatch(fetchFieldVProMMsids()),
    _fetchVProMMsidsProperties: () => dispatch(fetchVProMMsidsProperties()),
    _setCrossWalk: () => dispatch(setCrossWalk())
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);

