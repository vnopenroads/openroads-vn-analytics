import config from '../../config';


/**
 * constants
 */
export const FETCH_WAY_TASK = 'FETCH_WAY_TASK';
export const FETCH_WAY_TASK_SUCCESS = 'FETCH_WAY_TASK_SUCCESS';
export const FETCH_WAY_TASK_ERROR = 'FETCH_WAY_TASK_ERROR';
export const RELOAD_WAY_TASK = 'REQUEST_RELOAD_WAY_TASK';


/**
 * action creators
 */
export const fetchWayTask = () => ({ type: FETCH_WAY_TASK });
export const fetchWayTaskSuccess = (id, geoJSON) => ({
  type: FETCH_WAY_TASK_SUCCESS,
  id,
  geoJSON
});
export const fetchWayTaskError = () => ({
  type: FETCH_WAY_TASK_ERROR
});
export const reloadWayTask = () => ({ type: RELOAD_WAY_TASK });

export const fetchNextWayTask = skippedTasks => dispatch => {
  dispatch(fetchWayTask());

  const url = Array.isArray(skippedTasks) && skippedTasks.length ?
    `${config.api}/tasks/next?skip=${skippedTasks.join(',')}` :
    `${config.api}/tasks/next`;

  return fetch(url)
    .then(response => {
      if (response.status === 404) {
        throw new Error('No tasks remaining');
      } else if (response.status >= 400) {
        throw new Error('Connection error');
      }
      return response.json();
    })
    .then(json => {
      json.data.features.forEach(feature => {
        feature.properties._id = feature.meta.id;
      });
      return dispatch(fetchWayTaskSuccess(json.id, json.data));
    }, e => {
      console.error('Error requesting task', e);
      return dispatch(fetchWayTaskError());
    });
};

export const reloadCurrentTask = taskId => dispatch => {
  dispatch(reloadWayTask());

  return fetch(`${config.api}/tasks/${taskId}`)
    .then(response => {
      if (response.status >= 400) {
        throw new Error('Bad response');
      }
      return response.json();
    })
    .then(json => {
      json.data.features.forEach(feature => {
        feature.properties._id = feature.meta.id;
      });
      return dispatch(fetchWayTaskSuccess(json.id, json.data));
    }, e => {
      console.log('Error reloading task', e);
      return dispatch(fetchWayTaskError());
    });
};


/**
 * reducer
 */
export default (
  state = {
    status: 'complete',
    data: null,
    id: null
  },
  action
) => {
  if (action.type === FETCH_WAY_TASK) {
    return Object.assign({}, state, {
      status: 'pending'
    });
  } else if (action.type === FETCH_WAY_TASK_SUCCESS) {
    return Object.assign({}, state, {
      geoJSON: action.geoJSON,
      id: action.id,
      status: 'complete'
    });
  } else if (action.type === FETCH_WAY_TASK_ERROR) {
    return Object.assign({}, state, {
      status: 'error'
    });
  } else if (action.type === RELOAD_WAY_TASK) {
    return Object.assign({}, state, {
      status: 'pending',
      id: null,
      data: null
    });
  }

  return state;
};
