import {
  format
} from 'url';
import {
  reduce,
  map,
  property,
  omit,
  merge
} from 'lodash';
import {
  clearRoadCount
} from './roadCount';
import config from '../../config';


/**
 * Utils
 */
export const roadIdIsValid = (id, province, district) => {
  return /^\d{3}([A-ZĐ]{2}|00)\d{5}$/.test(id) &&
    (!province || id.substring(0, 2) === province) &&
    (!district || id.substring(3, 5) === district);
};
export const getRoadPageKey = (province = '', district = '', page, sortField, sortOrder) =>
  `${province}-${district}-${page}-${sortField}-${sortOrder}`;


/**
 * constants
 */
export const FETCH_ROADS = 'FETCH_ROADS';
export const FETCH_ROADS_SUCCESS = 'FETCH_ROADS_SUCCESS';
export const FETCH_ROADS_ERROR = 'FETCH_ROADS_ERROR';
export const CLEAR_ROADS_PAGES = 'CLEAR_ROADS_PAGES';
export const FETCH_ROAD_GEOMETRY = 'FETCH_ROAD_GEOMETRY';
export const FETCH_ROAD_GEOMETRY_SUCCESS = 'FETCH_ROAD_GEOMETRY_SUCCESS';
export const FETCH_ROAD_GEOMETRY_ERROR = 'FETCH_ROAD_GEOMETRY_ERROR';
export const CREATE_ROAD = 'CREATE_ROAD';
export const CREATE_ROAD_SUCCESS = 'CREATE_ROAD_SUCCESS';
export const CREATE_ROAD_ERROR = 'CREATE_ROAD_ERROR';
export const EDIT_ROAD = 'EDIT_ROAD';
export const EDIT_ROAD_SUCCESS = 'EDIT_ROAD_SUCCESS';
export const EDIT_ROAD_ERROR = 'EDIT_ROAD_ERROR';
export const DELETE_ROAD = 'DELETE_ROAD';
export const DELETE_ROAD_SUCCESS = 'DELETE_ROAD_SUCCESS';
export const DELETE_ROAD_ERROR = 'DELETE_ROAD_ERROR';
export const CREATE_ROAD_PROPERTY = 'CREATE_ROAD_PROPERTY';
export const CREATE_ROAD_PROPERTY_SUCCESS = 'CREATE_ROAD_PROPERTY_SUCCESS';
export const CREATE_ROAD_PROPERTY_ERROR = 'CREATE_ROAD_PROPERTY_ERROR';
export const EDIT_ROAD_PROPERTY = 'EDIT_ROAD_PROPERTY';
export const EDIT_ROAD_PROPERTY_SUCCESS = 'EDIT_ROAD_PROPERTY_SUCCESS';
export const EDIT_ROAD_PROPERTY_ERROR = 'EDIT_ROAD_PROPERTY_ERROR';
export const EDIT_ROAD_STATUS = 'EDIT_ROAD_STATUS';
export const EDIT_ROAD_STATUS_SUCCESS = 'EDIT_ROAD_STATUS_SUCCESS';
export const EDIT_ROAD_STATUS_ERROR = 'EDIT_ROAD_STATUS_ERROR';
export const DELETE_ROAD_PROPERTY = 'DELETE_ROAD_PROPERTY';
export const DELETE_ROAD_PROPERTY_SUCCESS = 'DELETE_ROAD_PROPERTY_SUCCESS';
export const DELETE_ROAD_PROPERTY_ERROR = 'DELETE_ROAD_PROPERTY_ERROR';
export const OP_ON_ROAD_PROPERTY = 'OP_ON_ROAD_PROPERTY';
export const OP_ON_ROAD_PROPERTY_SUCCESS = 'OP_ON_ROAD_PROPERTY_SUCCESS';
export const OP_ON_ROAD_PROPERTY_ERROR = 'OP_ON_ROAD_PROPERTY_ERROR';
export const FETCH_ROAD_BBOX = 'FETCH_ROAD_BBOX';
export const FETCH_ROAD_BBOX_SUCCESS = 'FETCH_ROAD_BBOX_SUCCESS';
export const FETCH_ROAD_BBOX_ERROR = 'FETCH_ROAD_BBOX_ERROR';
export const FETCH_ROAD_PROPERTY = 'FETCH_ROAD_PROPERTY';
export const FETCH_ROAD_PROPERTY_ERROR = 'FETCH_ROAD_PROPERTY';
export const FETCH_ROAD_PROPERTY_SUCCESS = 'FETCH_ROAD_PROPERTY_SUCCESS';
export const EDIT_ROAD_ID = 'EDIT_ROAD_ID';
export const EDIT_ROAD_ID_SUCCESS = 'EDIT_ROAD_ID_SUCCESS';
export const EDIT_ROAD_ID_ERROR = 'EDIT_ROAD_ID_ERROR';

