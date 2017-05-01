'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions, fetchAdminStats, fetchTofixTasks, fetchProjects, fetchProjectTasks, fetchRoadNetworkStatus } from '../actions/action-creators';


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
        <div className='page__body aa'>
          <div className='aa-main'>
            NEW ANALYTICS PAGE
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
