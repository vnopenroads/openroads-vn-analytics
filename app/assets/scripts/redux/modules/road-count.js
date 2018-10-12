import { combineReducers } from 'redux';
import { format } from 'url';
import _ from 'lodash';

import config from '../../config';


/**
 * utils
 */
export const getRoadCountKey = (province, district) =>
  district ? `${province}-${district}` : province;

export const mergeAA = (aa, data, path, additional = {}) => {
  if (!aa.code) return aa;
  const count = _.get(data, path, {});
  return {
    ...aa,
    totalRoads: typeof count.count !== 'undefined' ? count.count : null,
    osmRoads: typeof count.osmCount !== 'undefined' ? count.osmCount : null,
    ...additional
  };
};

/**
 * constants
 */
export const FETCH_AA_ROAD_COUNT = 'FETCH_AA_ROAD_COUNT';
export const FETCH_AA_ROAD_COUNT_SUCCESS = 'FETCH_AA_ROAD_COUNT_SUCCESS';
export const FETCH_AA_ROAD_COUNT_ERROR = 'FETCH_AA_ROAD_COUNT_ERROR';
export const CLEAR_ROAD_COUNT = 'CLEAR_ROAD_COUNT';

/**
 * actions
 */
export const fetchAARoadCount = (province, district) => ({ type: FETCH_AA_ROAD_COUNT, province, district });
export const fetchAARoadCountSuccess = (province, district, data) =>
  ({ type: FETCH_AA_ROAD_COUNT_SUCCESS, province, district, data });
export const fetchAARoadCountError = (province, district, error) =>
  ({ type: FETCH_AA_ROAD_COUNT_ERROR, province, district, error });
export const clearRoadCount = () => ({ type: CLEAR_ROAD_COUNT });

export const fetchAARoadCountEpic = (province, district) => (dispatch) => {
  dispatch(fetchAARoadCount(province, district));

  return fetch(
    format({ pathname: `${config.api}/properties/roads/count`, query: { province, district } })
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((data) => dispatch(fetchAARoadCountSuccess(province, district, data)), (err) => dispatch(fetchAARoadCountError(province, district, err)));
};

/**
 * reducer
 */

const aaReducer = (state = {}, action) => {
  if (action.type === FETCH_AA_ROAD_COUNT) {
    const { province, district } = action;
    const roadCountKey = getRoadCountKey(province, district);
    return {
      ...state,
      [roadCountKey]: {
        ...state[roadCountKey] || {},
        status: 'pending'
      }
    };
  } else if (action.type === FETCH_AA_ROAD_COUNT_SUCCESS) {
    const { province, district, data } = action;
    const roadCountKey = getRoadCountKey(province, district);
    return {
      ...state,
      [roadCountKey]: {
        ...state[roadCountKey] || {},
        ...data,
        status: 'complete'
      }
    };
  } else if (action.type === FETCH_AA_ROAD_COUNT_ERROR) {
    const { province, district } = action;
    const roadCountKey = getRoadCountKey(province, district);
    return {
      ...state,
      [roadCountKey]: {
        ...state[roadCountKey] || {},
        status: 'error'
      }
    };
  } else if (action.type === CLEAR_ROAD_COUNT) {
    return {};
  }

  return state;
};



/**
 * constants
 */
export const FETCH_ROAD_COUNT = 'FETCH_ROAD_COUNT';
export const FETCH_ROAD_COUNT_SUCCESS = 'FETCH_ROAD_COUNT_SUCCESS';
export const FETCH_ROAD_COUNT_ERROR = 'FETCH_ROAD_COUNT_ERROR';

/**
 * actions
 */
export const fetchRoadCount = () => ({ type: FETCH_ROAD_COUNT });
export const fetchRoadCountSuccess = (data) => ({ type: FETCH_ROAD_COUNT_SUCCESS, data });
export const fetchRoadCountError = (error) => ({ type: FETCH_ROAD_COUNT_ERROR, error });

export const fetchRoadCountEpic = () => (dispatch) => {
  dispatch(fetchRoadCount());

  return fetch(`${config.api}/properties/roads/count`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((data) => dispatch(fetchRoadCountSuccess(data)), (err) => dispatch(fetchRoadCountError(err)));
};

/**
 * reducer
 */

const indexReducer = (state = {}, action) => {
  if (action.type === FETCH_ROAD_COUNT) {
    return {
      ...state,
      status: 'pending'
    };
  } else if (action.type === FETCH_ROAD_COUNT_SUCCESS) {
    return {
      ...state,
      ...action.data,
      status: 'complete'
    };
  } else if (action.type === FETCH_ROAD_COUNT_ERROR) {
    return {
      ...state,
      status: 'error'
    };
  } else if (action.type === CLEAR_ROAD_COUNT) {
    return {};
  }

  return state;
};

//
//
//

export default combineReducers({index: indexReducer, aa: aaReducer});
