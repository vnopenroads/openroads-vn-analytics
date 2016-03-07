'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { fetchAdminSubregions } from '../actions/action-creators';
import AAList from '../components/aa-list';
import AAStats from '../components/aa-stats';
import AAMap from '../components/aa-map';
import PageHeader from '../components/page-header';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    children: React.PropTypes.object,
    subregions: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentDidMount: function () {
    this.props.dispatch(fetchAdminSubregions());
  },

  render: function () {
    return (
      <section className='page'>
        <PageHeader
          pageTitle='OR Philippines' />

        <div className='page__body aa'>

          <div className='aa-main'>
            <div className='inner'>
              <div className='col--sec'>
                <AAMap />
                <AAList
                  adminAreas={this.props.subregions.adminAreas}
                  sliceList />
              </div>
              <div className='col--main'>
                <AAStats />
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
})(Home);
