'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions, fetchAdminStats } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import AAList from '../components/aa-list';
import AAStats from '../components/aa-stats';
import AAExtendedStats from '../components/aa-extended-stats';
import AAMap from '../components/aa-map';

var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    children: React.PropTypes.object,
    subregions: React.PropTypes.object,
    stats: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentDidMount: function () {
    this.props.dispatch(fetchAdminSubregions());
    this.props.dispatch(fetchAdminStats());
  },

  render: function () {
    return (
      <section className='page'>
        <PageHeader
          pageTitle='Philippines' />

        <div className='page__body aa'>
          <div className='aa-main'>
            <AAMap />

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
})(Analytics);
