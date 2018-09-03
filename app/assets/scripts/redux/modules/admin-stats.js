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

export default combineReducers({
  index,
});