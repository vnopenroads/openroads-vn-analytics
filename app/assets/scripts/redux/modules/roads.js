import config from '../../config';


/**
 * Utils
 */
export const roadIdIsValid = (id, province, district) => {
  return /^\d{3}([A-ZĐ]{2}|00)\d{5}$/.test(id) &&
    (!province || id.substring(0, 2) === province) &&
    (!district || id.substring(3, 5) === district);
};


/**
 * constants
 */
export const FETCH_ROADS = 'FETCH_ROADS';
export const FETCH_ROADS_SUCCESS = 'FETCH_ROADS_SUCCESS';
export const FETCH_ROADS_ERROR = 'FETCH_ROADS_ERROR';
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
export const fetchRoads = (page) => ({ type: FETCH_ROADS, page });
export const fetchRoadsSuccess = (roads) => ({ type: FETCH_ROADS, roads });
export const fetchRoadsError = (error) => ({ type: FETCH_ROADS, error });
export const editRoad = (id, newId) => ({ type: EDIT_ROAD, id, newId });
export const editRoadSuccess = (id, newId) => ({ type: EDIT_ROAD_SUCCESS, id, newId });
export const editRoadError = (id, newId, error) => ({ type: EDIT_ROAD_ERROR, id, newId, error });
export const deleteRoad = (id) => ({ type: DELETE_ROAD, id });
export const deleteRoadSuccess = (id) => ({ type: DELETE_ROAD_SUCCESS, id });
export const deleteRoadError = (id, error) => ({ type: DELETE_ROAD_ERROR, id, error });
export const createRoad = (id) => ({ type: CREATE_ROAD, id });
export const createRoadSuccess = () => ({ type: CREATE_ROAD_SUCCESS });
export const createRoadError = (error) => ({ type: CREATE_ROAD_ERROR, error });


export const fetchRoadsEpic = (page) => (dispatch) => {
  dispatch(fetchRoads(page));

  return fetch(`${config.api}/properties/roads`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((roads) => dispatch(fetchRoadsSuccess(roads)))
    .catch((err) => dispatch(fetchRoadsError(err)));
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
    roads: []
  },
  action
) => {
  if (action.type === FETCH_ROADS_SUCCESS) {
    return Object.assign({}, state, {
      roads: action.roads
    });
  }

  return state;
};
