import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                       ADMIN SUBREGIONS                        //
// ////////////////////////////////////////////////////////////////

function requestAdmins () {
  return {
    type: actions.REQUEST_ADMINS
  };
}

function receiveAdmins (json) {
  return {
    type: actions.RECEIVE_ADMINS,
    json: json,
    receivedAt: Date.now()
  };
}

export function fetchAdmins (id = null) {
  return function (dispatch) {
    dispatch(requestAdmins());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    let url = `${config.api}/admin/units?name=${id}&limit=10`;
    console.log(url);
    console.time('fetch subregions');
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        console.timeEnd('fetch subregions');
        dispatch(receiveAdmins(json));
      });
      // catch any error in the network call.
  };
}

export function clearAdmins () {
  return {
    type: actions.CLEAR_ADMINS
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

// ////////////////////////////////////////////////////////////////
//                         ROAD NETWORK                          //
// ////////////////////////////////////////////////////////////////

function requestRoadNetworkStatus () {
  return {
    type: actions.REQUEST_ROAD_NETWORK_STATUS
  };
}

function receiveRoadNetworkStatus (json, error = null) {
  return {
    type: actions.RECEIVE_ROAD_NETWORK_STATUS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchRoadNetworkStatus (id = null) {
  return function (dispatch) {
    dispatch(requestRoadNetworkStatus());

    let url = id === null ? `${config.api}/admin/0?roadNetwork=true` : `${config.api}/admin/${id}?roadNetwork=true`;
    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log('json', json);

        if (json.statusCode === 400 && json.message.match(/greater than maximum/)) {
          return {dataAvailable: false};
        } else if (json.statusCode > 400) {
          throw new Error('Bad response');
        }
        return {dataAvailable: true};
      })
      .then(json => {
        // setTimeout(() => dispatch(receiveRoadNetworkStatus(json)), 2000);
        return dispatch(receiveRoadNetworkStatus(json));
      }, e => {
        console.log('e', e);
        return dispatch(receiveRoadNetworkStatus(null, 'Data not available'));
      });
  };
}

// ////////////////////////////////////////////////////////////////
//                         VProMMS IDs                           //
// ////////////////////////////////////////////////////////////////

function requestVProMMSids () {
  return {
    type: actions.REQUEST_VPROMMS_IDS
  };
}

function receiveVProMMSids (json, error = null) {
  return {
    type: actions.RECEIVE_VPROMMS_IDS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchVProMMsids (use) {
  return function (dispatch) {
    dispatch(requestVProMMSids());
    const route = use === 'search' ? '/ids' : '/properties?keys=iri_mean,rs_url';
    let url = `${config.api}${route}`;
    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.statusCode === 400) {
          return {dataAvailable: false};
        } else if (json.statusCode > 400) {
          throw new Error('Bad response');
        }
        dispatch(receiveVProMMSids(json));
      });
  };
}

// ////////////////////////////////////////////////////////////////
//                         Explore Map                           //
// ////////////////////////////////////////////////////////////////

export function selectExploreMapLayer (layer) {
  return {
    type: actions.SELECT_EXPLORE_MAP_LAYER,
    layer
  };
}

export function exploreMapShowNoVpromms (bool) {
  return {
    type: actions.EXPLORE_MAP_SHOW_NO_VPROMMS,
    bool
  };
}

// ////////////////////////////////////////////////////////////////
//                              Set Zoom                         //
// ////////////////////////////////////////////////////////////////

export function setGlobalZoom (zoomSource) {
  let json;
  if (typeof zoomSource === 'string') {
    zoomSource = zoomSource.split(/map=/)[1].split(/&/)[0].split('/');
    json = {
      z: Number(zoomSource[0]),
      x: Number(zoomSource[1]),
      y: Number(zoomSource[2])
    };
  } else {
    json = {
      z: zoomSource.zoom,
      x: zoomSource.lng,
      y: zoomSource.lat
    };
  }
  return {
    type: actions.SET_GLOBAL_ZOOM,
    json: json
  };
}

function requestVProMMsBbox () {
  return {
    type: actions.REQUEST_VPROMMS_BBOX
  };
}

function recieveVProMMsBbox (json) {
  return {
    type: actions.RECIEVE_VPROMMS_BBOX,
    json: json
  };
}
export function fetchVProMMsBbox (vprommsId) {
  return function (dispatch) {
    dispatch(requestVProMMsBbox());
    let url = `${config.api}/way/${vprommsId}/bbox`;
    return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(json => {
      if (json.statusCode === 400) {
        return {dataAvailable: false};
      } else if (json.statusCode > 400) {
        throw new Error('Bad response');
      }
      dispatch(recieveVProMMsBbox(json));
    });
  };
}

function requestAdminBbox () {
  return {
    type: actions.REQUEST_ADMIN_BBOX
  };
}

function receiveAdminBbox (json) {
  return {
    type: actions.RECEIVE_ADMIN_BBOX,
    json: json
  };
}

export function fetchAdminBbox (id) {
  return function (dispatch) {
    dispatch(requestAdminBbox());
    let url = `${config.api}/admin/${id}/info`;
    return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(json => {
      if (json.statusCode === 400) {
        return { dataAvailable: false };
      } else if (json.statusCode > 400) {
        throw new Error('Bad response');
      }
      dispatch(receiveAdminBbox(json));
    });
  };
}

// ////////////////////////////////////////////////////////////////
//                             Search                            //
// ////////////////////////////////////////////////////////////////

export function showSearch (bool) {
  return {
    type: actions.DISPLAY_SEARCH,
    bool: bool
  };
}

export function showSearchResults (bool) {
  return {
    type: actions.DISPLAY_SEARCH_RESULTS,
    bool: bool
  };
}

export function setSearchType (text) {
  return {
    type: actions.SET_SEARCH_TYPE,
    text: text
  };
}

export function setFilteredVProMMs (array) {
  return {
    type: actions.SET_FILTERED_VPROMMS,
    array: array
  };
}

