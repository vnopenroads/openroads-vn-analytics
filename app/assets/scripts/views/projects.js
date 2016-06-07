'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import ReactPaginate from 'react-paginate';
import { fetchProjects, fetchAdminSubregions } from '../actions/action-creators';
import AAProjects from '../components/project-list';
import PageHeader from '../components/page-header';

var Projects = React.createClass({
  displayName: 'Projects',

  propTypes: {
    children: React.PropTypes.object,
    _fetchProjects: React.PropTypes.func,
    _fetchAdminSubregions: React.PropTypes.func,
    _push: React.PropTypes.func,
    subregions: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    projects: React.PropTypes.object
  },

  perPage: 20,

  getPage: function () {
    let page = this.props.location.query.page;
    page = isNaN(page) || page < 1 ? 1 : page;
    return page;
  },

  getTotalPages: function () {
    let {total, limit} = this.props.projects.data.projects.meta;
    return Math.ceil(total / limit);
  },

  componentDidMount: function () {
    console.log('this.props.params.aaId', this.props.params.aaId);
    this.props._fetchAdminSubregions(this.props.params.aaId || null);
    this.props._fetchProjects(this.props.params.aaId || null, this.getPage(), this.perPage);
  },

  componentDidUpdate: function (prevProps, prevState) {
    console.group('Projects componentDidUpdate');
    if (this.props.params.aaId !== prevProps.params.aaId) {
      console.log('aaId changed');
      if (!this.props.subregions.fetching) {
        console.log('update subregions');
        this.props._fetchAdminSubregions(this.props.params.aaId);
      }
      if (!this.props.projects.fetching) {
        console.log('update projects');
        this.props._fetchProjects(this.props.params.aaId, this.getPage(), this.perPage);
      }
    } else if (this.props.location.query.page && this.getPage() !== prevProps.location.query.page) {
      console.log('page changed');
      this.props._fetchProjects(this.props.params.aaId, this.getPage(), this.perPage);
    } else {
      console.log('NOT update');
    }
    console.groupEnd('Projects componentDidUpdate');
  },

  handlePageClick: function (d) {
    let url = `analytics/${this.props.subregions.id}/projects?page=${d.selected + 1}`;
    this.props._push(url);
  },

  renderPageHeader: function () {
    return (
      <PageHeader
        adminAreaId={this.props.subregions.id}
        pageTitle={this.props.subregions.name}
        bbox={this.props.subregions.bbox || []} />
    );
  },

  renderBackLink: function () {
    return (
      <Link to={`/analytics/${this.props.subregions.id}`}>Back to overview</Link>
    );
  },

  renderList: function () {
    let allFetched = this.props.subregions.fetched && this.props.projects.fetched;
    let someFething = this.props.subregions.fetching || this.props.projects.fetching;

    return (
      <AAProjects
        fetched={allFetched}
        fetching={someFething}
        adminAreaId={Number(this.props.projects.data.id)}
        adminAreaName={this.props.projects.data.name}
        meta={this.props.projects.data.projects.meta}
        projects={this.props.projects.data.projects.results}
        error={this.props.projects.error} />
    );
  },

  renderPagination: function () {
    // Only show pagination after EVERYTHING has loaded.
    let {fetched: projectsFetched, fetching: projectsFetching, error} = this.props.projects;
    let {fetched: regFetched, fetching: regFetching} = this.props.subregions;

    let allFetched = projectsFetched && regFetched;
    let someFething = projectsFetching || regFetching;

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
    projects: state.projects
  };
}

function dispatcher (dispatch) {
  return {
    _fetchAdminSubregions: (aaid) => dispatch(fetchAdminSubregions(aaid)),
    _fetchProjects: (aaid, page, limit) => dispatch(fetchProjects(aaid, page, limit)),
    _push: (loation) => dispatch(push(loation))
  };
}

module.exports = connect(selector, dispatcher)(Projects);
