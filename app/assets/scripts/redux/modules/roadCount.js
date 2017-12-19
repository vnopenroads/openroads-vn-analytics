import {
  format
} from 'url';
import config from '../../config';


/**
 * utils
 */
export const getRoadCountKey = (province = '', district = '') =>
  `${province}-${district}`;

/**
 * constants
 */
export const FETCH_ROAD_COUNT = 'FETCH_ROAD_COUNT';
export const FETCH_ROAD_COUNT_SUCCESS = 'FETCH_ROAD_COUNT_SUCCESS';
export const FETCH_ROAD_COUNT_ERROR = 'FETCH_ROAD_COUNT_ERROR';
export const CLEAR_ROAD_COUNT = 'CLEAR_ROAD_COUNT';

/**
 * actions
 */
export const fetchRoadCount = (province, district) => ({ type: FETCH_ROAD_COUNT, province, district });
export const fetchRoadCountSuccess = (count, pageCount, osmCount, province, district) =>
  ({ type: FETCH_ROAD_COUNT_SUCCESS, count, pageCount, osmCount, province, district });
export const fetchRoadCountError = (error, province, district) =>
  ({ type: FETCH_ROAD_COUNT_ERROR, error, province, district });
export const clearRoadCount = () => ({ type: CLEAR_ROAD_COUNT });


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
    .then(({ count, pageCount, osmCount }) => {
      dispatch(fetchRoadCountSuccess(count, pageCount, osmCount, province, district));
    })
    .catch((err) => dispatch(fetchRoadCountError(err, province, district)));
};


/**
 * reducer
 */
export default (
  state = {},
  action
) => {
  if (action.type === FETCH_ROAD_COUNT) {
    const { province, district } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      [roadCountKey]: Object.assign({}, state[roadCountKey] || {}, {
        status: 'pending'
      })
    });
  } else if (action.type === FETCH_ROAD_COUNT_SUCCESS) {
    const { province, district, count, pageCount, osmCount } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      [roadCountKey]: {
        status: 'complete',
        count,
        pageCount,
        osmCount
      }
    });
  } else if (action.type === FETCH_ROAD_COUNT_ERROR) {
    const { province, district } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      [roadCountKey]: {
        status: 'error',
        count: undefined,
        pageCount: undefined,
        osmCount: undefined
      }
    });
  } else if (action.type === CLEAR_ROAD_COUNT) {
    return {};
  }

  return state;
};
