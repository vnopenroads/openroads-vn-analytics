'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions, fetchAdminStats } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import AAList from '../components/aa-list';
import AAStats from '../components/aa-stats';
import AAMap from '../components/aa-map';

var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    children: React.PropTypes.object,
    subregions: React.PropTypes.object,
    stats: React.PropTypes.object,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentDidMount: function () {
    this.props.dispatch(fetchAdminSubregions(this.props.params.aaId));
    this.props.dispatch(fetchAdminStats(this.props.params.aaId))
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.params.aaId !== prevProps.params.aaId && !this.props.subregions.fetching) {
      console.log('Analytics componentDidUpdate', 'update');
      this.props.dispatch(fetchAdminSubregions(this.props.params.aaId));
    } else {
      console.log('Analytics componentDidUpdate', 'NOT update');
    }
  },

  render: function () {
    console.log('Analytics props', this.props);
    return (
      <section className='page'>
        <PageHeader
          adminAreaId={this.props.subregions.id}
          pageTitle={this.props.subregions.name}
          actions />

        <div className='page__body aa'>

          <div className='aa-main'>
            <div className='inner'>
              <div className='col--sec'>
                <AAMap />
                <AAList
                  adminAreaId={this.props.subregions.id}
                  adminAreas={this.props.subregions.adminAreas}
                  sliceList />
              </div>
              <div className='col--main'>
                {!this.props.stats.fetching ? (
                  <AAStats stats={this.props.stats}/>
                  ) : null}
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
