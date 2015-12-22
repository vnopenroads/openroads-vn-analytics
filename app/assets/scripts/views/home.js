'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions, changeStatsTab } from '../actions/action-creators';
import AADetails from '../components/aa-details';
import AAStats from '../components/aa-stats';
import PageHeader from '../components/page-header';

var Home = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    subregions: React.PropTypes.object,
    aaStats: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentDidMount: function () {
    this.props.dispatch(fetchAdminSubregions());
  },

  render: function () {
    return (
      <section className='page'>
        <PageHeader
            pageTitle='OR Philippines' />

        <div className='page__body aa'>

          <div className='aa-main'>
            <div className='inner'>
              <div className='col--sec'>
                Something something dark side...
              </div>
              <div className='col--main'>

                <AAStats
                  level={0}
                  activeStat={this.props.aaStats.activeTab || 'overview'}
                  chandeTabFn={(tab) => this.props.dispatch(changeStatsTab(tab))}/>

              </div>
            </div>
          </div>

          <AADetails
            level={0}
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
})(Home);
