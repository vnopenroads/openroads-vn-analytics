import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                       ADMIN SUBREGIONS                        //
// ////////////////////////////////////////////////////////////////

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

// ////////////////////////////////////////////////////////////////
//                        SEARCH RESULTS                         //
// ////////////////////////////////////////////////////////////////

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

// ////////////////////////////////////////////////////////////////
//                         ADMIN STATS                           //
// ////////////////////////////////////////////////////////////////

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

// ////////////////////////////////////////////////////////////////
//                          WAYTASKS                             //
// ////////////////////////////////////////////////////////////////

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

// ////////////////////////////////////////////////////////////////
//                        PROJECT TASKS                          //
// ////////////////////////////////////////////////////////////////

function requestProjectTasks () {
  return {
    type: actions.REQUEST_PROJECT_TASKS
  };
}

function receiveProjectTasks (json, error = null) {
  return {
    type: actions.RECEIVE_PROJECT_TASKS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchProjectTasks (aaid = null, page, limit) {
  return function (dispatch) {
    dispatch(requestProjectTasks());

    // Note: `page` is 0 based, so subtract 1.
    let url = aaid === null
      ? `${config.api}/admin/0/projecttasks?page=${--page}&limit=${limit}`
      : `${config.api}/admin/${aaid}/projecttasks?page=${--page}&limit=${limit}`;
    return fetch(url)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        // setTimeout(() => dispatch(receiveProjectTasks(json)), 2000);
        return dispatch(receiveProjectTasks(json));
      }, e => {
        console.log('e', e);
        return dispatch(receiveProjectTasks(null, 'Data not available'));
      });
  };
}

// ////////////////////////////////////////////////////////////////
//                       LIST OF PROJECTS                        //
// ////////////////////////////////////////////////////////////////

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

export function fetchProjects (aaid = null, page, limit, filters) {
  return function (dispatch) {
    dispatch(requestProjects());
    let qs = [];
    _.forEach(filters, (v, k) => {
      if (v && v !== '--') {
        qs.push(`${k}=${v}`);
      }
    });

    // Note: `page` is 0 based, so subtract 1.
    let url = aaid === null
      ? `${config.api}/admin/0/projects?page=${--page}&limit=${limit}`
      : `${config.api}/admin/${aaid}/projects?page=${--page}&limit=${limit}`;

    if (qs.length) {
      url += '&' + qs.join('&');
    }
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

// ////////////////////////////////////////////////////////////////
//                         PROJECT META                          //
// ////////////////////////////////////////////////////////////////

function requestProjectsMeta () {
  return {
    type: actions.REQUEST_PROJECTS_META
  };
}

function receiveProjectsMeta (json, error = null) {
  return {
    type: actions.RECEIVE_PROJECTS_META,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchProjectsMeta () {
  return function (dispatch) {
    dispatch(requestProjectsMeta());

    return fetch(`${config.api}/meta/projects`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        // setTimeout(() => dispatch(receiveProjects(json)), 2000);
        return dispatch(receiveProjectsMeta(json));
      }, e => {
        console.log('e', e);
        return dispatch(receiveProjectsMeta(null, 'Data not available'));
      });
  };
}