/**
 * actions
 */
export const fetchRoads = (province, district, page, sortField, sortOrder) =>
  ({ type: FETCH_ROADS, province, district, page, sortField, sortOrder });
export const fetchRoadsSuccess = (roadsById, roadsByPage, province, district, page, sortField, sortOrder) =>
  ({ type: FETCH_ROADS_SUCCESS, roadsById, roadsByPage, province, district, page, sortField, sortOrder });
export const fetchRoadsError = (error, province, district, page, sortField, sortOrder) =>
  ({ type: FETCH_ROADS_ERROR, error, province, district, page, sortField, sortOrder });
export const clearRoadsPages = () => ({ type: CLEAR_ROADS_PAGES });

export const fetchRoadGeometry = (id) => ({ type: FETCH_ROAD_GEOMETRY, id });
export const fetchRoadGeometrySuccess = (id, geoJSON) => ({ type: FETCH_ROAD_GEOMETRY_SUCCESS, id, geoJSON });
export const fetchRoadGeometryError = (id, error) => ({ type: FETCH_ROAD_GEOMETRY_ERROR, id, error });

export const editRoad = (id, newId) => ({ type: EDIT_ROAD, id, newId });
export const editRoadSuccess = (id, newId) => ({ type: EDIT_ROAD_SUCCESS, id, newId });
export const editRoadError = (id, newId, error) => ({ type: EDIT_ROAD_ERROR, id, newId, error });

export const deleteRoad = (id) => ({ type: DELETE_ROAD, id });
export const deleteRoadSuccess = (id) => ({ type: DELETE_ROAD_SUCCESS, id });
export const deleteRoadError = (id, error) => ({ type: DELETE_ROAD_ERROR, id, error });

export const createRoad = (id) => ({ type: CREATE_ROAD, id });
export const createRoadSuccess = () => ({ type: CREATE_ROAD_SUCCESS });
export const createRoadError = (error) => ({ type: CREATE_ROAD_ERROR, error });

export const createRoadProperty = (id, key, value) => ({ type: CREATE_ROAD_PROPERTY, id, key, value });
export const createRoadPropertySuccess = (id, key, value) => ({ type: CREATE_ROAD_PROPERTY_SUCCESS, id, key, value });
export const createRoadPropertyError = (id, key, value, error) => ({ type: CREATE_ROAD_PROPERTY_ERROR, id, key, value, error });

export const editRoadProperty = (id, key, value) => ({ type: EDIT_ROAD_PROPERTY, id, key, value });
export const editRoadPropertySuccess = (id, key, value) => ({ type: EDIT_ROAD_PROPERTY_SUCCESS, id, key, value });
export const editRoadPropertyError = (id, key, value, error) => ({ type: EDIT_ROAD_PROPERTY_ERROR, id, key, value, error });

export const editRoadStatus = (id, value) => ({ type: EDIT_ROAD_STATUS, id, value });
export const editRoadStatusSuccess = (id, value) => ({ type: EDIT_ROAD_STATUS_SUCCESS, id, value });
export const editRoadStatusError = (id, value, error) => ({ type: EDIT_ROAD_STATUS_ERROR, id, value, error });

