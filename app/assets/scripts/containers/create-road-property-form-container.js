import React from 'react';
import {
  compose,
  getContext,
  withHandlers
} from 'recompose';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import CreateRoadPropertyForm from '../components/create-road-property-form';
import {
  createRoadPropertyEpic, CREATE_ROAD_PROPERTY, CREATE_ROAD_PROPERTY_SUCCESS, CREATE_ROAD_PROPERTY_ERROR
} from '../redux/modules/roads';


const reducerFactory = (roadId) => (
  state = {
    roadId,
    status: 'complete',
    shouldShowForm: false,
    newPropertyKey: '',
    newPropertyValue: ''
  },
  action
) => {
  if (action.type === 'SHOW_FORM') {
    return Object.assign({}, state, {
      shouldShowForm: true
    });
  } else if (action.type === 'HIDE_FORM') {
    return Object.assign({}, state, {
      shouldShowForm: false,
      status: 'complete',
      newPropertyKey: '',
      newPropertyValue: ''
    });
  } else if (action.type === 'UPDATE_KEY') {
    return Object.assign({}, state, {
      newPropertyKey: action.value
    });
  } else if (action.type === 'UPDATE_VALUE') {
    return Object.assign({}, state, {
      newPropertyValue: action.value
    });
  } else if (
    action.type === CREATE_ROAD_PROPERTY &&
    state.roadId === action.id
  ) {
    return Object.assign({}, state, {
      status: 'pending'
    });
  } else if (
    action.type === CREATE_ROAD_PROPERTY_SUCCESS &&
    state.roadId === action.id
  ) {
    return Object.assign({}, state, {
      shouldShowForm: false,
      status: 'complete',
      newPropertyKey: '',
      newPropertyValue: ''
    });
  } else if (
    action.type === CREATE_ROAD_PROPERTY_ERROR &&
    state.roadId === action.id
  ) {
    return Object.assign({}, state, {
      status: 'error'
    });
  }

  return state;
};

const CreateRoadPropertyFormContainer = compose(
  getContext({ language: React.PropTypes.string }),
  local({
    key: ({ roadId }) => `create-road-property-form-${roadId}`,
    createStore: ({ roadId }) => createStore(reducerFactory(roadId)),
    mapDispatchToProps: (dispatch) => ({
      showForm: () => dispatch({ type: 'SHOW_FORM' }),
      hideForm: (e) => {
        e.preventDefault();
        dispatch({ type: 'HIDE_FORM' });
      },
      updateNewPropertyKey: ({ target: { value } }) => dispatch({ type: 'UPDATE_KEY', value }),
      updateNewPropertyValue: ({ target: { value } }) => dispatch({ type: 'UPDATE_VALUE', value }),
      createRoadProperty: (roadId, newPropertyKey, newPropertyValue) =>
        dispatch(createRoadPropertyEpic(roadId, newPropertyKey, newPropertyValue))
    }),
    filterGlobalActions: ({ type }) =>
      [CREATE_ROAD_PROPERTY, CREATE_ROAD_PROPERTY_SUCCESS, CREATE_ROAD_PROPERTY_ERROR].indexOf(type) > -1
  }),
  withHandlers({
    submitForm: ({ roadId, newPropertyKey, newPropertyValue, createRoadProperty }) => (e) => {
      e.preventDefault();
      createRoadProperty(roadId, newPropertyKey, newPropertyValue);
    }
  })
)(CreateRoadPropertyForm);


export default CreateRoadPropertyFormContainer;
