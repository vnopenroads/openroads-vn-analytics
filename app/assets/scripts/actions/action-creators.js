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
//                   VProMMS IDs Source Data                     //
// ////////////////////////////////////////////////////////////////

function requestVProMMSidSourceGeoJSON () {
  return {
    type: actions.REQUEST_VPROMMS_SOURCE_GEOJSON
  };
}

function recieveVPRoMMSidSourceGeoJSON (json, vprommId, provinceName) {
  return {
    type: actions.RECIEVE_VPROMMS_SOURCE_GEOJSON,
    json: json,
    vprommId: vprommId,
    provinceName: provinceName,
    recievedAt: Date.now()
  };
}

export function fetchVProMMsidSourceGeoJSON (vprommId, provinceName) {
  return function (dispatch) {
    dispatch(requestVProMMSidSourceGeoJSON());
    // hit the grouped field geometries endpoint. do not download it.
    let url = `${config.api}/field/geometries/${vprommId}?grouped=true`;
    return fetch(url)
    .then(response => response.json())
    .then(json => {
      if (json.statusCode >= 400) {
        throw new Error('Bad Response');
      }
      dispatch(recieveVPRoMMSidSourceGeoJSON(json, vprommId, provinceName));
    });
  };
}

export function removeVProMMsSourceGeoJSON () {
  return {
    type: actions.REMOVE_VPROMMS_SOURCE_GEOJSON,
    receivedAt: Date.now()
  };
}

function requestVProMMsidsCount () {
  return {
    type: actions.REQUEST_VPROMMS_IDS_COUNT
  };
}

function receiveVProMMSidsCount (json) {
  return {
    type: actions.RECEIVE_VPROMMS_IDS_COUNT,
    json: json
  };
}

export function fetchVProMMsIdsCount (level, id) {
  return function (dispatch) {
    dispatch(requestVProMMsidsCount());
    let url = `${config.api}/admin/roads/total`;
    if (id) {
      id = id.join('');
      url = `${url}/${id}`;
    }
    if (level === 'district') {
      url = `${url}?level=district`;
    }
    return fetch(url)
    .then(response => response.json())
    .then(json => {
      if (json.statusCode >= 400) {
        throw new Error('Bad Request');
      }
      dispatch(receiveVProMMSidsCount(json));
    });
  };
}

export function removeVProMMsIdsCount () {
  return {
    type: actions.REMOVE_VPROMMS_IDS_COUNT
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


// ///////////////////////////////////////////////////////////////
//                             Roads                            //
// ///////////////////////////////////////////////////////////////

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
      if (json.statusCode >= 400) {
        return dispatch(recieveVProMMsBbox({}));
      }
      dispatch(recieveVProMMsBbox(json));
    });
  };
}

export function removeVProMMsBBox () {
  return {
    type: actions.REMOVE_VPROMMS_BBOX
  };
}

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

function requestFieldVProMMsIdsCount () {
  return {
    type: actions.REQUEST_VPROMMS_FIELD_IDS_COUNT
  };
}

function receiveFieldVProMMsIdsCount (json) {
  return {
    type: actions.RECEIVE_VPROMMS_FIELD_IDS_COUNT,
    json: json
  };
}

export function removeFieldVProMMsIdsCount () {
  return {
    type: actions.REMOVE_VPROMMS_FIELD_IDS_COUNT
  };
}

export function fetchFieldVProMsIdsCount (level) {
  return function (dispatch) {
    dispatch(requestFieldVProMMsIdsCount());
    let url = `${config.api}/field/roads/total`;
    url = (level === 'district') ? `${url}?level=district` : url;
    return fetch(url)
    .then(response => response.json())
    .then(json => {
      if (json.statusCode >= 400) {
        throw new Error('Bad Request');
      }
      dispatch(receiveFieldVProMMsIdsCount(json));
    });
  };
}

function requestFieldRoads () {
  return {
    type: actions.REQUEST_FIELD_ROADS
  };
}

function receiveFieldRoads (json) {
  return {
    type: actions.RECEIVE_FIELD_ROADS,
    json: json
  };
}

export function fetchFieldRoads (json, level) {
  return function (dispatch) {
    dispatch(requestFieldRoads());
    let url = `${config.api}/field/roads?province=${json[0]}`;
    if (level === 'district') {
      url = `${url}&district=${json[1]}`;
    }
    return fetch(url)
    .then(response => response.json())
    .then(json => {
      if (json.statusCode >= 400) {
        throw new Error('Bad Response');
      }
      dispatch(receiveFieldRoads(json));
    });
  };
}

export function removeFieldRoads () {
  return {
    type: actions.REMOVE_FIELD_ROADS
  };
}

function requestAdminVProMMsProps () {
  return {
    type: actions.REQUEST_ADMIN_VPROMMS_PROPERTIES
  };
}

function receiveAdminVProMMsProps (json) {
  return {
    type: actions.RECEIVE_ADMIN_VPROMMS_PROPERTIES,
    json: json
  };
}

export function fetchAdminVProMMsProps (json, level, limit, offset) {
  return function (dispatch) {
    dispatch(requestAdminVProMMsProps());
    let url = `${config.api}/admin/roads/properties?province=${json[0]}`;
    if (level === 'district') {
      url = `${url}&district=${json[1]}`;
    }
    if (offset) {
      url = `${url}&offset=${offset}`;
    }
    if (limit) {
      url = `${url}&limit=${limit}`;
    }
    return fetch(url)
    .then(response => response.json())
    .then(json => {
      if (json.statusCode >= 400) {
        throw new Error('Bad Request');
      }
      dispatch(receiveAdminVProMMsProps(json));
    });
  };
}

export function removeAdminVProMMsProps () {
  return {
    type: actions.REMOVE_ADMIN_VPROMMS_PROPERTIES
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

export function removeProvinces () {
  return {
    type: actions.REMOVE_PROVINCES
  };
}

export function setCrossWalk () {
  return {
    type: actions.SET_CROSSWALK
  };
}

export function removeCrosswalk () {
  return {
    type: actions.REMOVE_CROSSWALK
  };
}

// ////////////////////////////////////////////////////////////////
//                        PAGINATION                             //
// ////////////////////////////////////////////////////////////////

export function setPagination (paginationObject) {
  return {
    type: actions.SET_PAGINATION,
    json: paginationObject
  };
}

export function updatePagination (newIndex, newPage) {
  return {
    type: actions.UPDATE_PAGINATION,
    newIndex: newIndex,
    newPage: newPage
  };
}

export function updateClickedPage (page) {
  return {
    type: actions.UPDATE_PAGINATION_CLICKED_PAGE,
    page: page
  };
}

// ////////////////////////////////////////////////////////////////
//                           Location                            //
// ////////////////////////////////////////////////////////////////

export function setPreviousLocation (location) {
  return {
    type: actions.SET_PREVIOUS_LOCATION,
    location: location
  };
}

export function setSubAdminName (name) {
  return {
    type: actions.SET_SUBADMIN_NAME,
    name: name
  };
}
