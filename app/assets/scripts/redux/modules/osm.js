import XmlReader from 'xml-reader';
import {
  fetchWayTaskEpic
} from './tasks';
import config from '../../config';

/**
 * Utils
 */
const objectToBlob = (obj) =>
  new Blob([JSON.stringify(obj, null, 2)], {type: 'application/json'});

const createChangesetRequest = (taskId, payload) => (
  fetch(`${config.api}/changeset/create`, {
    method: 'PUT',
    body: objectToBlob({ uid: 555555, user: 'Openroads Tasks' })
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.textStatus);
      }
      return response.text();
    })
);

const uploadChangesetRequest = (changesetId, taskId, payload) => (
  fetch(`${config.api}/changeset/${changesetId}/upload`, {
    method: 'POST',
    body: objectToBlob({ osmChange: payload })
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.textStatus);
      }
    })
);

/**
 * constants
 */
export const REQUEST_OSM_CHANGE = 'REQUEST_OSM_CHANGE';
export const REQUEST_OSM_CHANGE_SUCCESS = 'REQUEST_OSM_CHANGE_SUCCESS';
export const REQUEST_OSM_CHANGE_ERROR = 'REQUEST_OSM_CHANGE_ERROR';


/**
 * action creators
 */
export const requestOsmChange = (taskId) => ({ type: REQUEST_OSM_CHANGE, taskId });
export const requestOsmChangeSuccess = (taskId) => ({ type: REQUEST_OSM_CHANGE_SUCCESS, taskId });
export const requestOsmChangeError = (taskId) => ({ type: REQUEST_OSM_CHANGE_ERROR, taskId });


export const queryOsmEpic = (taskId, payload) => (dispatch) => {
  dispatch(requestOsmChange(taskId));

  createChangesetRequest(taskId, payload)
    .then(changesetId => uploadChangesetRequest(changesetId, taskId, payload))
    .then(() => {
      dispatch(fetchWayTaskEpic(taskId));
      dispatch(requestOsmChangeSuccess(taskId));
    })
    .catch(e => {
      console.error('Error querying Osm', e);
      dispatch(requestOsmChangeError(taskId));
    });
};

// Since the geojson that powers the tasks endpoint doesn't include node IDs,
// we must query the XML endpoint to get these IDs, then format them into
// a `delete` action.
export const deleteEntireWaysEpic = (taskId, wayIds) => (dispatch) => {
  dispatch(requestOsmChange(taskId));

  return fetch(`${config.api}/api/0.6/ways?nodes=true&excludeDoubleLinkedNodes=true&ways=${wayIds.join(',')}`)
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then((xmlResponse) => {
      // TODO - wrap XmlReader in promise to make Epic promises more composable
      const reader = XmlReader.create({ stream: true });
      const nodeIds = [];

      reader.on('tag:node', node => {
        if (node.attributes.id) {
          nodeIds.push(node.attributes.id);
        }
      });
      reader.on('done', () => {
        const payload = {
          delete: {
            node: nodeIds.map(id => ({ id })),
            way: wayIds.map(id => ({ id }))
          }
        };
        createChangesetRequest(taskId, payload)
          .then(changesetId => uploadChangesetRequest(changesetId, taskId, payload))
          .then(() => {
            dispatch(fetchWayTaskEpic(taskId));
            dispatch(requestOsmChangeSuccess(taskId));
          })
          .catch(e => {
            console.error('Error Deleting Way', e);
            dispatch(requestOsmChangeError(taskId));
          });
      });
      reader.parse(xmlResponse);
    });
};



/**
 * reducer
 */
export default (
  state = {
    status: 'complete'
  },
  action
) => {
  switch (action.type) {
    case REQUEST_OSM_CHANGE:
      return Object.assign({}, state, {
        status: 'pending'
      });
    case REQUEST_OSM_CHANGE_SUCCESS:
      return Object.assign({}, state, {
        status: 'complete'
      });
    case REQUEST_OSM_CHANGE_ERROR:
      return Object.assign({}, state, {
        status: 'error'
      });
  }

  return state;
};
