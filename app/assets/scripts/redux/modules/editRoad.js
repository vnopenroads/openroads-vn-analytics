import config from '../../config';


/**
 * Utils
 */
export const roadIdIsInValid = (id) => {
  return !/^\d{3}([A-ZĐ]{2}|00)\d{5}$/.test(id);
};


/**
 * constants
 */
export const EDIT_ROAD = 'EDIT_ROAD';
export const EDIT_ROAD_SUCCESS = 'EDIT_ROAD_SUCCESS';
export const EDIT_ROAD_ERROR = 'EDIT_ROAD_ERROR';
export const DELETE_ROAD = 'DELETE_ROAD';
export const DELETE_ROAD_SUCCESS = 'DELETE_ROAD_SUCCESS';
export const DELETE_ROAD_ERROR = 'DELETE_ROAD_ERROR';


/**
 * actions
 */
export const editRoad = (id, newId) => ({ type: EDIT_ROAD, id, newId });
export const editRoadSuccess = (id, newId) => ({ type: EDIT_ROAD_SUCCESS, id, newId });
export const editRoadError = (id, newId, error) => ({ type: EDIT_ROAD_ERROR, id, newId, error });
export const deleteRoad = (id) => ({ type: DELETE_ROAD, id });
export const deleteRoadSuccess = (id) => ({ type: DELETE_ROAD_SUCCESS, id });
export const deleteRoadError = (id, error) => ({ type: DELETE_ROAD_ERROR, id, error });

export const editRoadEpic = (id, newId) => (dispatch) => {
  dispatch(editRoad(id, newId));

  return fetch(`${config.api}/properties/roads/${id}/move`, {
    method: 'POST',
    body: new Blob([JSON.stringify({ id: newId })], { type: 'application/json' })
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(({ id: newId }) => dispatch(editRoadSuccess(id, newId)))
    .catch((err) => dispatch(editRoadError(id, newId, err)));
};

export const deleteRoadEpic = (id) => (dispatch) => {
  dispatch(deleteRoad(id));

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (response.status >= 400) {
        dispatch(deleteRoadError(id, response));
      }

      dispatch(deleteRoadSuccess(id));
    });
};


/**
 * reducer
 */
export default (
  state = {},
  action
) => {
  switch (action.type) {
    case EDIT_ROAD:
      return Object.assign({}, state, {
        [action.id]: { status: 'pending' }
      });
    case EDIT_ROAD_SUCCESS:
      return Object.assign({}, state, {
        [action.id]: { status: 'complete' }
      });
    case EDIT_ROAD_ERROR:
      return Object.assign({}, state, {
        [action.id]: {
          status: 'error',
          error: action.error
        }
      });
    case DELETE_ROAD:
      return Object.assign({}, state, {
        [action.id]: { status: 'pending' }
      });
    case DELETE_ROAD_SUCCESS:
      return Object.assign({}, state, {
        [action.id]: { status: 'complete' }
      });
    case DELETE_ROAD_ERROR:
      return Object.assign({}, state, {
        [action.id]: {
          status: 'error',
          error: action.error
        }
      });
  }

  return state;
};
