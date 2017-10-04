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
    // provinceId is used to generate the data dump url.
    let provinceId = this.props.routeParams.aaId;
    // data includes the province's vpromms and its name.
    let data = this.props.VProMMSids[provinceId];
    let provinceName = data.provinceName;
    let ids = data.vpromms;
    // done === number of vpromms ids that exist in the database for the province
    let done = ids.filter(v => v.inTheDatabase).length;
    // total === all possible vpromms ids for the province
    let total = ids.length;
    // completion is % of added-to-database vpromms ids. if the province has none, then make it 0.
    const completion = total !== 0 ? ((done / total) * 100) : 0;
    // completion text is comprised of a main text component and a tail component, both need to be distinct per the existence of ids for the province.
    let completionMainText;
    // when no province vpromms, make completion tail text say so,
    let completionTailText = 'Information on VPRoMMS roads is not available';
    // if there are roads, then make the main text the % of completed and tail text an identifier of what the completion
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
          {/* like with the completionText components, if there aren't any roads, do not render the AATable, do so if there are roads. */}
          {total ? <AATable data={ids} sources={this.props.VProMMSidsSources} provinceName={data.provinceName} province={this.props.routeParams.aaId}/> : ''}
        </div>
      </div>
    );
  },

  render: function () {
    return this.renderTable();
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
