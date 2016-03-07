'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSearchResults, cleanSearchResults } from '../actions/action-creators';
import SiteHeader from '../components/site-header';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    fetchSearchResults: React.PropTypes.func,
    cleanSearchResults: React.PropTypes.func,
    search: React.PropTypes.object,
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div>
        <SiteHeader
          fetchSearchResults={this.props.fetchSearchResults}
          cleanSearchResults={this.props.cleanSearchResults}
          search={this.props.search} />
        <main className='site-body'>
          {this.props.children}
        </main>
      </div>
    );
  }
});

function mapStateToProps (state) {
  return {
    aaStats: state.aaStats,
    subregions: state.adminSubregions,
    search: state.search
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchSearchResults, cleanSearchResults }, dispatch);
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
