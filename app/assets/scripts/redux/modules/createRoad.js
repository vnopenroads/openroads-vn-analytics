import config from '../../config';


/**
 * constants
 */
export const CREATE_ROAD = 'CREATE_ROAD';
export const CREATE_ROAD_SUCCESS = 'CREATE_ROAD_SUCCESS';
export const CREATE_ROAD_ERROR = 'CREATE_ROAD_ERROR';


/**
 * actions
 */
export const createRoad = (id) => ({ type: CREATE_ROAD, id });

export const createRoadSuccess = () => ({ type: CREATE_ROAD_SUCCESS });

export const createRoadError = (error) => ({ type: CREATE_ROAD_ERROR, error });

export const createRoadEpic = (id) => (dispatch) => {
  dispatch(createRoad());

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'PUT'
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((id) => dispatch(createRoadSuccess(id)))
    .catch((err) => dispatch(createRoadError(err)));
};


/**
 * reducer
 */
export default (
  state = {
    status: 'complete'
  },
  action
) => {
  switch (action.type) {
    case CREATE_ROAD:
      return Object.assign({}, state, {
        status: 'pending'
      });
    case CREATE_ROAD_SUCCESS:
      return Object.assign({}, state, {
        status: 'complete'
      });
    case CREATE_ROAD_ERROR:
      return Object.assign({}, state, {
        status: 'error',
        error: action.error
      });
  }

  return state;
};
