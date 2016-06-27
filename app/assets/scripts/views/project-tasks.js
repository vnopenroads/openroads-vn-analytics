'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import ReactPaginate from 'react-paginate';
import { fetchProjectTasks, fetchAdminSubregions, fetchRoadNetworkStatus } from '../actions/action-creators';
import PageHeader from '../components/page-header';

var ProjectTasks = React.createClass({
  displayName: 'ProjectTasks',

  propTypes: {
    children: React.PropTypes.object,
    _fetchProjectTasks: React.PropTypes.func,
    _fetchAdminSubregions: React.PropTypes.func,
    _fetchRoadNetworkStatus: React.PropTypes.func,
    _push: React.PropTypes.func,
    subregions: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    roadNetworkStatus: React.PropTypes.object,
    projecttasks: React.PropTypes.object
  },

  perPage: 20,

  getPage: function () {
    let page = this.props.location.query.page;
    page = isNaN(page) || page < 1 ? 1 : page;
    return page;
  },

  getTotalPages: function () {
    console.log('this.props.projecttasks', this.props.projecttasks);
    let {total, limit} = this.props.projecttasks.data.projecttasks.meta;
    return Math.ceil(total / limit);
  },

  componentDidMount: function () {
    console.log('this.props.params.aaId', this.props.params.aaId);
    this.props._fetchAdminSubregions(this.props.params.aaId || null);
    this.props._fetchProjectTasks(this.props.params.aaId || null, this.getPage(), this.perPage);
    this.props._fetchRoadNetworkStatus(this.props.params.aaId || null);
  },

  componentDidUpdate: function (prevProps, prevState) {
    console.group('ProjectTasks componentDidUpdate');
    if (this.props.params.aaId !== prevProps.params.aaId) {
      console.log('aaId changed');
      if (!this.props.subregions.fetching) {
        console.log('update subregions');
        this.props._fetchAdminSubregions(this.props.params.aaId);
        this.props._fetchRoadNetworkStatus(this.props.params.aaId);
      }
      if (!this.props.projecttasks.fetching) {
        console.log('update tofixtasks');
        this.props._fetchProjectTasks(this.props.params.aaId, this.getPage(), this.perPage);
      }
    } else if (this.props.location.query.page && this.getPage() !== prevProps.location.query.page) {
      console.log('page changed');
      this.props._fetchProjectTasks(this.props.params.aaId, this.getPage(), this.perPage);
    } else {
      console.log('NOT update');
    }
    console.groupEnd('ProjectTasks componentDidUpdate');
  },

  handlePageClick: function (d) {
    let url = `analytics/${this.props.subregions.id}/projecttasks?page=${d.selected + 1}`;
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

  renderContent: function () {
    let someFething = this.props.subregions.fetching || this.props.projecttasks.fetching;
    let data = this.props.projecttasks.data.projecttasks;
    let content;
    if (someFething) {
      content = (
        <ul className='loading-placeholder'>
          <li className='aa-tofixtasks__wrapper'><p>&nbsp;</p></li>
          <li className='aa-tofixtasks__wrapper'><p>&nbsp;</p></li>
          <li className='aa-tofixtasks__wrapper'><p>&nbsp;</p></li>
        </ul>
      );
    } else if (data.error) {
      content = <p className='aa-tofixtasks--empty'>Oops... An error occurred.</p>;
    } else if (!data.meta.total) {
      content = <p className='aa-tofixtasks--empty'>Nothing to show.</p>;
    }

    if (content) {
      return <div className='aa-tofixtasks__contents'>{content}</div>;
    }

    return (
      <div className='aa-tofixtasks__contents'>
        <ul>
          {data.results.map(o => {
            let projectType = o.type.replace(' ', '-').toLowerCase();
            return (
              <li key={o.id}>
                <Link to={`editor/bbox=${o.bbox.join('/')}&overlays=${projectType}`} className='aa-tofixtasks__wrapper'>
                  <p>Missing Road for project <strong>{o.id}</strong></p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },

  renderList: function () {
    let allFetched = this.props.subregions.fetched && this.props.projecttasks.fetched;
    let someFething = this.props.subregions.fetching || this.props.projecttasks.fetching;

    if (!allFetched && !someFething) {
      return null;
    }

    let title = 'Missing Roads';
    if (allFetched && !someFething && this.props.projecttasks.data.projecttasks.meta.total) {
      title += ` (${this.props.projecttasks.data.projecttasks.meta.total})`;
    }
    return (
      <div className='aa-tofixtasks'>
        <h2 className='aa-tofixtasks__title'>{title}</h2>
        {this.renderContent()}
      </div>
    );
  },

  renderPagination: function () {
    // Only show pagination after EVERYTHING has loaded.
    let {fetched: tasksFetched, fetching: tasksFetching, error} = this.props.projecttasks;
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
    projecttasks: state.projecttasks,
    roadNetworkStatus: state.roadNetworkStatus
  };
}

function dispatcher (dispatch) {
  return {
    _fetchAdminSubregions: (aaid) => dispatch(fetchAdminSubregions(aaid)),
    _fetchProjectTasks: (aaid, page, limit) => dispatch(fetchProjectTasks(aaid, page, limit)),
    _fetchRoadNetworkStatus: (aaid) => dispatch(fetchRoadNetworkStatus(aaid)),
    _push: (loation) => dispatch(push(loation))
  };
}

module.exports = connect(selector, dispatcher)(ProjectTasks);
