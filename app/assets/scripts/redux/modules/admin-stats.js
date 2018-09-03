import { combineReducers } from 'redux';
import config from '../../config';

//
// Index reducer and actions

export const FETCH_ADMIN_STATS = 'FETCH_ADMIN_STATS';
export const FETCH_ADMIN_STATS_SUCCESS = 'FETCH_ADMIN_STATS_SUCCESS';
export const FETCH_ADMIN_STATS_ERROR = 'FETCH_ADMIN_STATS_ERROR';

export const fetchAdminStatsStart = () => ({ type: FETCH_ADMIN_STATS });
export const fetchAdminStatsSucess = (data) => ({ type: FETCH_ADMIN_STATS_SUCCESS, data });
export const fetchAdminStatsError = (error) => ({ type: FETCH_ADMIN_STATS_ERROR, error });

export const fetchAdminStats = () => (dispatch) => {
  dispatch(fetchAdminStatsStart());

  return fetch(`${config.api}/admin/stats`, { method: 'GET' })
    .then(response => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((data) => dispatch(fetchAdminStatsSucess(data)), (err) => dispatch(fetchAdminStatsError(err.message)));
};

/**
 * reducer
 */
const index = (
  state = {
    fetching: false,
    fetched: false,
    data: null
  },
  action
) => {
  switch (action.type) {
    case FETCH_ADMIN_STATS:
      return Object.assign({}, state, {
        fetching: true, fetched: false
      });
    case FETCH_ADMIN_STATS_SUCCESS:
      return Object.assign({}, state, {
        fetching: false, fetched: true, data: action.data
      });
    case FETCH_ADMIN_STATS_ERROR:
      return Object.assign({}, state, {
        fetching: false, fetched: true, error: action.error
      });
  }
  return state;
};

//
// Admin Area reducer and actions

export const FETCH_ADMIN_STATS_AA = 'FETCH_ADMIN_STATS_AA';
export const FETCH_ADMIN_STATS_AA_SUCCESS = 'FETCH_ADMIN_STATS_AA_SUCCESS';
export const FETCH_ADMIN_STATS_AA_ERROR = 'FETCH_ADMIN_STATS_AA_ERROR';

export const fetchAdminStatsAAStart = (aaType, pId, dId) => ({ type: FETCH_ADMIN_STATS_AA, aaType, pId, dId });
export const fetchAdminStatsAASucess = (data, aaType, pId, dId) => ({ type: FETCH_ADMIN_STATS_AA_SUCCESS, data, aaType, pId, dId });
export const fetchAdminStatsAAError = (error, aaType, pId, dId) => ({ type: FETCH_ADMIN_STATS_AA_ERROR, error, aaType, pId, dId });

export const fetchAdminStatsAA = (aaType, pId, dId) => (dispatch) => {
  dispatch(fetchAdminStatsAAStart(aaType, pId, dId));

  const url = aaType === 'province'
    ? `${config.api}/admin/stats?province=${pId}`
    : `${config.api}/admin/stats?province=${pId}&district=${dId}`;

  return fetch(url, { method: 'GET' })
    .then(response => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((data) => {
      const province = data.provinces[0];

      const d = aaType === 'province'
        ? province
        : {
          ...province.districts[0],
          province: {
            id: province.id,
            name_en: province.name_en,
            name_vn: province.name_vn
          }
        };

      return dispatch(fetchAdminStatsAASucess(d, aaType, pId, dId));
    }, (err) => dispatch(fetchAdminStatsAAError(err.message, aaType, pId, dId)));
};

const aaState = {
  // id: {
  //   fetching: false,
  //   fetched: false,
  //   data: null
  // }
};

/**
 * reducer
 */
const aa = (state = aaState, action) => {
  let id;
  switch (action.type) {
    case FETCH_ADMIN_STATS_AA:
      id = action.aaType === 'province' ? action.pId : `${action.pId}-${action.dId}`;
      return Object.assign({}, state, {
        [id]: {fetching: true, fetched: false}
      });
    case FETCH_ADMIN_STATS_AA_SUCCESS:
      id = action.aaType === 'province' ? action.pId : `${action.pId}-${action.dId}`;
      return Object.assign({}, state, {
        [id]: {fetching: false, fetched: true, data: action.data}
      });
    case FETCH_ADMIN_STATS_AA_ERROR:
      id = action.aaType === 'province' ? action.pId : `${action.pId}-${action.dId}`;
      return Object.assign({}, state, {
        [id]: {fetching: false, fetched: true, error: action.error}
      });
  }
  return state;
};

export default combineReducers({
  index,
  aa
});
