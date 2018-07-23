import fetch from 'isomorphic-fetch';
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

function requestAdminInfo () {
  return {
    type: actions.REQUEST_ADMIN_INFO
  };
}

function receiveAdminInfo (json) {
  return {
    type: actions.RECEIVE_ADMIN_INFO,
    json: json
  };
}

export function fetchAdminInfo (id) {
  return function (dispatch) {
    dispatch(requestAdminInfo());
    const url = `${config.api}/admin/${id}/info`;
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.statusCode >= 400) {
          throw new Error('Bad Request');
        }
        dispatch(receiveAdminInfo(json));
      });
  };
}

export function removeAdminInfo () {
  return {
    type: actions.REMOVE_ADMIN_INFO
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


// ///////////////////////////////////////////////////////////////
//                             Roads                            //
// ///////////////////////////////////////////////////////////////
function requestFieldVProMMsids () {
  return {
    type: actions.REQUEST_VPROMMS_FIELD_IDS
  };
}

function receiveFieldVProMMsids (json) {
  return {
    type: actions.RECEIVE_VPROMMS_FIELD_IDS,
    json: json
  };
}

export function fetchFieldVProMMsIds (json) {
  return function (dispatch) {
    dispatch(requestFieldVProMMsids());
    const url = `${config.api}/field/ids`;
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.statusCode >= 400) {
          throw new Error('Bad Response');
        }
        dispatch(receiveFieldVProMMsids(json));
      });
  };
}


// ////////////////////////////////////////////////////////////////
//                             Search                            //
// ////////////////////////////////////////////////////////////////
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

// ////////////////////////////////////////////////////////////////
//                            Admins                             //
// ////////////////////////////////////////////////////////////////

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
      // if not found, throw an error.
        if (json.statusCode >= 400) {
          throw new Error('Bad response');
        }
        dispatch(receiveAdminBbox(json));
      });
  };
}

function requestProvinces () {
  return {
    type: actions.REQUEST_PROVINCES
  };
}

function receiveProvinces (json) {
  return {
    type: actions.RECEIVE_PROVINCES,
    json: json
  };
}

export function fetchProvinces () {
  return function (dispatch) {
    dispatch(requestProvinces());
    let url = `${config.api}/admin/province/units`;
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.statusCode >= 400) {
          throw new Error('Bad response');
        }
        dispatch(receiveProvinces(json));
      });
  };
}