export const deleteRoadProperty = (id, key) => ({ type: DELETE_ROAD_PROPERTY, id, key });
export const deleteRoadPropertySuccess = (id, key) => ({ type: DELETE_ROAD_PROPERTY_SUCCESS, id, key });
export const deleteRoadPropertyError = (id, key, error) => ({ type: DELETE_ROAD_PROPERTY_ERROR, id, key, error });

export const opOnRoadProperty = () => ({ type: OP_ON_ROAD_PROPERTY });
export const opOnRoadPropertySuccess = (data) => ({ type: OP_ON_ROAD_PROPERTY_SUCCESS, data });
export const opOnRoadPropertyError = (error) => ({ type: OP_ON_ROAD_PROPERTY_ERROR, error });

export const fetchRoadBbox = (roadId) => ({ type: FETCH_ROAD_BBOX, roadId });
export const fetchRoadBboxSuccess = (roadId, bbox) => ({ type: FETCH_ROAD_BBOX_SUCCESS, roadId, bbox });
export const fetchRoadBboxError = (roadId, error) => ({ type: FETCH_ROAD_BBOX_ERROR, roadId, error });

export const fetchRoadProperty = (roadId) => ({ type: FETCH_ROAD_PROPERTY, roadId });
export const fetchRoadPropertySuccess = (roadId, properties) => ({ type: FETCH_ROAD_PROPERTY_SUCCESS, roadId, properties });
export const fetchRoadPropertyError = (roadId, error) => ({ type: FETCH_ROAD_PROPERTY_ERROR, roadId, error });

export const editRoadId = (wayId, vprommId) => ({ type: EDIT_ROAD_ID, wayId, vprommId });
export const editRoadIdSucess = (wayId, vprommId) => ({ type: EDIT_ROAD_ID_SUCCESS, wayId });
export const editRoadIdError = (wayId, error) => ({ type: EDIT_ROAD_ID_ERROR, wayId, error });

export const fetchRoadsEpic = (province, district, page, sortField, sortOrder) => (dispatch) => {
  dispatch(fetchRoads(province, district, page, sortField, sortOrder));

  return fetch(
    format({ pathname: `${config.api}/properties/roads`, query: { province, district, page, sortField, sortOrder } })
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((roads) => {
      // normalize response
      const roadsById = reduce(roads, (roadMap, road) => {
        roadMap[road.id] = omit(road, ['id']);
        return roadMap;
      }, {});
      const roadsByPage = map(roads, property('id'));

      dispatch(fetchRoadsSuccess(roadsById, roadsByPage, province, district, page, sortField, sortOrder));
    })
    .catch((err) => dispatch(fetchRoadsError(err, province, district, page, sortField, sortOrder)));
};


export const fetchRoadGeometryEpic = (id) => (dispatch) => {
  dispatch(fetchRoadGeometry(id));

  return fetch(`${config.api}/properties/roads/${id}.geojson`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(geoJSON => dispatch(fetchRoadGeometrySuccess(id, geoJSON)))
    .catch(err => dispatch(fetchRoadGeometryError(id, err)));
};


export const createRoadEpic = (id) => (dispatch) => {
  dispatch(createRoad());

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'PUT'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((id) => {
      return Promise.all([
        dispatch(createRoadSuccess(id)),
        dispatch(clearRoadsPages()),
        dispatch(clearRoadCount())
      ]);
    }, (err) => dispatch(createRoadError(err.message)));
};


export const editRoadEpic = (id, newId) => (dispatch) => {
  dispatch(editRoad(id, newId));

  return fetch(`${config.api}/properties/roads/${id}/move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: newId })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(({ id: newId }) => {
      return Promise.all([
        dispatch(editRoadSuccess(id, newId)),
        dispatch(clearRoadsPages()),
        dispatch(clearRoadCount())
      ]);
    }, (err) => dispatch(editRoadError(id, newId, err.message)));
};


export const editRoadStatusEpic = (id, status) => (dispatch) => {
  dispatch(editRoad(id, status));

  return fetch(`${config.api}/properties/roads/${id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(() => {
      return Promise.all([
        dispatch(editRoadStatusSuccess(id, status)),
        dispatch(clearRoadsPages()),
        dispatch(clearRoadCount())
      ]);
    }, (err) => dispatch(editRoadStatusError(id, status, err.message)));
};


export const deleteRoadEpic = (id) => (dispatch) => {
  dispatch(deleteRoad(id));

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      dispatch(deleteRoadSuccess(id));
      dispatch(clearRoadsPages());
      dispatch(clearRoadCount());
    })
    .catch(err => dispatch(deleteRoadError(id, err.message)));
};


export const createRoadPropertyEpic = (id, key, value) => (dispatch) => {
  dispatch(createRoadProperty(id, key, value));

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json'
    },
    body: JSON.stringify([{ op: 'add', path: `/${key}`, value }])
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      dispatch(createRoadPropertySuccess(id, key, value));
    })
    .catch((err) => dispatch(createRoadPropertyError(id, key, value, err)));
};


