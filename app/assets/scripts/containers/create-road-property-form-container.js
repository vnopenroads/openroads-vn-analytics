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
  createRoadPropertyEpic
} from '../redux/modules/roads';


const reducer = (
  state = {
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
      shouldShowForm: false
    });
  } else if (action.type === 'UPDATE_KEY') {
    return Object.assign({}, state, {
      newPropertyKey: action.value
    });
  } else if (action.type === 'UPDATE_VALUE') {
    return Object.assign({}, state, {
      newPropertyValue: action.value
    });
  }

  return state;
};

const CreateRoadPropertyFormContainer = compose(
  getContext({ language: React.PropTypes.string }),
  local({
    key: ({ roadId }) => `create-road-property-form-${roadId}`,
    createStore: () => createStore(reducer),
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
    filterGlobalActions: ({ type }) => false
  }),
  withHandlers({
    submitForm: ({ roadId, newPropertyKey, newPropertyValue, createRoadProperty }) => (e) => {
      e.preventDefault();
      createRoadProperty(roadId, newPropertyKey, newPropertyValue);
    }
  })
)(CreateRoadPropertyForm);


export default CreateRoadPropertyFormContainer;
