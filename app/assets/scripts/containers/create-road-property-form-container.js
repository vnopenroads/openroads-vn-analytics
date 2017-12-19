import React from 'react';
import {
  compose,
  getContext
} from 'recompose';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import CreateRoadPropertyForm from '../components/create-road-property-form';


const reducer = (
  state = {
    newPropertyKey: '',
    newPropertyValue: ''
  },
  action
) => {
  if (action.type === 'UPDATE_KEY') {
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
      updateNewPropertyKey: ({ target: { value } }) => dispatch({ type: 'UPDATE_KEY', value }),
      updateNewPropertyValue: ({ target: { value } }) => dispatch({ type: 'UPDATE_VALUE', value })
    }),
    filterGlobalActions: ({ type }) => false
  })
)(CreateRoadPropertyForm);


export default CreateRoadPropertyFormContainer;
