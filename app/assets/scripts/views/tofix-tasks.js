'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import ReactPaginate from 'react-paginate';
import { fetchTofixTasks, fetchAdminSubregions, fetchRoadNetworkStatus } from '../actions/action-creators';
import AATofixTasks from '../components/aa-tofix-tasks';
import PageHeader from '../components/page-header';

var TofixTasks = React.createClass({
  displayName: 'TofixTasks',

  propTypes: {
    children: React.PropTypes.object,
    _fetchTofixTasks: React.PropTypes.func,
    _fetchAdminSubregions: React.PropTypes.func,
    _fetchRoadNetworkStatus: React.PropTypes.func,
    _push: React.PropTypes.func,
    subregions: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    roadNetworkStatus: React.PropTypes.object,
    tofixtasks: React.PropTypes.object
  },

  perPage: 20,

  getPage: function () {
    let page = this.props.location.query.page;
    page = isNaN(page) || page < 1 ? 1 : page;
    return page;
  },

  getTotalPages: function () {
    let {total, limit} = this.props.tofixtasks.data.tasks.meta;
    return Math.ceil(total / limit);
  },

  componentDidMount: function () {
    console.log('this.props.params.aaId', this.props.params.aaId);
    this.props._fetchAdminSubregions(this.props.params.aaId || null);
    this.props._fetchTofixTasks(this.props.params.aaId || null, this.getPage(), this.perPage);
    this.props._fetchRoadNetworkStatus(this.props.params.aaId || null);
  },

  componentDidUpdate: function (prevProps, prevState) {
    console.group('TofixTasks componentDidUpdate');
    if (this.props.params.aaId !== prevProps.params.aaId) {
      console.log('aaId changed');
      if (!this.props.subregions.fetching) {
        console.log('update subregions');
        this.props._fetchAdminSubregions(this.props.params.aaId);
        this.props._fetchRoadNetworkStatus(this.props.params.aaId);
      }
      if (!this.props.tofixtasks.fetching) {
        console.log('update tofixtasks');
        this.props._fetchTofixTasks(this.props.params.aaId, this.getPage(), this.perPage);
      }
    } else if (this.props.location.query.page && this.getPage() !== prevProps.location.query.page) {
      console.log('page changed');
      this.props._fetchTofixTasks(this.props.params.aaId, this.getPage(), this.perPage);
    } else {
      console.log('NOT update');
    }
    console.groupEnd('TofixTasks componentDidUpdate');
  },

  handlePageClick: function (d) {
    let url = `analytics/${this.props.subregions.id}/tasks?page=${d.selected + 1}`;
    this.props._push(url);
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
    let allFetched = this.props.subregions.fetched && this.props.tofixtasks.fetched;
    let someFething = this.props.subregions.fetching || this.props.tofixtasks.fetching;

    return (
      <AATofixTasks
        fetched={allFetched}
        fetching={someFething}
        adminAreaId={Number(this.props.tofixtasks.data.id)}
        adminAreaName={this.props.tofixtasks.data.name}
        meta={this.props.tofixtasks.data.tasks.meta}
        tasks={this.props.tofixtasks.data.tasks.results}
        error={this.props.tofixtasks.error} />
    );
  },

  renderPagination: function () {
    // Only show pagination after EVERYTHING has loaded.
    let {fetched: tasksFetched, fetching: tasksFetching, error} = this.props.tofixtasks;
    let {fetched: regFetched, fetching: regFetching} = this.props.subregions;

    let allFetched = tasksFetched && regFetched;
    let someFething = tasksFetching || regFetching;

    if (this.getTotalPages() <= 1 || error || !allFetched || someFething) {
      return null;
    }

    return (
      <ReactPaginate previousLabel={<span>previous</span>}
        nextLabel={<span>next</span>}
        breakLabel={<span className='pages__page'>...</span>}
        pageNum={this.getTotalPages()}
        forceSelected={this.getPage() - 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        clickCallback={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages'}
        pageClassName={'pages__wrapper'}
        pageLinkClassName={'pages__page'}
        activeClassName={'active'} />
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
                {this.renderPagination()}
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
    tofixtasks: state.tofixtasks,
    roadNetworkStatus: state.roadNetworkStatus
  };
}

function dispatcher (dispatch) {
  return {
    _fetchAdminSubregions: (aaid) => dispatch(fetchAdminSubregions(aaid)),
    _fetchTofixTasks: (aaid, page, limit) => dispatch(fetchTofixTasks(aaid, page, limit)),
    _fetchRoadNetworkStatus: (aaid) => dispatch(fetchRoadNetworkStatus(aaid)),
    _push: (loation) => dispatch(push(loation))
  };
}

module.exports = connect(selector, dispatcher)(TofixTasks);
