import {
  format
} from 'url';
import config from '../../config';


/**
 * utils
 */
export const getRoadCountKey = (province, district) =>
  district ? `${province}-${district}` : province;

/**
 * constants
 */
export const FETCH_PROVINCES_ROAD_COUNT = 'FETCH_PROVINCES_ROAD_COUNT';
export const FETCH_PROVINCES_ROAD_COUNT_SUCCESS = 'FETCH_PROVINCES_ROAD_COUNT_SUCCESS';
export const FETCH_PROVINCES_ROAD_COUNT_ERROR = 'FETCH_PROVINCES_ROAD_COUNT_ERROR';
export const FETCH_DISTRICT_ROAD_COUNT = 'FETCH_DISTRICT_ROAD_COUNT';
export const FETCH_DISTRICT_ROAD_COUNT_SUCCESS = 'FETCH_DISTRICT_ROAD_COUNT_SUCCESS';
export const FETCH_DISTRICT_ROAD_COUNT_ERROR = 'FETCH_DISTRICT_ROAD_COUNT_ERROR';
export const CLEAR_ROAD_COUNT = 'CLEAR_ROAD_COUNT';

/**
 * actions
 */
export const fetchProvincesRoadCount = () => ({ type: FETCH_PROVINCES_ROAD_COUNT });
export const fetchProvincesRoadCountSuccess = (provinces) =>
  ({ type: FETCH_PROVINCES_ROAD_COUNT_SUCCESS, provinces });
export const fetchProvincesRoadCountError = (error) =>
  ({ type: FETCH_PROVINCES_ROAD_COUNT_ERROR, error });
export const fetchDistrictRoadCount = (province, district) => ({ type: FETCH_DISTRICT_ROAD_COUNT, province, district });
export const fetchDistrictRoadCountSuccess = (province, district, count, osmCount) =>
  ({ type: FETCH_DISTRICT_ROAD_COUNT_SUCCESS, province, district, count, osmCount });
export const fetchDistrictRoadCountError = (province, district, error) =>
  ({ type: FETCH_DISTRICT_ROAD_COUNT_ERROR, province, district, error });
export const clearRoadCount = () => ({ type: CLEAR_ROAD_COUNT });


export const fetchProvincesRoadCountEpic = () => (dispatch) => {
  dispatch(fetchProvincesRoadCount());

  return fetch(`${config.api}/admin/roads/total`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((provinces) => {
      dispatch(fetchProvincesRoadCountSuccess(provinces));
    })
    .catch((err) => dispatch(fetchProvincesRoadCountError(err)));
};


export const fetchDistrictRoadCountEpic = (province, district) => (dispatch) => {
  dispatch(fetchDistrictRoadCount(province, district));

  return fetch(
    format({ pathname: `${config.api}/properties/roads/count`, query: { province, district } })
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(({ count, osmCount }) => {
      dispatch(fetchDistrictRoadCountSuccess(province, district, count, osmCount));
    })
    .catch((err) => dispatch(fetchDistrictRoadCountError(province, district, err)));
};


/**
 * reducer
 */
export default (
  state = {
    provinces: {},
    districts: {}
  },
  action
) => {
  if (action.type === FETCH_PROVINCES_ROAD_COUNT) {
    return Object.assign({}, state, {
      provinces: Object.assign({}, state.provinces, {
        status: 'pending'
      })
    });
  } else if (action.type === FETCH_PROVINCES_ROAD_COUNT_SUCCESS) {
    return Object.assign({}, state, {
      provinces: Object.assign({}, state.provinces, {
        status: 'complete',
        provinceCount: action.provinces
      })
    });
  } else if (action.type === FETCH_PROVINCES_ROAD_COUNT_ERROR) {
    return Object.assign({}, state, {
      provinces: Object.assign({}, state.provinces, {
        status: 'error'
      })
    });
  } else if (action.type === FETCH_DISTRICT_ROAD_COUNT) {
    const { province, district } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      districts: Object.assign({}, state.districts, {
        [roadCountKey]: Object.assign({}, state.districts[roadCountKey] || {}, {
          status: 'pending'
        })
      })
    });
  } else if (action.type === FETCH_DISTRICT_ROAD_COUNT_SUCCESS) {
    const { province, district, count, osmCount } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      districts: Object.assign({}, state.districts, {
        [roadCountKey]: {
          status: 'complete',
          count,
          osmCount
        }
      })
    });
  } else if (action.type === FETCH_DISTRICT_ROAD_COUNT_ERROR) {
    const { province, district } = action;
    const roadCountKey = getRoadCountKey(province, district);

    return Object.assign({}, state, {
      districts: Object.assign({}, state.districts, {
        [roadCountKey]: {
          status: 'error',
          count: undefined,
          osmCount: undefined
        }
      })
    });
  } else if (action.type === CLEAR_ROAD_COUNT) {
    return {
      provinces: {},
      districts: {}
    };
  }

  return state;
};
