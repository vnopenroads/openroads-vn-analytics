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
  }

  return state;
};
