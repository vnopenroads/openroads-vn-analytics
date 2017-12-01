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

const createChangeset = (dispatch, cb) => {
  const changesetUrl = `${config.api}/changeset/create`;
  const details = {
    uid: 555555,
    user: 'Openroads Tasks'
  };
  return fetch(changesetUrl, {
    method: 'PUT',
    body: objectToBlob(details)
  }).then(response => {
    if (response.status >= 400) {
      throw new Error('Bad response');
    }
    return response.text();
  }).then(cb, e => {
    return dispatch(completeOsmChange(null, e));
  });
};

const uploadChangeset = (dispatch, taskId, payload, changesetId) => {
  return fetch(`${config.api}/changeset/${changesetId}/upload`, {
    method: 'POST',
    body: objectToBlob({ osmChange: payload })
  })
  .then(() => {
    // TODO - completeOsmChange shouldn't run until after fetchWayTask refreshes task geometry
    dispatch(fetchWayTaskEpic(taskId));
    dispatch(completeOsmChange(taskId));
  });
};

export function queryOsm (taskId, payload) {
  return function (dispatch) {
    dispatch(requestOsmChange());
    createChangeset(dispatch, changesetId => uploadChangeset(dispatch, taskId, payload, changesetId));
  };
}

// Since the geojson that powers the tasks endpoint doesn't include node IDs,
// we must query the XML endpoint to get these IDs, then format them into
// a `delete` action.
export function deleteEntireWays (taskId, wayIds) {
  return function (dispatch) {
    dispatch(requestOsmChange());

    const nodeIds = [];
    fetch(`${config.api}/api/0.6/ways?nodes=true&excludeDoubleLinkedNodes=true&ways=${wayIds.join(',')}`)
    .then(response => {
      if (response.status >= 400) {
        throw new Error('Bad response');
      }
      return response.text();
    }).then(parseXml, e => {
      return dispatch(completeOsmChange(null, e));
    });

    function parseXml (xmlDoc) {
      let reader = XmlReader.create({stream: true});
      reader.on('tag:node', node => {
        if (node.attributes.id) {
          nodeIds.push(node.attributes.id);
        }
      });
      reader.on('done', formatPayload);
      reader.parse(xmlDoc);
    }

    function formatPayload () {
      let payload = {
        delete: {
          node: nodeIds.map(id => ({ id })),
          way: wayIds.map(id => ({ id }))
        }
      };
      createChangeset(dispatch, changesetId => uploadChangeset(dispatch, taskId, payload, changesetId));
    }
  };
}



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
