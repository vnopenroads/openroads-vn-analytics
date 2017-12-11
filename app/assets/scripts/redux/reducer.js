import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import { localReducer } from 'redux-fractal';
import _ from 'lodash';
import * as actions from '../actions/action-types';
import waytasks from './modules/tasks';
import osmChange from './modules/osm';
import adminRoads from './modules/adminRoads';
import roads, {
  EDIT_ROAD_SUCCESS,
  DELETE_ROAD_SUCCESS
} from './modules/roads';
import { ADMIN_MAP } from '../constants';



const admins = function (state = {units: [], fetching: false, fetched: false}, action) {
  switch (action.type) {
    case actions.REQUEST_ADMINS:
      console.log('REQUEST_ADMINS');
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_ADMINS:
      console.log('RECEIVE_ADMINS');
      state = _.cloneDeep(state);
      state.units = action.json;
      state.fetching = false;
      state.fetched = true;
      break;
    case actions.CLEAR_ADMINS:
      state = _.cloneDeep(state);
      state.units = [];
      break;
  }
  return state;
};

const adminBboxDefaultState = {
  fetching: false,
  fetched: false,
  bbox: []
};
const adminBbox = function (state = adminBboxDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_ADMIN_BBOX:
      console.log('REQUEST_ADMIN_BBOX');
      state = _.cloneDeep(state);
      state.fetching = true;
      state.fetched = false;
      break;
    case actions.RECEIVE_ADMIN_BBOX:
      console.log('RECEIVE_ADMIN_BBOX');
      state = _.cloneDeep(state);
      state.bbox = action.json.bbox;
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


const VProMMSidsDefaultState = {
  fetching: false,
  fetched: false,
  data: []
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
        state.data = action.json;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};


const defaultVProMMSidSourceGeoJSON = {
  fetching: false,
  fetched: false,
  geoJSON: [],
  vprommId: '',
  provinceName: ''
};

const VProMMSidSourceGeoJSON = function (state = defaultVProMMSidSourceGeoJSON, action) {
  switch (action.type) {
    case actions.REQUEST_VPROMMS_SOURCE_GEOJSON:
      console.log('REQUEST_VPROMMS_SOURCE_GEOJSON');
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECIEVE_VPROMMS_SOURCE_GEOJSON:
      console.log('RECIEVE_VPROMMS_SOURCE_GEOJSON');
      state = _.cloneDeep(state);
      state.geoJSON = action.json;
      state.vprommId = action.vprommId;
      state.provinceName = action.provinceName;
      state.fetching = false;
      state.fetched = true;
      break;
    case actions.REMOVE_VPROMMS_SOURCE_GEOJSON:
      console.log('REMOVE_SOURCE_GEOJSON');
      return defaultVProMMSidSourceGeoJSON;
  }
  return state;
};

const VProMMsWayBboxDefaultState = {
  fetching: false,
  fetched: false,
  bbox: []
};

const VProMMsWayBbox = function (state = VProMMsWayBboxDefaultState, action) {
  switch (action.type) {
    case actions.REQUEST_VPROMMS_IDS:
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECIEVE_VPROMMS_BBOX:
      state = _.cloneDeep(state);
      state.fetching = false;
      state.fetched = true;
      state.bbox = action.json;
  }
  return state;
};

const defaultVProMMsAdminProperties = {
  fetching: false,
  fetched: false,
  data: []
};

const VProMMsAdminProperties = function (state = defaultVProMMsAdminProperties, action) {
  switch (action.type) {
    case actions.REQUEST_ADMIN_VPROMMS_PROPERTIES:
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_ADMIN_VPROMMS_PROPERTIES:
      state = _.cloneDeep(state);
      state.fetching = false;
      state.fetched = true;
      state.data = action.json;
      break;
    case actions.REMOVE_ADMIN_VPROMMS_PROPERTIES:
      state = defaultVProMMsAdminProperties;
      break;
    case EDIT_ROAD_SUCCESS:
      console.log('update road properties');

      return Object.assign({}, state, {
        data: state.data
          .map(road => {
            console.log('update road properties id', action.id, action.newId);
            return road.id === action.id ?
              { id: action.newId, properties: road.properties } :
              road;
          })
      });
    case DELETE_ROAD_SUCCESS:
      return Object.assign({}, state, {
        ids: state.data.filter(({ id }) => id !== action.id)
      });
  }
  return state;
};

const defaultFieldVProMMsids = {
  fetching: false,
  fetched: false,
  ids: []
};

const fieldVProMMsids = function (state = defaultFieldVProMMsids, action) {
  switch (action.type) {
    case actions.REQUEST_VPROMMS_FIELD_IDS:
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_VPROMMS_FIELD_IDS:
      state = _.cloneDeep(state);
      state.fetching = false;
      state.fetched = true;
      state.ids = action.json;
      break;
    case actions.REMOVE_VPROMMS_FIELD_IDS:
      return defaultFieldVProMMsids;
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

const globZoomDefault = {
  y: 20.029232336299856,
  x: 105.73,
  z: 6
};

const globZoom = function (state = globZoomDefault, action) {
  switch (action.type) {
    case actions.SET_GLOBAL_ZOOM:
      state = _.cloneDeep(state);
      state = action.json;
      break;
  }
  return state;
};

const defaultSearchType = {
  searchType: 'Admin'
};

const setSearchType = function (state = defaultSearchType, action) {
  switch (action.type) {
    case actions.SET_SEARCH_TYPE:
      state = _.cloneDeep(state);
      state.searchType = action.text;
      break;
  }
  return state;
};

const setFilteredVProMMs = function (state = [], action) {
  switch (action.type) {
    case actions.SET_FILTERED_VPROMMS:
      state = _.cloneDeep(state);
      state = action.array;
      break;
  }
  return state;
};

const defaultProvinces = {
  fetching: false,
  fetched: false,
  data: {}
};

const provinces = function (state = defaultProvinces, action) {
  switch (action.type) {
    case actions.REQUEST_PROVINCES:
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_PROVINCES:
      state = _.cloneDeep(state);
      state.fetching = false;
      state.fetched = true;
      state.data = action.json;
      break;
    case actions.REMOVE_PROVINCES:
      return defaultProvinces;
  }
  return state;
};

const defaultCrossWalk = {
  province: {},
  district: {},
  set: false
};

const crosswalk = function (state = defaultCrossWalk, action) {
  switch (action.type) {
    case actions.SET_CROSSWALK:
      state = _.cloneDeep(state);
      state.province = _.pickBy(ADMIN_MAP.province, (province) => { return !/^\s*$/.test(province); });
      state.district = ADMIN_MAP.district;
      state.set = true;
      break;
    case actions.REMOVE_CROSSWALK:
      return defaultCrossWalk;
  }
  return state;
};

const defaultVProMMsIdCount = {
  fetching: false,
  fetched: false,
  counts: []
};

const roadIdCount = function (state = defaultVProMMsIdCount, action) {
  switch (action.type) {
    case actions.REQUEST_VPROMMS_IDS_COUNT:
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_VPROMMS_IDS_COUNT:
      state = _.cloneDeep(state);
      state.fetching = false;
      state.fetched = true;
      state.counts = action.json;
      break;
    case actions.REMOVE_VPROMMS_IDS_COUNT:
      return defaultVProMMsIdCount;
  }
  return state;
};

const defaultFieldVProMMsIdsCount = {
  fetching: false,
  fetched: false,
  counts: []
};

const fieldIdCount = function (state = defaultFieldVProMMsIdsCount, action) {
  switch (action.type) {
    case actions.REQUEST_VPROMMS_FIELD_IDS_COUNT:
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_VPROMMS_FIELD_IDS_COUNT:
      state = _.cloneDeep(state);
      state.fetched = true;
      state.fetching = false;
      state.counts = action.json;
      break;
  }
  return state;
};

const defaultAdminInfo = {
  fetched: false,
  fetching: false,
  data: {}
};

const adminInfo = function (state = defaultAdminInfo, action) {
  switch (action.type) {
    case actions.REQUEST_ADMIN_INFO:
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_ADMIN_INFO:
      state = _.cloneDeep(state);
      state.fetching = false;
      state.fetched = true;
      state.data = action.json;
      break;
    case actions.REMOVE_ADMIN_INFO:
      state = defaultAdminInfo;
      break;
  }
  return state;
};

const defaultFieldRoads = {
  fetching: false,
  fetched: false,
  ids: []
};

const fieldRoads = function (state = defaultFieldRoads, action) {
  switch (action.type) {
    case actions.REQUEST_FIELD_ROADS:
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_FIELD_ROADS:
      state = _.cloneDeep(state);
      state.fetching = false;
      state.fetched = true;
      state.ids = action.json;
      break;
    case actions.REMOVE_FIELD_ROADS:
      return defaultFieldRoads;
    case EDIT_ROAD_SUCCESS:
      return Object.assign({}, state, {
        ids: state.ids
          .filter(id => id !== action.id)
          .concat(action.newId)
      });
    case DELETE_ROAD_SUCCESS:
      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== action.id)
      });
  }
  return state;
};

