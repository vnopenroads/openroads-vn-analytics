import {
  format
} from 'url';
import {
  reduce,
  map,
  property,
  omit
} from 'lodash';
import {
  clearRoadCount
} from './roadCount';
import config from '../../config';


/**
 * Utils
 */
export const roadIdIsValid = (id, province, district) => {
  return /^\d{3}([A-ZĐ]{2}|00)\d{5}$/.test(id) &&
    (!province || id.substring(0, 2) === province) &&
    (!district || id.substring(3, 5) === district);
};
export const getRoadPageKey = (province = '', district = '', page, sortField, sortOrder) =>
  `${province}-${district}-${page}-${sortField}-${sortOrder}`;


/**
 * constants
 */
export const FETCH_ROADS = 'FETCH_ROADS';
export const FETCH_ROADS_SUCCESS = 'FETCH_ROADS_SUCCESS';
export const FETCH_ROADS_ERROR = 'FETCH_ROADS_ERROR';
export const CLEAR_ROADS_PAGES = 'CLEAR_ROADS_PAGES';
export const FETCH_ROAD_GEOMETRY = 'FETCH_ROAD_GEOMETRY';
export const FETCH_ROAD_GEOMETRY_SUCCESS = 'FETCH_ROAD_GEOMETRY_SUCCESS';
export const FETCH_ROAD_GEOMETRY_ERROR = 'FETCH_ROAD_GEOMETRY_ERROR';
export const CREATE_ROAD = 'CREATE_ROAD';
export const CREATE_ROAD_SUCCESS = 'CREATE_ROAD_SUCCESS';
export const CREATE_ROAD_ERROR = 'CREATE_ROAD_ERROR';
export const EDIT_ROAD = 'EDIT_ROAD';
export const EDIT_ROAD_SUCCESS = 'EDIT_ROAD_SUCCESS';
export const EDIT_ROAD_ERROR = 'EDIT_ROAD_ERROR';
export const DELETE_ROAD = 'DELETE_ROAD';
export const DELETE_ROAD_SUCCESS = 'DELETE_ROAD_SUCCESS';
export const DELETE_ROAD_ERROR = 'DELETE_ROAD_ERROR';


/**
 * actions
 */
export const fetchRoads = (province, district, page, sortField, sortOrder) =>
  ({ type: FETCH_ROADS, province, district, page, sortField, sortOrder });
export const fetchRoadsSuccess = (roadsById, roadsByPage, province, district, page, sortField, sortOrder) =>
  ({ type: FETCH_ROADS_SUCCESS, roadsById, roadsByPage, province, district, page, sortField, sortOrder });
export const fetchRoadsError = (error, province, district, page, sortField, sortOrder) =>
  ({ type: FETCH_ROADS_ERROR, error, province, district, page, sortField, sortOrder });
export const clearRoadsPages = () => ({ type: CLEAR_ROADS_PAGES });

export const fetchRoadGeometry = (id) => ({ type: FETCH_ROAD_GEOMETRY, id });
export const fetchRoadGeometrySuccess = (id, geoJSON) => ({ type: FETCH_ROAD_GEOMETRY, id, geoJSON });
export const fetchRoadGeometryError = (id, error) => ({ type: FETCH_ROAD_GEOMETRY, id, error });

export const editRoad = (id, newId) => ({ type: EDIT_ROAD, id, newId });
export const editRoadSuccess = (id, newId) => ({ type: EDIT_ROAD_SUCCESS, id, newId });
export const editRoadError = (id, newId, error) => ({ type: EDIT_ROAD_ERROR, id, newId, error });

export const deleteRoad = (id) => ({ type: DELETE_ROAD, id });
export const deleteRoadSuccess = (id) => ({ type: DELETE_ROAD_SUCCESS, id });
export const deleteRoadError = (id, error) => ({ type: DELETE_ROAD_ERROR, id, error });

