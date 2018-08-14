'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  compose,
  withContext
} from 'recompose';
import { fetchSearchResults, cleanSearchResults } from '../actions/action-creators';

import SiteHeader from '../components/site-header';
import ConfirmationPrompt from '../components/confirmation-prompt';


var App = React.createClass({
  displayName: 'App',

  propTypes: {
    _fetchSearchResults: React.PropTypes.func,
    _cleanSearchResults: React.PropTypes.func,
    search: React.PropTypes.object,
    routes: React.PropTypes.array,
    children: React.PropTypes.object,
    location: React.PropTypes.object
  },

  render: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');
    return (
      <div className={'site-canvas-inner ' + pageClass}>
        <SiteHeader/>

        <main className='site-body'>
          {this.props.children}
        </main>

        <ConfirmationPrompt />
      </div>
    );
  }
});


export default compose(
  connect(
    state => ({
      subregions: state.adminSubregions,
      search: state.search
    }),
    dispatch => ({
      _fetchSearchResults: (query) => dispatch(fetchSearchResults(query)),
      _cleanSearchResults: () => dispatch(cleanSearchResults())
    })
  ),
  withContext(
    { language: React.PropTypes.string },
    ({ params: { lang: language } }) => ({ language })
  )
)(App);
