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

var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    children: React.PropTypes.object,
    _fetchAdminSubregions: React.PropTypes.func,
    _fetchAdminStats: React.PropTypes.func,
    _fetchTofixTasks: React.PropTypes.func,
    subregions: React.PropTypes.object,
    stats: React.PropTypes.object,
    tofixtasks: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchAdminSubregions();
    this.props._fetchAdminStats();
    this.props._fetchTofixTasks(null, 1, 10);
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
              stats={this.props.stats.stats}
              tofixtasks={this.props.tofixtasks}
              adminAreas={this.props.subregions.adminAreas} />

            <div className='inner'>
              <div className='col--main'>

                <AAExtendedStats
                  fetched={this.props.stats.fetched}
                  fetching={this.props.stats.fetching}
                  bbox={this.props.subregions.bbox || []}
                  error={this.props.stats.error}
                  stats={this.props.stats.stats} />

                <AATofixTasks
                  fetched={this.props.tofixtasks.fetched}
                  fetching={this.props.tofixtasks.fetching}
                  adminAreaName='Philippines'
                  meta={this.props.tofixtasks.data.tasks.meta}
                  tasks={this.props.tofixtasks.data.tasks.results}
                  error={this.props.tofixtasks.error}
                  sliceList />
              </div>

              <div className='col--sec'>
                <AAList
                  fetched={this.props.subregions.fetched}
                  fetching={this.props.subregions.fetching}
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
    _fetchAdminSubregions: () => dispatch(fetchAdminSubregions()),
    _fetchAdminStats: () => dispatch(fetchAdminStats()),
    _fetchTofixTasks: (aaid, page, limit) => dispatch(fetchTofixTasks(aaid, page, limit))
  };
}

module.exports = connect(selector, dispatcher)(Analytics);
