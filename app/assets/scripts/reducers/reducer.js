import _ from 'lodash';
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import * as actions from '../actions/action-types';

const adminSubregions = function (state = {adminAreas: [], fetching: false}, action) {
  state = _.cloneDeep(state);

  switch (action.type) {
    case actions.REQUEST_ADMIN_SUBREGIONS:
      console.log('REQUEST_ADMIN_SUBREGIONS');
      state.fetching = true;
      break;
    case actions.RECEIVE_ADMIN_SUBREGIONS:
      console.log('RECEIVE_ADMIN_SUBREGIONS');
      state = action.json;
      state.fetching = false;
      break;
  }
  return state;
};

const search = function (state = {results: [], fetching: false, query: '', searching: false}, action) {
  state = _.cloneDeep(state);

  switch (action.type) {
    case actions.REQUEST_SEARCH_RESULTS:
      console.log('REQUEST_SEARCH_RESULTS');
      state.fetching = true;
      state.query = action.query;
      state.searching = true;
      break;
    case actions.RECEIVE_SEARCH_RESULTS:
      console.log('RECEIVE_SEARCH_RESULTS');
      state.results = action.json;
      state.fetching = false;
      break;
    case actions.CLEAN_SEARCH_RESULTS:
      console.log('CLEAN_SEARCH_RESULTS');
      state.results = [];
      state.fetching = false;
      state.query = '';
      state.searching = false;
      break;
  }
  console.log('state', state);
  return state;
};

export default combineReducers({
  adminSubregions,
  search,
  routing: routeReducer
});
