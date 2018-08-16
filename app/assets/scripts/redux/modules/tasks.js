import config from '../../config';
import { deleteEntireWaysEpic, REQUEST_OSM_CHANGE_SUCCESS } from './osm';
import { editRoadIdEpic } from './roads';
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
export const SELECT_NEXT_WAY_TASK_PROVINCE = 'SELECT_NEXT_WAY_TASK_PROVINCE';
export const DEDUPE_WAY_TASK = 'DEDUPE_WAY_TASK';
export const DEDUPE_WAY_TASK_SUCCESS = 'DEDUPE_WAY_TASK_SUCCESS';
export const DEDUPE_WAY_TASK_ERROR = 'DEDUPE_WAY_TASK_ERROR';

/**
 * action creators
 */
export const fetchWayTask = (id) => ({ type: FETCH_WAY_TASK, id });
export const fetchNextWayTask = () => ({ type: FETCH_NEXT_WAY_TASK });
export const fetchWayTaskSuccess = (id, updatedAt, geoJSON) => ({
  type: FETCH_WAY_TASK_SUCCESS,
  id,
  updatedAt,
  geoJSON
});
export const fetchWayTaskError = (error) => ({ type: FETCH_WAY_TASK_ERROR, error: error });
export const fetchWayTaskCount = () => ({ type: FETCH_WAY_TASK_COUNT });
export const fetchWayTaskCountSuccess = count => ({ type: FETCH_WAY_TASK_COUNT_SUCCESS, count });
export const fetchWayTaskCountError = count => ({ type: FETCH_WAY_TASK_COUNT_ERROR });
export const markWayTaskPending = () => ({ type: MARK_WAY_TASK_PENDING });
export const markWayTaskPendingSuccess = () => ({ type: MARK_WAY_TASK_PENDING_SUCCESS });
export const markWayTaskPendingError = () => ({ type: MARK_WAY_TASK_PENDING_ERROR });
export const skipTask = id => ({ type: SKIP_TASK, id });
export const selectWayTaskProvince = (provinceId) => ({ type: SELECT_NEXT_WAY_TASK_PROVINCE, selectedProvince: provinceId });
export const dedupeWayTask = (taskId, wayIds, wayIdToKeep, dedupeId) => ({ type: DEDUPE_WAY_TASK, taskId: taskId, wayIdsToDelete: wayIds, wayIdToKeep: wayIdToKeep, dedupeIdToApply: dedupeId });
export const dedupeWayTaskSuccess = () => ({ type: DEDUPE_WAY_TASK_SUCCESS });
export const dedupeWayTaskError = (error) => ({ type: DEDUPE_WAY_TASK_ERROR, error: error });

export const fetchNextWayTaskEpic = () => (dispatch, getState) => {
  dispatch(fetchNextWayTask());

  const skipped = getState().waytasks.skipped;
  const selectedProvince = getState().waytasks.selectedProvince;

  let params = {};
  if (skipped.length) params['skip'] = skipped;
  if (selectedProvince) params['province'] = selectedProvince;

  let url = `${config.api}/tasks/next`;
  if (Object.keys(params).length) {
    url = url + '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
  }

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
        feature.properties.province = json.province;
      });
      dispatch(fetchWayTaskCountEpic());
      return dispatch(fetchWayTaskSuccess(json.id, json.updated_at, json.data));
    }, e => {
      console.error('Error requesting task', e);
      return dispatch(fetchWayTaskError(e));
    });
};


export const fetchWayTaskEpic = taskId => (dispatch, getState) => {
  dispatch(fetchWayTask(taskId));

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
      return dispatch(fetchWayTaskSuccess(id, data.updated_at, data));
    }, e => {
      console.error('Error reloading task', e);
      return dispatch(fetchWayTaskError());
    });
};


export const fetchWayTaskCountEpic = () => (dispatch, getState) => {
  dispatch(fetchWayTaskCount());
  const selectedProvince = getState().waytasks.selectedProvince;
  const url = selectedProvince ? `${config.api}/tasks/count?province=${selectedProvince}` : `${config.api}/tasks/count`;

  fetch(url)
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


export const markWayTaskPendingEpic = wayIds => dispatch => {
  dispatch(markWayTaskPending());

  return fetch(`${config.api}/tasks/pending`, {
    method: 'PUT',
    body: new Blob([JSON.stringify({ way_ids: wayIds })], { type: 'application/json' })
  })
    .then(response => {
      if (response.status >= 400) {
        console.error('Error marking task as pending', response.statusText);
        dispatch(markWayTaskPendingError());
      }

      dispatch(markWayTaskPendingSuccess());
    });
};

export const dedupeWayTaskEpic = (taskId, wayIds, wayIdToKeep, dedupeId) => (dispatch, getState) => {
  dispatch(dedupeWayTask(taskId, wayIds, wayIdToKeep, dedupeId));
  // delete ways
  dispatch(deleteEntireWaysEpic(taskId, wayIds))
    .then(() => {
      dispatch(editRoadIdEpic(wayIdToKeep, dedupeId))
        .then(() => { dispatch(dedupeWayTaskSuccess); })
        .catch((err) => { dispatch(dedupeWayTaskError(err)); });
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
    skipped: [],
    provinces: [],
    selectedProvince: null,
    dedupeTaskId: null,
    wayIdsToDelete: [],
    dedupeIdToApply: null,
    wayIdToKeep: null,
    osmChangeTaskId: null
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
      updatedAt: action.updatedAt,
      status: 'complete'
    });
  } else if (action.type === FETCH_WAY_TASK_ERROR) {
    return Object.assign({}, state, {
      status: action.error.message === 'No tasks remaining' ? 'No tasks remaining' : 'error'
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
  } else if (action.type === SELECT_NEXT_WAY_TASK_PROVINCE) {
    return Object.assign({}, state, {
      selectedProvince: action.selectedProvince
    });
  } else if (action.type === DEDUPE_WAY_TASK) {
    return Object.assign({}, state, {
      dedupeTaskId: action.taskId,
      wayIdsToDelete: action.wayIdsToDelete,
      dedupeIdToApply: action.dedupeIdToApply,
      wayIdToKeep: action.wayIdToKeep
    });
  } else if (action.type === REQUEST_OSM_CHANGE_SUCCESS) {
    return Object.assign({}, state, {
      osmChangeTaskId: action.taskId
    });
  }

  return state;
};
