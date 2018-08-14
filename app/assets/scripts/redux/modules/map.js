import {
  RECEIVE_ADMIN_BBOX
} from '../../actions/action-types';
import {
  bboxToLngLatZoom
} from '../../utils/zoom';
import {
  FETCH_ROAD_BBOX_SUCCESS,
  FETCH_ROAD_PROPERTY_SUCCESS
} from './roads';


/**
 * constants
 */
export const SET_MAP_POSITION = 'SET_MAP_POSITION';


/**
 * actions
 */
export const setMapPosition = (lng, lat, zoom, waySlug) =>
  ({ type: SET_MAP_POSITION, lng, lat, zoom, waySlug });


/**
 * reducer
 */
export default (
  state = {
    waySlug: null,
    lat: 20.029,
    lng: 105.73,
    zoom: 6
  },
  action
) => {
  if (action.type === SET_MAP_POSITION) {
    return Object.assign({}, state, {
      lat: action.lat,
      lng: action.lng,
      zoom: action.zoom,
      way: action.waySlug
    });
  } else if (action.type === RECEIVE_ADMIN_BBOX) {
    const { lng, lat, zoom } = bboxToLngLatZoom(action.json.bbox);

    return Object.assign({}, state, {
      lng,
      lat,
      zoom
    });
  } else if (action.type === FETCH_ROAD_BBOX_SUCCESS) {
    const { lng, lat, zoom } = bboxToLngLatZoom(action.bbox);

    return Object.assign({}, state, {
      lng,
      lat,
      zoom
    });
  } else if (action.type === FETCH_ROAD_PROPERTY_SUCCESS) {
    const waySlug = 'w' + action.properties.way_id;

    return Object.assign({}, state, {waySlug});
  }

  return state;
};
