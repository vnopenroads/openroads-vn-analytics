'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchAdminSubregions, fetchRoadNetworkStatus } from '../actions/action-creators';
import AAList from '../components/aa-list';
import PageHeader from '../components/page-header';

var AdminAreas = React.createClass({
  displayName: 'AdminAreas',

  propTypes: {
    children: React.PropTypes.object,
    _fetchAdminSubregions: React.PropTypes.func,
    _fetchRoadNetworkStatus: React.PropTypes.func,
    subregions: React.PropTypes.object,
    roadNetworkStatus: React.PropTypes.object,
    params: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props._fetchAdminSubregions(this.props.params.aaId || null);
    this.props._fetchRoadNetworkStatus(this.props.params.aaId || null);
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.params.aaId !== prevProps.params.aaId && !this.props.subregions.fetching) {
      console.log('AdminAreas componentDidUpdate', 'update');
      this.props._fetchAdminSubregions(this.props.params.aaId);
      this.props._fetchRoadNetworkStatus(this.props.params.aaId);
    } else {
      console.log('AdminAreas componentDidUpdate', 'NOT update');
    }
  },

  renderPageHeader: function () {
    return (
      <PageHeader
        adminAreaId={this.props.subregions.id}
        pageTitle={this.props.subregions.name}
        roadNetworkStatus={this.props.roadNetworkStatus}
        bbox={this.props.subregions.bbox || []} />
    );
  },

  renderBackLink: function () {
    return (
      <Link to={`/analytics/${this.props.subregions.id}`}>Back to overview</Link>
    );
  },

  renderList: function () {
    return (
      <AAList
        fetched={this.props.subregions.fetched}
        fetching={this.props.subregions.fetching}
        adminAreaId={this.props.subregions.id}
        adminAreaName={this.props.subregions.name}
        adminAreas={this.props.subregions.adminAreas}/>
    );
  },

  render: function () {
    return (
      <section className='page page--list-solo'>
        {this.renderPageHeader()}

        <div className='page__body aa'>
          <div className='aa-main'>
            <div className='inner'>
              <div className='col--main'>
                {this.renderBackLink()}
                {this.renderList()}
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
    roadNetworkStatus: state.roadNetworkStatus
  };
}

function dispatcher (dispatch) {
  return {
    _fetchAdminSubregions: (aaid) => dispatch(fetchAdminSubregions(aaid)),
    _fetchRoadNetworkStatus: (aaid) => dispatch(fetchRoadNetworkStatus(aaid))
  };
}

module.exports = connect(selector, dispatcher)(AdminAreas);
