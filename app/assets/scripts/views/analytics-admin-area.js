'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions, fetchAdminStats } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import AAList from '../components/aa-list';
import AAStats from '../components/aa-stats';
import AAExtendedStats from '../components/aa-extended-stats';
import AAMap from '../components/aa-map';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

  propTypes: {
    children: React.PropTypes.object,
    subregions: React.PropTypes.object,
    stats: React.PropTypes.object,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentDidMount: function () {
    this.props.dispatch(fetchAdminSubregions(this.props.params.aaId));
    this.props.dispatch(fetchAdminStats(this.props.params.aaId));
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.params.aaId !== prevProps.params.aaId && !this.props.subregions.fetching) {
      console.log('AnalyticsAA componentDidUpdate', 'update');
      this.props.dispatch(fetchAdminSubregions(this.props.params.aaId));
      this.props.dispatch(fetchAdminStats(this.props.params.aaId));
    } else {
      console.log('AnalyticsAA componentDidUpdate', 'NOT update');
    }
  },

  render: function () {
    return (
      <section className='page'>
        <PageHeader
          adminAreaId={this.props.subregions.id}
          pageTitle={this.props.subregions.name}
          bbox={this.props.subregions.bbox || []}
          actions />

        <div className='page__body aa'>
          <div className='aa-main'>
            <AAMap
              bounds={this.props.subregions.bbox} />

            <AAStats
              adminAreas={this.props.subregions.adminAreas} />

            <div className='inner'>
              <div className='col--main'>
                <AAExtendedStats
                  fetched={this.props.stats.fetched}
                  fetching={this.props.stats.fetching}
                  stats={this.props.stats}/>
              </div>

              <div className='col--sec'>
                <AAList
                  adminAreaId={this.props.subregions.id}
                  adminAreaName={this.props.subregions.name}
                  adminAreas={this.props.subregions.adminAreas}
                  sliceList />
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }
});

module.exports = connect(state => {
  return {
    subregions: state.adminSubregions,
    stats: state.stats
  };
})(AnalyticsAA);
