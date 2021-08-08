'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  compose,
  withContext
} from 'recompose';
import { fetchSearchResults, cleanSearchResults } from '../actions/action-creators';

import SiteHeader from '../components/site-header';
import ConfirmationPrompt from '../components/confirmation-prompt';


class App extends React.Component {
  render() {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');
    return (
      <div className={'site-canvas-inner ' + pageClass}>
        <SiteHeader />

        <main className='site-body'>
          {this.props.children}
        </main>

        <ConfirmationPrompt />
      </div>
    );
  }
};

App.propTypes = {
  _fetchSearchResults: PropTypes.func,
  _cleanSearchResults: PropTypes.func,
  search: PropTypes.object,
  routes: PropTypes.array,
  children: PropTypes.object,
  location: PropTypes.object
};

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
    { language: PropTypes.string },
    ({ params: { lang: language } }) => ({ language })
  )
)(App);
