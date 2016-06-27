'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions, fetchAdminStats, fetchTofixTasks, fetchProjects, fetchProjectTasks, fetchRoadNetworkStatus } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import AAList from '../components/aa-list';
import AAStats from '../components/aa-stats';
import AAExtendedStats from '../components/aa-extended-stats';
import AAMap from '../components/aa-map';
import AAProjects from '../components/project-list';
import AAErrors from '../components/aa-errors';

var AnalyticsAA = React.createClass({
  displayName: 'AnalyticsAA',

  propTypes: {
    children: React.PropTypes.object,
    _fetchAdminSubregions: React.PropTypes.func,
    _fetchAdminStats: React.PropTypes.func,
    _fetchTofixTasks: React.PropTypes.func,
    _fetchProjectTasks: React.PropTypes.func,
    _fetchRoadNetworkStatus: React.PropTypes.func,
    _fetchProjects: React.PropTypes.func,
    subregions: React.PropTypes.object,
    stats: React.PropTypes.object,
    tofixtasks: React.PropTypes.object,
    projecttasks: React.PropTypes.object,
    projects: React.PropTypes.object,
    roadNetworkStatus: React.PropTypes.object,
    params: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchAdminSubregions(this.props.params.aaId);
    this.props._fetchAdminStats(this.props.params.aaId);
    this.props._fetchTofixTasks(this.props.params.aaId, 1, 10);
    this.props._fetchProjectTasks(this.props.params.aaId, 1, 10);
    this.props._fetchProjects(this.props.params.aaId, 1, 10);
    this.props._fetchRoadNetworkStatus(this.props.params.aaId);
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.params.aaId !== prevProps.params.aaId && !this.props.subregions.fetching) {
      console.log('AnalyticsAA componentDidUpdate', 'update');
      this.props._fetchAdminSubregions(this.props.params.aaId);
      this.props._fetchAdminStats(this.props.params.aaId);
      this.props._fetchTofixTasks(this.props.params.aaId, 1, 10);
      this.props._fetchProjectTasks(this.props.params.aaId, 1, 10);
      this.props._fetchProjects(this.props.params.aaId, 1, 10);
      this.props._fetchRoadNetworkStatus(this.props.params.aaId);
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
          roadNetworkStatus={this.props.roadNetworkStatus}
          bbox={this.props.subregions.bbox || []} />

        <div className='page__body aa'>
          <div className='aa-main'>
            <AAMap
              bbox={this.props.subregions.bbox} />

            <AAStats
              stats={this.props.stats.stats}
              tofixtasks={this.props.tofixtasks}
              projecttasks={this.props.projecttasks}
              adminAreas={this.props.subregions.adminAreas}
              projects={this.props.projects} />

            <div className='inner'>
              <div className='col--main'>

                <AAExtendedStats
                  fetched={this.props.stats.fetched}
                  fetching={this.props.stats.fetching}
                  adminAreaId={this.props.stats.id}
                  bbox={this.props.subregions.bbox || []}
                  error={this.props.stats.error}
                  stats={this.props.stats.stats} />

                <AAErrors
                  adminAreaId={this.props.stats.id}
                  tofixtasks={this.props.tofixtasks}
                  projecttasks={this.props.projecttasks} />

                <AAProjects
                  fetched={this.props.projects.fetched}
                  fetching={this.props.projects.fetching}
                  adminAreaId={Number(this.props.projects.data.id)}
                  adminAreaName={this.props.projects.data.name}
                  meta={this.props.projects.data.projects.meta}
                  projects={this.props.projects.data.projects.results}
                  error={this.props.projects.error}
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
    tofixtasks: state.tofixtasks,
    projecttasks: state.projecttasks,
    projects: state.projects,
    roadNetworkStatus: state.roadNetworkStatus
  };
}

function dispatcher (dispatch) {
  return {
    _fetchAdminSubregions: (aaid) => dispatch(fetchAdminSubregions(aaid)),
    _fetchAdminStats: (aaid) => dispatch(fetchAdminStats(aaid)),
    _fetchTofixTasks: (aaid, page, limit) => dispatch(fetchTofixTasks(aaid, page, limit)),
    _fetchProjectTasks: (aaid, page, limit) => dispatch(fetchProjectTasks(aaid, page, limit)),
    _fetchProjects: (aaid, page, limit) => dispatch(fetchProjects(aaid, page, limit)),
    _fetchRoadNetworkStatus: (aaid) => dispatch(fetchRoadNetworkStatus(aaid))
  };
}

module.exports = connect(selector, dispatcher)(AnalyticsAA);
