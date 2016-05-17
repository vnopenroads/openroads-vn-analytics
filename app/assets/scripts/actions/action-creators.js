import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// let mock = require('../mock/1611254000.json');
// let mockToFix = require('../mock/tofix.json');

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

function requestAdminStats () {
  return {
    type: actions.REQUEST_ADMIN_STATS
  };
}

function receiveAdminStats (json, error = null) {
  return {
    type: actions.RECEIVE_ADMIN_STATS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchAdminStats (id = null) {
  return function (dispatch) {
    dispatch(requestAdminStats());
    // return dispatch(receiveAdminStats(mock));

    // TODO swap this out with real url once endpoint is ready
    let url = id === null ? `${config.api}/admin/0/stats` : `${config.api}/admin/${id}/stats`;
    return fetch(url)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        dispatch(receiveAdminStats(json));
      }, e => {
        console.log('e', e);
        return dispatch(receiveAdminStats(null, 'Data not available'));
      });
  };
}

function requestTofixTasks () {
  return {
    type: actions.REQUEST_TOFIX_TASKS
  };
}

function receiveTofixTasks (json, error = null) {
  return {
    type: actions.RECEIVE_TOFIX_TASKS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchTofixTasks (aaid = null, page, limit) {
  return function (dispatch) {
    dispatch(requestTofixTasks());

    // Note: `page` is 0 based, so subtract 1.
    let url = aaid === null
      ? `${config.api}/admin/0/waytasks?page=${--page}&limit=${limit}`
      : `${config.api}/admin/${aaid}/waytasks?page=${--page}&limit=${limit}`;
    return fetch(url)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        // setTimeout(() => dispatch(receiveTofixTasks(json)), 2000);
        return dispatch(receiveTofixTasks(json));
      }, e => {
        console.log('e', e);
        return dispatch(receiveTofixTasks(null, 'Data not available'));
      });
  };
}

function requestProjects () {
  return {
    type: actions.REQUEST_PROJECTS
  };
}

function receiveProjects (json, error = null) {
  return {
    type: actions.RECEIVE_PROJECTS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchProjects (aaid = null, page, limit) {
  return function (dispatch) {
    dispatch(requestProjects());

    // Note: `page` is 0 based, so subtract 1.
    let url = aaid === null
      ? `${config.api}/admin/0/projects?page=${--page}&limit=${limit}`
      : `${config.api}/admin/${aaid}/projects?page=${--page}&limit=${limit}`;
    return fetch(url)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        // setTimeout(() => dispatch(receiveProjects(json)), 2000);
        return dispatch(receiveProjects(json));
      }, e => {
        console.log('e', e);
        return dispatch(receiveProjects(null, 'Data not available'));
      });
  };
}