const defaultPagination = {currentPage: 0, currentIndex: 0, limit: 0, pages: 0, clickedPage: 0};

const pagination = function (state = defaultPagination, action) {
  switch (action.type) {
    case actions.SET_PAGINATION:
      return action.json;
    case actions.UPDATE_PAGINATION:
      state = _.cloneDeep(state);
      state.currentIndex = action.newIndex;
      state.currentPage = action.newPage;
      break;
    case actions.UPDATE_PAGINATION_CLICKED_PAGE:
      state = _.cloneDeep(state);
      state.clickedPage = action.page;
      break;
  }
  return state;
};

const previousLocation = function (state = {path: '/'}, action) {
  switch (action.type) {
    case actions.SET_PREVIOUS_LOCATION:
      state = _.cloneDeep(state);
      state.path = action.location;
      break;
  }
  return state;
};

const subadminName = function (state = {name: ''}, action) {
  switch (action.type) {
    case actions.SET_SUBADMIN_NAME:
      state = _.cloneDeep(state);
      state.name = action.name;
      break;
  }
  return state;
};


export default combineReducers({
  routing: routeReducer,
  local: localReducer,
  admins,
  adminInfo,
  adminBbox,
  adminRoads,
  roads,
  fieldIdCount,
  waytasks,
  osmChange,
  crosswalk,
  search,
  exploreMap,
  globZoom,
  provinces,
  roadIdCount,
  setSearchType,
  setFilteredVProMMs,
  VProMMSids,
  VProMMsWayBbox,
  VProMMsAdminProperties,
  VProMMSidSourceGeoJSON,
  fieldRoads,
  fieldVProMMsids,
  pagination,
  previousLocation,
  subadminName
});
