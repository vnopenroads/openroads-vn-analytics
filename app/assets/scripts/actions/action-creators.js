import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

function requestAdminSubregions () {
  return {
    type: actions.REQUEST_ADMIN_SUBREGIONS
  };
}

function receiveAdminSubregions (json) {
  return {
    type: actions.RECEIVE_ADMIN_SUBREGIONS,
    json: json,
    receivedAt: Date.now()
  };
}

export function fetchAdminSubregions (id = null) {
  return dispatch => {
    dispatch(requestAdminSubregions());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    let url = id === null ? `${config.api}/admin/subregions` : `${config.api}/admin/${id}/subregions`;
    console.time('fetch subregions');
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        console.timeEnd('fetch subregions');
        // setTimeout(() => dispatch(receiveAdminSubregions(json)), 2000);
        dispatch(receiveAdminSubregions(json));
      });

      // In a real world app, you also want to
      // catch any error in the network call.
  };
}
