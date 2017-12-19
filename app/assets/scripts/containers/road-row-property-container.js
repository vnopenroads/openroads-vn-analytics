import React from 'react';
import {
  compose,
  getContext,
  withProps,
  withHandlers
} from 'recompose';
import { connect } from 'react-redux';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import RoadRowProperty from '../components/road-row-property';


const reducer = (
  state = {},
  action
) => {
  return state;
};


const RoadRowPropertyContainer = compose(
  getContext({ language: React.PropTypes.string }),
  local({
    key: ({ propertyKey }) => propertyKey,
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch) => ({

    }),
    filterGlobalActions: ({ type }) => false
  }),
  connect(
    (state, { vpromm }) => ({
      road: state.roads.roadsById[vpromm]
    })
  )
)(RoadRowProperty);


export default RoadRowPropertyContainer;
