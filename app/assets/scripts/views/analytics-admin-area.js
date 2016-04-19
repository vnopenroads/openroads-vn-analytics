'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions, fetchAdminStats, fetchTofixTasks } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import AAList from '../components/aa-list';
import AAStats from '../components/aa-stats';
import AAExtendedStats from '../components/aa-extended-stats';
import AAMap from '../components/aa-map';
import AATofixTasks from '../components/aa-tofix-tasks';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

  propTypes: {
    children: React.PropTypes.object,
    _fetchAdminSubregions: React.PropTypes.func,
    _fetchAdminStats: React.PropTypes.func,
    _fetchTofixTasks: React.PropTypes.func,
    subregions: React.PropTypes.object,
    stats: React.PropTypes.object,
    tofixtasks: React.PropTypes.object,
    params: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchAdminSubregions(this.props.params.aaId);
    this.props._fetchAdminStats(this.props.params.aaId);
    this.props._fetchTofixTasks(this.props.params.aaId, 1, 10);
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.params.aaId !== prevProps.params.aaId && !this.props.subregions.fetching) {
      console.log('AnalyticsAA componentDidUpdate', 'update');
      this.props._fetchAdminSubregions(this.props.params.aaId);
      this.props._fetchAdminStats(this.props.params.aaId);
      this.props._fetchTofixTasks(this.props.params.aaId, 1, 10);
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
              bbox={this.props.subregions.bbox} />

            <AAStats
              stats={this.props.stats.stats}
              tofixtasks={this.props.tofixtasks}
              adminAreas={this.props.subregions.adminAreas} />

            <div className='inner'>
              <div className='col--main'>

                <AAExtendedStats
                  fetched={this.props.stats.fetched}
                  fetching={this.props.stats.fetching}
                  adminAreaId={this.props.stats.id}
                  bbox={this.props.subregions.bbox || []}
                  error={this.props.stats.error}
                  stats={this.props.stats.stats} />

                <AATofixTasks
                  fetched={this.props.tofixtasks.fetched}
                  fetching={this.props.tofixtasks.fetching}
                  adminAreaId={Number(this.props.tofixtasks.data.id)}
                  adminAreaName={this.props.tofixtasks.data.name}
                  meta={this.props.tofixtasks.data.tasks.meta}
                  tasks={this.props.tofixtasks.data.tasks.results}
                  error={this.props.tofixtasks.error}
                  sliceList />
              </div>

              <div className='col--sec'>
                <AAList
                  fetched={this.props.subregions.fetched}
                  fetching={this.props.subregions.fetching}
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

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    subregions: state.adminSubregions,
    stats: state.stats,
    tofixtasks: state.tofixtasks
  };
}

function dispatcher (dispatch) {
  return {
    _fetchAdminSubregions: (aaid) => dispatch(fetchAdminSubregions(aaid)),
    _fetchAdminStats: (aaid) => dispatch(fetchAdminStats(aaid)),
    _fetchTofixTasks: (aaid, page, limit) => dispatch(fetchTofixTasks(aaid, page, limit))
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);
