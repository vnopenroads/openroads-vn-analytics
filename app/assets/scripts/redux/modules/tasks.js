import _ from 'lodash';
import config from '../../config';


/**
 * constants
 */
export const REQUEST_WAY_TASK = 'REQUEST_WAY_TASK';
export const RECEIVE_WAY_TASK = 'RECEIVE_WAY_TASK';
export const RELOAD_WAY_TASK = 'REQUEST_RELOAD_WAY_TASK';


/**
 * action creators
 */
export const requestWayTask = () => ({ type: REQUEST_WAY_TASK });
export const reloadWayTask = () => ({ type: RELOAD_WAY_TASK });
export const receiveWayTask = (json, error = null) => ({
  type: RECEIVE_WAY_TASK,
  json: json,
  error,
  receivedAt: Date.now()
});

export const fetchNextWayTask = skippedTasks => dispatch => {
  dispatch(requestWayTask());

  let url = `${config.api}/tasks/next`;
  if (Array.isArray(skippedTasks) && skippedTasks.length) {
    url += `?skip=${skippedTasks.join(',')}`;
  }

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
      return dispatch(receiveWayTask(json));
    }, e => {
      console.log('e', e);
      return dispatch(receiveWayTask(null, e.message));
    });
};

export const reloadCurrentTask = taskId => dispatch => {
  dispatch(reloadWayTask());
  dispatch(requestWayTask());

  let url = `${config.api}/tasks/${taskId}`;
  return fetch(url)
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
      return dispatch(receiveWayTask(json));
    }, e => {
      console.log('e', e);
      return dispatch(receiveWayTask(null, 'Data not available'));
    });
};


/**
 * reducer
 */
export default (
  state = {
    fetching: false,
    fetched: false,
    data: null,
    id: null
  },
  action
) => {
  switch (action.type) {
    case REQUEST_WAY_TASK:
      console.log('REQUEST_WAY_TASK');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case RECEIVE_WAY_TASK:
      console.log('RECEIVE_WAY_TASK');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.json.data;
        state.id = action.json.id;
      }
      state.fetching = false;
      state.fetched = true;
      break;
    case RELOAD_WAY_TASK:
      console.log('RELOAD_WAY_TASK');
      state = _.cloneDeep(state);
      state.id = null;
      state.data = null;
      break;
  }
  return state;
};
