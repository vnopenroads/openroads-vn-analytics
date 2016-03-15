'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// import ReactPaginate from 'react-paginate';
import { fetchTofixTasks } from '../actions/action-creators';
import AATofixTasks from '../components/aa-tofix-tasks';
import PageHeader from '../components/page-header';

var TofixTasks = React.createClass({
  displayName: 'TofixTasks',

  propTypes: {
    children: React.PropTypes.object,
    subregions: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  getPage: function () {
    let page = this.props.location.query.page;
    page = isNaN(page) || page < 1 ? 1 : page;
    return page;
  },

  componentDidMount: function () {
    this.props.dispatch(fetchTofixTasks(this.props.params.aaId || null, this.getPage()));
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.params.aaId !== prevProps.params.aaId && !this.props.subregions.fetching) {
      console.log('TofixTasks componentDidUpdate', 'update');
      this.props.dispatch(fetchTofixTasks(this.props.params.aaId, this.getPage()));
    } else {
      console.log('TofixTasks componentDidUpdate', 'NOT update');
    }
  },

  renderPageHeader: function () {
    if (this.props.subregions.id) {
      return (
        <PageHeader
          adminAreaId={this.props.subregions.id}
          pageTitle={this.props.subregions.name}
          actions />
      );
    }

    return (
      <PageHeader
        pageTitle='Philippines' />
    );
  },

  renderBackLink: function () {
    console.log('this.props.subregions', this.props.subregions);
    if (this.props.subregions.id) {
      return (
        <Link to={`/analytics/${this.props.subregions.id}`}>Back to overview</Link>
      );
    }
    return (
      <Link to='/'>Back to overview</Link>
    );
  },

  renderList: function () {
    if (this.props.subregions.id) {
      return (null);
    }

    return (
      <AATofixTasks
        fetched={this.props.tofixtasks.fetched}
        fetching={this.props.tofixtasks.fetching}
        tasks={this.props.tofixtasks.data}/>
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

module.exports = connect(state => {
  return {
    subregions: state.adminSubregions,
    tofixtasks: state.tofixtasks
  };
})(TofixTasks);
