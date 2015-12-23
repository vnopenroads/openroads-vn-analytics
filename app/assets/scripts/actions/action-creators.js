import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

function requestAdminSubregions () {
  return {
    type: actions.REQUEST_ADMIN_SUBREGIONS
  };
}

function receiveAdminSubregions (json) {
  return {
    type: actions.RECEIVE_ADMIN_SUBREGIONS,
    json: json,
    receivedAt: Date.now()
  };
}

export function fetchAdminSubregions (id = null) {
  return function (dispatch) {
    dispatch(requestAdminSubregions());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    let url = id === null ? `${config.api}/admin/subregions` : `${config.api}/admin/${id}/subregions`;
    console.time('fetch subregions');
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        console.timeEnd('fetch subregions');
        // setTimeout(() => dispatch(receiveAdminSubregions(json)), 2000);
        dispatch(receiveAdminSubregions(json));
      });
      // catch any error in the network call.
  };
}

function requestSearchResults (query) {
  return {
    type: actions.REQUEST_SEARCH_RESULTS,
    query
  };
}

function receiveSearchResults (json) {
  return {
    type: actions.RECEIVE_SEARCH_RESULTS,
    json: json,
    receivedAt: Date.now()
  };
}

export function cleanSearchResults () {
  return {
    type: actions.CLEAN_SEARCH_RESULTS
  };
}

export function fetchSearchResults (searchQuery) {
  return function (dispatch) {
    dispatch(requestSearchResults(searchQuery));

    console.time('fetch search results');
    return fetch(`${config.api}/admin/search/${searchQuery}`)
      .then(response => response.json())
      .then(json => {
        console.timeEnd('fetch search results');
        // setTimeout(() => dispatch(receiveSearchResults(json)), 2000);
        dispatch(receiveSearchResults(json));
      });
      // catch any error in the network call.
  };
}

export function changeStatsTab (tab) {
  return {
    type: actions.CHANGE_AA_STATS_TAB,
    tab
  };
}
