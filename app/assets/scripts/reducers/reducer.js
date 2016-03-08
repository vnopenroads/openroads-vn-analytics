import _ from 'lodash';
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import * as actions from '../actions/action-types';

const adminSubregions = function (state = {adminAreas: [], fetching: false, fetched: false}, action) {
  switch (action.type) {
    case actions.REQUEST_ADMIN_SUBREGIONS:
      console.log('REQUEST_ADMIN_SUBREGIONS');
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_ADMIN_SUBREGIONS:
      console.log('RECEIVE_ADMIN_SUBREGIONS');
      state = _.cloneDeep(state);
      state = action.json;
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const search = function (state = {results: [], fetching: false, fetched: false, query: '', searching: false}, action) {
  switch (action.type) {
    case actions.REQUEST_SEARCH_RESULTS:
      console.log('REQUEST_SEARCH_RESULTS');
      state = _.cloneDeep(state);
      state.fetching = true;
      state.query = action.query;
      state.searching = true;
      break;
    case actions.RECEIVE_SEARCH_RESULTS:
      console.log('RECEIVE_SEARCH_RESULTS');
      state = _.cloneDeep(state);
      state.results = action.json;
      state.fetching = false;
      break;
    case actions.CLEAN_SEARCH_RESULTS:
      console.log('CLEAN_SEARCH_RESULTS');
      state = _.cloneDeep(state);
      state.results = [];
      state.fetching = false;
      state.fetched = true;
      state.query = '';
      state.searching = false;
      break;
  }
  console.log('state', state);
  return state;
};

const stats = function (state = {fetching: false, fetched: false, data: null}, action) {
  switch (action.type) {
    case actions.REQUEST_ADMIN_STATS:
      console.log('REQUEST_ADMIN_STATS');
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_ADMIN_STATS:
      console.log('RECEIVE_ADMIN_STATS');
      state = _.cloneDeep(state);
      state = action.json;
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

export default combineReducers({
  adminSubregions,
  search,
  stats,
  routing: routeReducer
});