export const opOnRoadPropertyEpic = (id, operations) => (dispatch) => {
  dispatch(opOnRoadProperty());

  const computeOps = (type, ops) => (ops[type] || []).map(field => {
    const path = field.key.replace(/~/g, '~0').replace(/\//g, '~1');
    return {op: type, path: `/${path}`, value: field.value};
  });
  const ops = computeOps('add', operations)
    .concat(computeOps('replace', operations))
    .concat(computeOps('remove', operations));

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json'
    },
    body: JSON.stringify(ops)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return {ok: true};
    })
    .then(res => dispatch(opOnRoadPropertySuccess(res)), (err) => dispatch(opOnRoadPropertyError(err)));
};


export const editRoadPropertyEpic = (id, key, value) => (dispatch) => {
  dispatch(editRoadProperty(id, key, value));

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json'
    },
    body: JSON.stringify([{ op: 'replace', path: `/${key}`, value }])
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      dispatch(editRoadPropertySuccess(id, key, value));
    })
    .catch((err) => dispatch(editRoadPropertyError(id, key, value, err)));
};


export const deleteRoadPropertyEpic = (id, key) => (dispatch) => {
  dispatch(deleteRoadProperty(id, key));

  return fetch(`${config.api}/properties/roads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json'
    },
    body: JSON.stringify([{ op: 'remove', path: `/${key}` }])
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      dispatch(deleteRoadPropertySuccess(id, key));
    })
    .catch((err) => dispatch(deleteRoadPropertyError(id, key, err)));
};


export const fetchRoadBboxEpic = (roadId) => (dispatch) => {
  dispatch(fetchRoadBbox());

  return fetch(`${config.api}/way/${roadId}/bbox`)
    .then(response => {
      if (!response.ok) {
        return new Error(response.status);
      }

      return response.json();
    })
    .then(bbox => dispatch(fetchRoadBboxSuccess(roadId, bbox)))
    .catch(err => dispatch(fetchRoadBboxError(roadId, err)));
};

export const fetchRoadPropertyEpic = (roadId) => (dispatch) => {
  dispatch(fetchRoadProperty());

  return fetch(`${config.api}/properties/roads/${roadId}`)
    .then(response => {
      if (!response.ok) {
        return new Error(response.status);
      }

      return response.json();
    })
    .then(property => dispatch(fetchRoadPropertySuccess(roadId, property)))
    .catch(err => dispatch(fetchRoadPropertyError(roadId, err)));
};

export const editRoadIdEpic = (wayId, vprommId) => (dispatch) => {
  dispatch(editRoadId(wayId, vprommId));

  return fetch(`${config.api}/way/tags/vprommid/${wayId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json'
    },
    body: JSON.stringify({'vprommid': vprommId})
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then(wayId => dispatch(editRoadIdSucess(wayId)))
    .catch(err => dispatch(editRoadError(err)));
};

/**
 * reducer
 */
export default (
  state = {
    roadsById: {},
    roadsByPage: {}
  },
  action
) => {
  if (action.type === FETCH_ROADS) {
    const { province, district, page, sortField, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortField, sortOrder);

    return Object.assign({}, state, {
      roadsByPage: Object.assign({}, state.roadsByPage, {
        [pageKey]: {
          status: 'pending',
          roads: state.roadsByPage[pageKey] ? state.roadsByPage[pageKey].roads : []
        }
      })
    });
  } else if (action.type === FETCH_ROADS_SUCCESS) {
    const { roadsById, roadsByPage, province, district, page, sortField, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortField, sortOrder);

    return Object.assign({}, state, {
      roadsById: merge({}, state.roadsById, roadsById),
      roadsByPage: Object.assign({}, state.roadsByPage, {
        [pageKey]: {
          status: 'complete',
          roads: roadsByPage
        }
      })
    });
  } else if (action.type === FETCH_ROADS_ERROR) {
    const { province, district, page, sortField, sortOrder } = action;
    const pageKey = getRoadPageKey(province, district, page, sortField, sortOrder);

    return Object.assign({}, state, {
      roadsByPage: Object.assign({}, state.roadsByPage, {
        [pageKey]: {
          status: 'error',
          roads: []
        }
      })
    });
  } else if (action.type === CLEAR_ROADS_PAGES) {
    return Object.assign({}, state, {
      roadsByPage: {}
    });
  } else if (action.type === FETCH_ROAD_GEOMETRY_SUCCESS) {
    return Object.assign({}, state, {
      roadsById: Object.assign({}, state.roadsById, {
        [action.id]: Object.assign({}, state.roadsById[action.id] || {}, {
          geoJSON: action.geoJSON
        })
      })
    });
  } else if (action.type === CREATE_ROAD_PROPERTY_SUCCESS) {
    return Object.assign({}, state, {
      roadsById: Object.assign({}, state.roadsById, {
        [action.id]: Object.assign({}, state.roadsById[action.id], {
          properties: Object.assign({}, state.roadsById[action.id].properties, {
            [action.key]: action.value
          })
        })
      })
    });
  } else if (action.type === EDIT_ROAD_PROPERTY_SUCCESS) {
    return Object.assign({}, state, {
      roadsById: Object.assign({}, state.roadsById, {
        [action.id]: Object.assign({}, state.roadsById[action.id], {
          properties: Object.assign({}, state.roadsById[action.id].properties, {
            [action.key]: action.value
          })
        })
      })
    });
  } else if (action.type === DELETE_ROAD_PROPERTY_SUCCESS) {
    return Object.assign({}, state, {
      roadsById: Object.assign({}, state.roadsById, {
        [action.id]: Object.assign({}, state.roadsById[action.id], {
          properties: omit(state.roadsById[action.id].properties, [action.key])
        })
      })
    });
  } else if (action.type === EDIT_ROAD_STATUS_SUCCESS) {
    return Object.assign({}, state, {
      roadsById: Object.assign({}, state.roadsById, {
        [action.id]: Object.assign({}, state.roadsById[action.id], {
          status: action.value
        })
      })
    });
  } else if (action.type === FETCH_ROAD_PROPERTY_SUCCESS) {
    return Object.assign({}, state, {
      roadsById: Object.assign({}, state.roadsById, {
        [action.roadId]: Object.assign({}, state.roadsById[action.roadId], {
          properties: action.properties
        })
      })
    });
  } else if (action.type === EDIT_ROAD_ID_SUCCESS) {
    return Object.assign({}, state);
  } else if (action.type === DELETE_ROAD_SUCCESS) {
    return Object.assign({}, state, {
      roadsById: Object.assign({}, state.roadsById, delete state.roadsById[action.id])
    });
  }

  return state;
};
