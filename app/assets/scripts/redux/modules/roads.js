import {
  format
} from 'url';
import {
  reduce,
  map,
  property,
  omit
} from 'lodash';
import config from '../../config';


/**
 * Utils
 */
export const roadIdIsValid = (id, province, district) => {
  return /^\d{3}([A-ZĐ]{2}|00)\d{5}$/.test(id) &&
    (!province || id.substring(0, 2) === province) &&
    (!district || id.substring(3, 5) === district);
};
export const getRoadPageKey = (province = '', district = '', page, sortOrder) =>
  `${province}-${district}-${page}-${sortOrder}`;
export const getRoadCountKey = (province = '', district = '') =>
  `${province}-${district}`;


/**
 * constants
 */
export const FETCH_ROADS = 'FETCH_ROADS';
export const FETCH_ROADS_SUCCESS = 'FETCH_ROADS_SUCCESS';
export const FETCH_ROADS_ERROR = 'FETCH_ROADS_ERROR';
export const FETCH_ROAD_COUNT = 'FETCH_ROAD_COUNT';
export const FETCH_ROAD_COUNT_SUCCESS = 'FETCH_ROAD_COUNT_SUCCESS';
export const FETCH_ROAD_COUNT_ERROR = 'FETCH_ROAD_COUNT_ERROR';
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
export const fetchRoads = (province, district, page, sortOrder) => ({ type: FETCH_ROADS, province, district, page, sortOrder });
export const fetchRoadsSuccess = (roadsById, roadsByPage, province, district, page, sortOrder) =>
  ({ type: FETCH_ROADS_SUCCESS, roadsById, roadsByPage, province, district, page, sortOrder });
export const fetchRoadsError = (error, province, district, page, sortOrder) =>
  ({ type: FETCH_ROADS_ERROR, error, province, district, page, sortOrder });
export const fetchRoadCount = (province, district) => ({ type: FETCH_ROAD_COUNT, province, district });
export const fetchRoadCountSuccess = (count, pageCount, province, district) =>
  ({ type: FETCH_ROAD_COUNT_SUCCESS, count, pageCount, province, district });
export const fetchRoadCountError = (error, province, district) =>
  ({ type: FETCH_ROAD_COUNT_ERROR, error, province, district });
export const editRoad = (id, newId) => ({ type: EDIT_ROAD, id, newId });
export const editRoadSuccess = (id, newId) => ({ type: EDIT_ROAD_SUCCESS, id, newId });
export const editRoadError = (id, newId, error) => ({ type: EDIT_ROAD_ERROR, id, newId, error });
export const deleteRoad = (id) => ({ type: DELETE_ROAD, id });
export const deleteRoadSuccess = (id) => ({ type: DELETE_ROAD_SUCCESS, id });
export const deleteRoadError = (id, error) => ({ type: DELETE_ROAD_ERROR, id, error });
export const createRoad = (id) => ({ type: CREATE_ROAD, id });
export const createRoadSuccess = () => ({ type: CREATE_ROAD_SUCCESS });
export const createRoadError = (error) => ({ type: CREATE_ROAD_ERROR, error });


export const fetchRoadsEpic = (province, district, page, sortOrder) => (dispatch) => {
  dispatch(fetchRoads(province, district, page, sortOrder));

  return fetch(
    format({ pathname: `${config.api}/properties/roads`, query: { province, district, page, sortOrder } })
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

      dispatch(fetchRoadsSuccess(roadsById, roadsByPage, province, district, page, sortOrder));
    })
    .catch((err) => dispatch(fetchRoadsError(err, province, district, page, sortOrder)));
};

export const fetchRoadCountEpic = (province, district) => (dispatch) => {
  dispatch(fetchRoadCount(province, district));

  return fetch(
    format({ pathname: `${config.api}/properties/roads/count`, query: { province, district } })
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(({ count, pageCount }) => {
      dispatch(fetchRoadCountSuccess(count, pageCount, province, district));
    })
    .catch((err) => dispatch(fetchRoadCountError(err, province, district)));
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
    .then((id) => dispatch(createRoadSuccess(id)))
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
    .then(({ id: newId }) => dispatch(editRoadSuccess(id, newId)))
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
    })
    .catch(err => dispatch(deleteRoadError(id, err.message)));
};


/**
 * reducer
 */
export default (
  state = {
    roadsById: {},
    roadsByPage: {},
    roadCount: {}
  },
  action
) => {
  if (action.type === FETCH_ROADS) {
    const { province, district, page, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortOrder);

    return Object.assign({}, state, {
      roadsByPage: Object.assign({}, state.roadsByPage, {
        [pageKey]: {
          status: 'pending',
          roads: state.roadsByPage[pageKey] ? state.roadsByPage[pageKey].roads : []
        }
      })
    });
  } else if (action.type === FETCH_ROADS_SUCCESS) {
    const { roadsById, roadsByPage, province, district, page, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortOrder);

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
    const { province, district, page, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortOrder);

    return Object.assign({}, state, {
      roadsByPage: Object.assign({}, state.roadsByPage, {
        [pageKey]: {
          status: 'error',
          roads: []
        }
      })
    });
  } else if (action.type === FETCH_ROAD_COUNT) {
    const { province, district } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      roadCount: Object.assign({}, state.roadCount, {
        [roadCountKey]: Object.assign({}, state.roadCount[roadCountKey] || {}, {
          status: 'pending'
        })
      })
    });
  } else if (action.type === FETCH_ROAD_COUNT_SUCCESS) {
    const { province, district, count, pageCount } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      roadCount: Object.assign({}, state.roadCount, {
        [roadCountKey]: {
          status: 'complete',
          count: count,
          pageCount: pageCount
        }
      })
    });
  } else if (action.type === FETCH_ROAD_COUNT_ERROR) {
    const { province, district } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      roadCount: Object.assign({}, state.roadCount, {
        [roadCountKey]: {
          status: 'error',
          count: undefined,
          pageCount: undefined
        }
      })
    });
  }

  return state;
};
