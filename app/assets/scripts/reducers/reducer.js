import _ from 'lodash';
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

import * as actions from '../actions/action-types';
import { VPROMMS_IDS } from '../constants';

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
  return state;
};

const stats = function (state = {fetching: false, fetched: false, data: null}, action) {
  switch (action.type) {
    case actions.REQUEST_ADMIN_STATS:
      console.log('REQUEST_ADMIN_STATS');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_ADMIN_STATS:
      console.log('RECEIVE_ADMIN_STATS');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state = action.json;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const tofixtasksDefaultState = {
  fetching: false,
  fetched: false,
  data: {
    tasks: {
      meta: {
        page: null,
        limit: null,
        total: null
      },
      results: []
    }
  }
};
const tofixtasks = function (state = tofixtasksDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_TOFIX_TASKS:
      console.log('REQUEST_TOFIX_TASKS');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_TOFIX_TASKS:
      console.log('RECEIVE_TOFIX_TASKS');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.json;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const projecttasksDefaultState = {
  fetching: false,
  fetched: false,
  data: {
    projecttasks: {
      meta: {
        page: null,
        limit: null,
        total: null
      },
      results: []
    }
  }
};
const projecttasks = function (state = projecttasksDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_PROJECT_TASKS:
      console.log('REQUEST_PROJECT_TASKS');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_PROJECT_TASKS:
      console.log('RECEIVE_PROJECT_TASKS');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.json;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const projectsDefaultState = {
  fetching: false,
  fetched: false,
  data: {
    projects: {
      meta: {
        page: null,
        limit: null,
        total: null
      },
      results: []
    }
  }
};
const projects = function (state = projectsDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_PROJECTS:
      console.log('REQUEST_PROJECTS');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_PROJECTS:
      console.log('RECEIVE_PROJECTS');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.json;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const projectsMetaDefaultState = {
  fetching: false,
  fetched: false,
  data: {
    type: []
  }
};
const projectsMeta = function (state = projectsMetaDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_PROJECTS_META:
      console.log('REQUEST_PROJECTS_META');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_PROJECTS_META:
      console.log('RECEIVE_PROJECTS_META');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.json;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const roadNetworkStatusDefaultState = {
  fetching: false,
  fetched: false,
  data: {
    dataAvailable: null
  }
};
const roadNetworkStatus = function (state = roadNetworkStatusDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_ROAD_NETWORK_STATUS:
      console.log('REQUEST_ROAD_NETWORK_STATUS');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_ROAD_NETWORK_STATUS:
      console.log('RECEIVE_ROAD_NETWORK_STATUS');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.json;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

_.forEach(VPROMMS_IDS, (province) => {
  province.vpromms = province.vpromms.map((id) => {
    return {
      id,
      inTheDatabase: false,
      RoadLab: false,
      RouteShootUrl: '',
      RouteShootPro: false
    };
  });
});
const VProMMSidsDefaultState = {
  fetching: false,
  fetched: false,
  data: VPROMMS_IDS
};
const VProMMSids = function (state = VProMMSidsDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_VPROMMS_IDS:
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_VPROMMS_IDS:
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        _.forEach(state.data, (province) => {
          const keys = Object.keys(action.json);
          province.vpromms = province.vpromms.map((v) => {
            if (keys.includes(v.id)) {
              return {
                id: v.id,
                inTheDatabase: keys.includes(v.id),
                RoadLabPro: Boolean(action.json[v.id]['iri_mean']),
                RouteShootUrl: action.json[v.id]['rs_url'] ? action.json[v.id]['rs_url'] : '',
                RouteShoot: Boolean(action.json[v.id]['rs_url'])
              };
            }
            return {
              id: v.id,
              inTheDatabase: keys.includes(v.id),
              RoadLabPro: false,
              RouteShootUrl: '',
              RouteShoot: false
            };
          });
        });
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const globZoomDefaultState = {
  fetching: false,
  fetched: false,
  data: {
    z: 6,
    x: 105.73,
    y: 20.029232336299856
  }
};
const globZoom = function (state = globZoomDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_GLOB_ZOOM:
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_GLOB_ZOOM:
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.json;
      }
      state.fetching = false;
      state.fetched = false;
      break;
  }
  return state;
};

const exploreMapDefaultState = {
  layer: 'iri',
  showNoVpromms: false
};
const exploreMap = function (state = exploreMapDefaultState, action) {
  const newState = _.cloneDeep(state);
  switch (action.type) {
    case actions.SELECT_EXPLORE_MAP_LAYER:
      newState.layer = action.layer;
      break;
    case actions.EXPLORE_MAP_SHOW_NO_VPROMMS:
      newState.showNoVpromms = action.bool;
      break;
  }
  return newState;
};

export default combineReducers({
  adminSubregions,
  search,
  stats,
  tofixtasks,
  projecttasks,
  projects,
  projectsMeta,
  roadNetworkStatus,
  VProMMSids,
  globZoom,
  exploreMap,
  routing: routeReducer
});
