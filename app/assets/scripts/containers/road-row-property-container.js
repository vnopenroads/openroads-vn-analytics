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
  EDIT_ROAD_PROPERTY,
  EDIT_ROAD_PROPERTY_ERROR,
  DELETE_ROAD_PROPERTY,
  DELETE_ROAD_PROPERTY_ERROR,
  EDIT_ROAD_PROPERTY_SUCCESS,
  editRoadPropertyEpic,
  deleteRoadPropertyEpic
} from '../redux/modules/roads';


const reducerFactory = (roadId, propertyKey, propertyValue) => (
  state = {
    status: 'complete',
    propertyKey,
    editPropertyValue: propertyValue,
    roadId,
    viewState: 'read',
    edited: false
  },
  action
) => {
  if (action.type === 'SHOW_EDIT') {
    return Object.assign({}, state, {
      viewState: 'edit'
    });
  } else if (action.type === 'SHOW_READ') {
    return Object.assign({}, state, {
      viewState: 'read'
    });
  } else if (action.type === 'SHOW_DELETE') {
    return Object.assign({}, state, {
      viewState: 'delete'
    });
  } else if (action.type === 'UPDATE_EDIT_VALUE') {
    return Object.assign({}, state, {
      editPropertyValue: action.value
    });
  } else if (
    (action.type === DELETE_ROAD_PROPERTY || action.type === EDIT_ROAD_PROPERTY)
    && state.propertyKey === action.key
  ) {
    return Object.assign({}, state, {
      status: 'pending'
    });
  } else if (
    (action.type === DELETE_ROAD_PROPERTY_ERROR || action.type === EDIT_ROAD_PROPERTY_ERROR)
    && state.propertyKey === action.key
  ) {
    return Object.assign({}, state, {
      status: 'error'
    });
  } else if (action.type === EDIT_ROAD_PROPERTY_SUCCESS && state.propertyKey === action.key) {
    return Object.assign({}, state, {
      status: 'complete',
      viewState: 'read',
      edited: true
    });
  }

  return state;
};


const RoadRowPropertyContainer = compose(
  getContext({ language: React.PropTypes.string }),
  local({
    key: ({ roadId, propertyKey }) => `${roadId}-${propertyKey}`,
    createStore: ({ roadId, propertyKey, propertyValue }) => createStore(reducerFactory(roadId, propertyKey, propertyValue)),
    mapDispatchToProps: (dispatch, { roadId, propertyKey }) => ({
      confirmDeleteHandler: () => dispatch(deleteRoadPropertyEpic(roadId, propertyKey)),
      submitEdit: (editPropertyValue) => {
        dispatch(editRoadPropertyEpic(roadId, propertyKey, editPropertyValue));
      },
      showEditHandler: () => dispatch({ type: 'SHOW_EDIT' }),
      showReadHandler: () => dispatch({ type: 'SHOW_READ' }),
      showDeleteHandler: () => dispatch({ type: 'SHOW_DELETE' }),
      updateEditValue: ({ target: { value } }) => dispatch({ type: 'UPDATE_EDIT_VALUE', value })
    }),
    filterGlobalActions: ({ type }) =>
      [EDIT_ROAD_PROPERTY, EDIT_ROAD_PROPERTY_SUCCESS, EDIT_ROAD_PROPERTY_ERROR, DELETE_ROAD_PROPERTY, DELETE_ROAD_PROPERTY_ERROR].indexOf(type) > -1
  }),
  withHandlers({
    submitEditHandler: ({ propertyValue, editPropertyValue, submitEdit, showReadHandler }) => (e) => {
      e.preventDefault();
      if (propertyValue === editPropertyValue) {
        return showReadHandler();
      }

      submitEdit(editPropertyValue);
    },
    inputKeyDown: ({ showReadHandler }) => ({ which }) => which === 27 && showReadHandler()
  })
)(RoadRowProperty);


export default RoadRowPropertyContainer;
