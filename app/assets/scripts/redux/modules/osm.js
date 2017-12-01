import XmlReader from 'xml-reader';
import {
  RELOAD_WAY_TASK,
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
export const COMPLETE_OSM_CHANGE = 'COMPLETE_OSM_CHANGE';


/**
 * action creators
 */
const requestOsmChange = () => ({ type: REQUEST_OSM_CHANGE });
const completeOsmChange = (taskId, error = null) => ({
  type: COMPLETE_OSM_CHANGE,
  taskId,
  error,
  receivedAt: Date.now()
});


export const queryOsmEpic = (taskId, payload) => (dispatch) => {
  dispatch(requestOsmChange());

  createChangesetRequest(taskId, payload)
    .then(changesetId => uploadChangesetRequest(changesetId, taskId, payload))
    .then(() => {
      dispatch(fetchWayTaskEpic(taskId)); // TODO - if refresh 404s, task has been deleted and user should no longer edit the now-stale geometry
      dispatch(completeOsmChange(taskId));
    })
    .catch(e => {
      console.error('Error querying Osm', e);
      dispatch(completeOsmChange(null, e));
    });
};

// Since the geojson that powers the tasks endpoint doesn't include node IDs,
// we must query the XML endpoint to get these IDs, then format them into
// a `delete` action.
export const deleteEntireWaysEpic = (taskId, wayIds) => (dispatch) => {
  dispatch(requestOsmChange());

  fetch(`${config.api}/api/0.6/ways?nodes=true&excludeDoubleLinkedNodes=true&ways=${wayIds.join(',')}`)
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
            dispatch(fetchWayTaskEpic(taskId)); // TODO - if refresh 404s, task has been deleted and user should no longer edit the now-stale geometry
            dispatch(completeOsmChange(taskId));
          })
          .catch(e => {
            console.error('Error Deleting Way', e);
            dispatch(completeOsmChange(null, e));
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
    fetching: false,
    fetched: false,
    taskId: null,
    error: null
  },
  action
) => {
  switch (action.type) {
    case REQUEST_OSM_CHANGE:
      return Object.assign({}, state, {
        error: null,
        fetching: true
      });
    case COMPLETE_OSM_CHANGE:
      if (action.error) {
        return Object.assign({}, state, {
          error: action.error,
          fetching: false,
          fetched: true
        });
      }

      return Object.assign({}, state, {
        taskId: action.taskId,
        fetching: false,
        fetched: true
      });
    case RELOAD_WAY_TASK:
      return Object.assign({}, state, {
        fetched: false,
        taskId: false
      });
  }

  return state;
};
