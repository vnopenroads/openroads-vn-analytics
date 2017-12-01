import config from '../../config';


/**
 * constants
 */
export const FETCH_WAY_TASK = 'FETCH_WAY_TASK';
export const FETCH_NEXT_WAY_TASK = 'FETCH_NEXT_WAY_TASK';
export const FETCH_WAY_TASK_SUCCESS = 'FETCH_WAY_TASK_SUCCESS';
export const FETCH_WAY_TASK_ERROR = 'FETCH_WAY_TASK_ERROR';
export const FETCH_WAY_TASK_COUNT = 'FETCH_WAY_TASK_COUNT';
export const FETCH_WAY_TASK_COUNT_SUCCESS = 'FETCH_WAY_TASK_COUNT_SUCCESS';
export const FETCH_WAY_TASK_COUNT_ERROR = 'FETCH_WAY_TASK_COUNT_ERROR';
export const MARK_WAY_TASK_PENDING = 'MARK_WAY_TASK_PENDING';
export const MARK_WAY_TASK_PENDING_SUCCESS = 'MARK_WAY_TASK_PENDING_SUCCESS';
export const MARK_WAY_TASK_PENDING_ERROR = 'MARK_WAY_TASK_PENDING_ERROR';
export const SKIP_TASK = 'SKIP_TASK';


/**
 * action creators
 */
export const fetchWayTask = () => ({ type: FETCH_WAY_TASK });
export const fetchNextWayTask = () => ({ type: FETCH_NEXT_WAY_TASK });
export const fetchWayTaskSuccess = (id, geoJSON) => ({
  type: FETCH_WAY_TASK_SUCCESS,
  id,
  geoJSON
});
export const fetchWayTaskError = () => ({ type: FETCH_WAY_TASK_ERROR });
export const fetchWayTaskCount = () => ({ type: FETCH_WAY_TASK_COUNT });
export const fetchWayTaskCountSuccess = count => ({ type: FETCH_WAY_TASK_COUNT_SUCCESS, count });
export const fetchWayTaskCountError = count => ({ type: FETCH_WAY_TASK_COUNT_ERROR });
export const markWayTaskPending = () => ({ type: MARK_WAY_TASK_PENDING });
export const markWayTaskPendingSuccess = () => ({ type: MARK_WAY_TASK_PENDING_SUCCESS });
export const markWayTaskPendingError = () => ({ type: MARK_WAY_TASK_PENDING_ERROR });
export const skipTask = id => ({ type: SKIP_TASK, id });


export const fetchNextWayTaskEpic = () => (dispatch, getState) => {
  dispatch(fetchNextWayTask());

  const skipped = getState().waytasks.skipped;
  const url = skipped.length > 0 ?
    `${config.api}/tasks/next?skip=${skipped.join(',')}` :
    `${config.api}/tasks/next`;

  return fetch(url)
    .then(response => {
      if (response.status === 404) {
        throw new Error('No tasks remaining');
      } else if (response.status >= 400) {
        throw new Error(response.statusText);
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


export const fetchWayTaskEpic = taskId => dispatch => {
  dispatch(fetchWayTask());

  return fetch(`${config.api}/tasks/${taskId}`)
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(({ id, data }) => {
      data.features.forEach(feature => {
        feature.properties._id = feature.meta.id;
      });
      return dispatch(fetchWayTaskSuccess(id, data));
    }, e => {
      console.error('Error reloading task', e);
      return dispatch(fetchWayTaskError());
    });
};


export const fetchWayTaskCountEpic = () => dispatch => {
  dispatch(fetchWayTaskCount());

  fetch(`${config.api}/tasks/count`)
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(({ count }) => {
      dispatch(fetchWayTaskCountSuccess(count));
    }, e => {
      console.error('Error requesting task count', e);
      dispatch(fetchWayTaskCountError());
    });
};


export const markWayTaskPendingEpic = way_ids => dispatch => {
  dispatch(markWayTaskPending());

  return fetch(`${config.api}/tasks/pending`, {
    method: 'PUT',
    body: new Blob([JSON.stringify({ way_ids: way_ids })], { type: 'application/json' })
  })
    .then(response => {
      if (response.status >= 400) {
        console.error('Error marking task as pending', response.statusText);
        dispatch(markWayTaskPendingError());
      }

      dispatch(markWayTaskPendingSuccess());
    });
};


/**
 * reducer
 */
export default (
  state = {
    status: 'complete',
    countStatus: 'complete',
    id: null,
    geoJSON: null,
    skipped: []
  },
  action
) => {
  if (action.type === FETCH_WAY_TASK) {
    return Object.assign({}, state, {
      status: 'pending'
    });
  } else if (action.type === FETCH_NEXT_WAY_TASK) {
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
  } else if (action.type === FETCH_WAY_TASK_COUNT) {
    return Object.assign({}, state, {
      taskCount: action.count,
      countStatus: 'pending'
    });
  } else if (action.type === FETCH_WAY_TASK_COUNT_SUCCESS) {
    return Object.assign({}, state, {
      taskCount: action.count,
      countStatus: 'complete'
    });
  } else if (action.type === FETCH_WAY_TASK_COUNT_ERROR) {
    return Object.assign({}, state, {
      countStatus: 'error'
    });
  } else if (action.type === SKIP_TASK) {
    return Object.assign({}, state, {
      skipped: state.skipped.concat(action.id)
    });
  }

  return state;
};