export const createRoad = (id) => ({ type: CREATE_ROAD, id });
export const createRoadSuccess = () => ({ type: CREATE_ROAD_SUCCESS });
export const createRoadError = (error) => ({ type: CREATE_ROAD_ERROR, error });


export const fetchRoadsEpic = (province, district, page, sortField, sortOrder) => (dispatch) => {
  dispatch(fetchRoads(province, district, page, sortField, sortOrder));

  return fetch(
    format({ pathname: `${config.api}/properties/roads`, query: { province, district, page, sortField, sortOrder } })
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((roads) => {
      // normalize response
      const roadsById = reduce(roads, (roadMap, road) => {
        roadMap[road.id] = omit(road, ['id']);
        return roadMap;
      }, {});
      const roadsByPage = map(roads, property('id'));

      dispatch(fetchRoadsSuccess(roadsById, roadsByPage, province, district, page, sortField, sortOrder));
    })
    .catch((err) => dispatch(fetchRoadsError(err, province, district, page, sortField, sortOrder)));
};


export const fetchRoadGeometryEpic = (id) => (dispatch) => {
  dispatch(fetchRoadGeometry(id));

  return fetch(`${config.api}/field/geometries/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(geoJSON => dispatch(fetchRoadGeometrySuccess(id, geoJSON)))
    .catch(err => dispatch(fetchRoadGeometryError(id, err)));
};


export const createRoadEpic = (id) => (dispatch) => {
  dispatch(createRoad());

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'PUT'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((id) => {
      dispatch(createRoadSuccess(id));
      dispatch(clearRoadsPages());
      dispatch(clearRoadCount());
    })
    .catch((err) => dispatch(createRoadError(err.message)));
};


export const editRoadEpic = (id, newId) => (dispatch) => {
  dispatch(editRoad(id, newId));

  return fetch(`${config.api}/properties/roads/${id}/move`, {
    method: 'POST',
    body: new Blob([JSON.stringify({ id: newId })], { type: 'application/json' })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(({ id: newId }) => {
      dispatch(editRoadSuccess(id, newId));
      dispatch(clearRoadsPages());
      dispatch(clearRoadCount());
    })
    .catch((err) => dispatch(editRoadError(id, newId, err.message)));
};


export const deleteRoadEpic = (id) => (dispatch) => {
  dispatch(deleteRoad(id));

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      dispatch(deleteRoadSuccess(id));
      dispatch(clearRoadsPages());
      dispatch(clearRoadCount());
    })
    .catch(err => dispatch(deleteRoadError(id, err.message)));
};


/**
 * reducer
 */
export default (
  state = {
    roadsById: {},
    roadsByPage: {}
  },
  action
) => {
  if (action.type === FETCH_ROADS) {
    const { province, district, page, sortField, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortField, sortOrder);

    return Object.assign({}, state, {
      roadsByPage: Object.assign({}, state.roadsByPage, {
        [pageKey]: {
          status: 'pending',
          roads: state.roadsByPage[pageKey] ? state.roadsByPage[pageKey].roads : []
        }
      })
    });
  } else if (action.type === FETCH_ROADS_SUCCESS) {
    const { roadsById, roadsByPage, province, district, page, sortField, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortField, sortOrder);

    return Object.assign({}, state, {
      roadsById: Object.assign({}, state.roadsById, roadsById),
      roadsByPage: Object.assign({}, state.roadsByPage, {
        [pageKey]: {
          status: 'complete',
          roads: roadsByPage
        }
      })
    });
  } else if (action.type === FETCH_ROADS_ERROR) {
    const { province, district, page, sortField, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortField, sortOrder);

    return Object.assign({}, state, {
      roadsByPage: Object.assign({}, state.roadsByPage, {
        [pageKey]: {
          status: 'error',
          roads: []
        }
      })
    });
  } else if (action.type === CLEAR_ROADS_PAGES) {
    return Object.assign({}, state, {
      roadsByPage: {}
    });
  }

  return state;
};
