import React from 'react';
import {
  compose,
  getContext,
  withHandlers
} from 'recompose';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import RoadRowProperty from '../components/road-row-property';
import {
  DELETE_ROAD_PROPERTY,
  DELETE_ROAD_PROPERTY_ERROR,
  deleteRoadPropertyEpic
} from '../redux/modules/roads';


const reducerFactory = (roadId, propertyKey) => (
  state = {
    status: 'complete',
    propertyKey,
    roadId
  },
  action
) => {
  if (action.type === DELETE_ROAD_PROPERTY && state.propertyKey === action.key) {
    return Object.assign({}, state, {
      status: 'pending'
    });
  } else if (action.type === DELETE_ROAD_PROPERTY_ERROR && state.propertyKey === action.key) {
    return Object.assign({}, state, {
      status: 'error'
    });
  }

  return state;
};


const RoadRowPropertyContainer = compose(
  getContext({ language: React.PropTypes.string }),
  local({
    key: ({ roadId, propertyKey }) => `${roadId}-${propertyKey}`,
    createStore: ({ roadId, propertyKey }) => createStore(reducerFactory(roadId, propertyKey)),
    mapDispatchToProps: (dispatch, { roadId, propertyKey }) => ({
      deleteProperty: () => dispatch(deleteRoadPropertyEpic(roadId, propertyKey))
    }),
    filterGlobalActions: ({ type }) =>
      [DELETE_ROAD_PROPERTY, DELETE_ROAD_PROPERTY_ERROR].indexOf(type) > -1
  }),
  withHandlers({
    deleteHandler: ({ deleteProperty }) => () => deleteProperty()
  })
)(RoadRowProperty);


export default RoadRowPropertyContainer;
