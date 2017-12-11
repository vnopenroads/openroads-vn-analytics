import config from '../../config';
import {
  EDIT_ROAD_SUCCESS,
  DELETE_ROAD_SUCCESS
} from './roads';


/**
 * constants
 */
export const REQUEST_ADMIN_ROADS = 'REQUEST_ADMIN_ROADS';
export const RECEIVE_ADMIN_ROADS = 'RECEIVE_ADMIN_ROADS';
export const REMOVE_ADMIN_ROADS = 'REMOVE_ADMIN_ROADS';


/**
 * actions
 */
export const requestAdminRoads = () => ({ type: REQUEST_ADMIN_ROADS });

export const receiveAdminRoads = (ids) => ({ type: RECEIVE_ADMIN_ROADS, ids });

export const removeAdminRoads = () => ({ type: REMOVE_ADMIN_ROADS });

export const fetchAdminRoads = (json, level, limit, offset) => (dispatch) => {
  dispatch(requestAdminRoads());

  // TODO - use a proper url parser
  let url = `${config.api}/admin/roads?province=${json[0]}`;
  if (level === 'district') {
    url = `${url}&district=${json[1]}`;
  }
  if (offset) {
    url = `${url}&offset=${offset}`;
  }
  if (limit) {
    url = `${url}&limit=${limit}`;
  }

  return fetch(url)
    .then(response => response.json())
    .then(ids => {
      // TODO - add error handling
      dispatch(receiveAdminRoads(ids));
    });
};


/**
 * reducer
 */
export default (
  state = {
    status: 'complete',
    ids: []
  },
  action
) => {
  switch (action.type) {
    case REQUEST_ADMIN_ROADS:
      return Object.assign({}, state, {
        status: 'pending'
      });
    case RECEIVE_ADMIN_ROADS:
      return Object.assign({}, state, {
        status: 'complete',
        ids: action.ids
      });
    case REMOVE_ADMIN_ROADS:
      return {
        status: 'complete',
        ids: []
      };
    case EDIT_ROAD_SUCCESS:
      return Object.assign({}, state, {
        ids: state.ids
          .filter(id => id !== action.id)
          .concat(action.newId)
      });
    case DELETE_ROAD_SUCCESS:
      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== action.id)
      });
  }
  return state;
};
