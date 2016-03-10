'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchAdminSubregions } from '../actions/action-creators';
import AAList from '../components/aa-list';
import PageHeader from '../components/page-header';

var AdminAreas = React.createClass({
  displayName: 'AdminAreas',

  propTypes: {
    children: React.PropTypes.object,
    subregions: React.PropTypes.object,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentDidMount: function () {
    this.props.dispatch(fetchAdminSubregions(this.props.params.aaId || null));
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.params.aaId !== prevProps.params.aaId && !this.props.subregions.fetching) {
      console.log('AdminAreas componentDidUpdate', 'update');
      this.props.dispatch(fetchAdminSubregions(this.props.params.aaId));
    } else {
      console.log('AdminAreas componentDidUpdate', 'NOT update');
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
      return (
        <AAList
          adminAreaId={this.props.subregions.id}
          adminAreaName={this.props.subregions.name}
          adminAreas={this.props.subregions.adminAreas}/>
      );
    }

    return (
      <AAList
        adminAreas={this.props.subregions.adminAreas} />
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
    subregions: state.adminSubregions
  };
})(AdminAreas);
