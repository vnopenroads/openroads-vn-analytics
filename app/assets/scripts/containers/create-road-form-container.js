import React from 'react';
import {
  connect
} from 'react-redux';
import {
  withRouter
} from 'react-router';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import {
  compose,
  getContext,
  withHandlers
} from 'recompose';
import {
  CREATE_ROAD,
  CREATE_ROAD_SUCCESS,
  CREATE_ROAD_ERROR,
  createRoadEpic,
  roadIdIsValid
} from '../redux/modules/editRoad';
import CreateRoadForm from '../components/create-road-form';


const reducer = (
  state = {
    shouldShowForm: false,
    newRoadId: '',
    formIsInvalid: false,
    error: false,
    status: 'complete'
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
      newRoadId: '',
      formIsInvalid: false,
      error: false,
      status: 'complete'
    });
  } else if (action.type === 'UPDATE_ROAD_ID') {
    return Object.assign({}, state, {
      newRoadId: action.id
    });
  } else if (action.type === 'FORM_IS_INVALID') {
    return Object.assign({}, state, {
      formIsInvalid: true
    });
  } else if (action.type === CREATE_ROAD) {
    return Object.assign({}, state, {
      formIsInvalid: false,
      status: 'pending'
    });
  } else if (action.type === CREATE_ROAD_SUCCESS) {
    return Object.assign({}, state, {
      status: 'complete',
      newRoadId: '',
      shouldShowForm: false
    });
  } else if (action.type === CREATE_ROAD_ERROR) {
    return Object.assign({}, state, {
      status: 'error',
      error: action.error
    });
  }

  return state;
};


const CreateRoadFormContainer = compose(
  getContext({ language: React.PropTypes.string }),
  withRouter,
  connect(
    (state, { router: { params: { aaId, aaIdSub } } }) => ({
      province: state.crosswalk.province[aaId] && state.crosswalk.province[aaId].id,
      district: state.crosswalk.district[aaIdSub] && state.crosswalk.district[aaIdSub]
    })
  ),
  local({
    key: 'create-road-form',
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch) => ({
      showForm: () => dispatch({ type: 'SHOW_FORM' }),
      hideForm: (e) => {
        e.preventDefault();
        dispatch({ type: 'HIDE_FORM' });
      },
      updateNewRoadId: ({ target: { value: id } }) => dispatch({ type: 'UPDATE_ROAD_ID', id }),
      invalidateForm: () => dispatch({ type: 'FORM_IS_INVALID' }),
      createRoad: (newRoadId) => dispatch(createRoadEpic(newRoadId))
    }),
    filterGlobalActions: ({ type }) => [CREATE_ROAD, CREATE_ROAD_SUCCESS, CREATE_ROAD_ERROR].indexOf(type) > -1
  }),
  withHandlers({
    submitForm: ({ newRoadId, province, district, invalidateForm, createRoad }) => (e) => {
      e.preventDefault();

      if (!roadIdIsValid(newRoadId, province, district)) {
        return invalidateForm();
      }

      createRoad(newRoadId);
    }
  })
)(CreateRoadForm);


export default CreateRoadFormContainer;
