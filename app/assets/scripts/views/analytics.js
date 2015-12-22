'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions, changeStatsTab } from '../actions/action-creators';
import AADetails from '../components/aa-details';
import AAStats from '../components/aa-stats';
import PageHeader from '../components/page-header';

var Analytics = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    subregions: React.PropTypes.object,
    aaStats: React.PropTypes.object,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentDidMount: function () {
    this.props.dispatch(fetchAdminSubregions(this.props.params.aaId));
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
          pageTitle={this.props.subregions.name}
          actions />

        <div className='page__body aa'>

          <div className='aa-main'>
            <div className='inner'>
              <div className='col--sec'>
                Something something dark side...
              </div>
              <div className='col--main'>

                <AAStats
                  level={this.props.subregions.type}
                  activeStat={this.props.aaStats.activeTab || 'overview'}
                  chandeTabFn={(tab) => this.props.dispatch(changeStatsTab(tab))}/>

              </div>
            </div>
          </div>

          <AADetails
            level={this.props.subregions.type}
            adminAreaId={this.props.subregions.id}
            adminAreas={this.props.subregions.adminAreas}/>
        </div>
      </section>
    );
  }
});

module.exports = connect(state => {
  return {
    aaStats: state.aaStats,
    subregions: state.adminSubregions
  };
})(Analytics);
