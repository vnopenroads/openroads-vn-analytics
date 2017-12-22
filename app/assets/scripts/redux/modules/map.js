import {
  RECEIVE_ADMIN_BBOX,
  RECIEVE_VPROMMS_BBOX
} from '../../actions/action-types';
import {
  bboxToLngLatZoom
} from '../../utils/zoom';


/**
 * constants
 */
export const SET_MAP_POSITION = 'SET_MAP_POSITION';


/**
 * actions
 */
export const setMapPosition = (lng, lat, zoom) =>
  ({ type: SET_MAP_POSITION, lng, lat, zoom });


/**
 * reducer
 */
export default (
  state = {
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
      zoom: action.zoom
    });
  } else if (action.type === RECEIVE_ADMIN_BBOX) {
    const { lng, lat, zoom } = bboxToLngLatZoom(action.json.bbox);

    return Object.assign({}, state, {
      lng,
      lat,
      zoom
    });
  } else if (action.type === RECIEVE_VPROMMS_BBOX) {
    const { lng, lat, zoom } = bboxToLngLatZoom(action.json);

    return Object.assign({}, state, {
      lng,
      lat,
      zoom
    });
  }

  return state;
};
