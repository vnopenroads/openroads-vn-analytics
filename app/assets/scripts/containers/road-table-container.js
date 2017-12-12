import React from 'react';
import {
  withRouter
} from 'react-router';
import {
  compose,
  getContext,
  withHandlers,
  lifecycle
} from 'recompose';
import {
  local
} from 'redux-fractal';
import {
  createStore
} from 'redux';
import {
  connect
} from 'react-redux';
import RoadTable from '../components/road-table';
import {
  fetchRoadsEpic
} from '../redux/modules/roads';



const reducer = (
  state = {
    sortOrder: 'asc',
    page: 1
  },
  action
) => {
  if (action.type === 'SORT_COLUMN') {
    return Object.assign({}, state, {
      sortOrder: action.sortOrder
    });
  }

  return state;
};


const RoadTableContainer = compose(
  getContext({ language: React.PropTypes.string }),
  withRouter,
  connect(
    (state, { vpromm, router: { params: { aaId, aaIdSub } } }) => ({
      adminRoads: state.adminRoads.ids,
      adminRoadProperties: state.VProMMsAdminProperties.data,
      province: state.crosswalk.province[aaId] && state.crosswalk.province[aaId].id,
      district: state.crosswalk.district[aaIdSub] && state.crosswalk.district[aaIdSub]
    }),
    (dispatch) => ({
      fetchRoads: (province, district, page, sortOrder) => dispatch(fetchRoadsEpic(province, district, page, sortOrder))
    })
  ),
  local({
    key: ({ vpromm }) => 'road-table',
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch, { sortOrder }) => ({
      sortColumn: (sortOrder) => dispatch({ type: 'SORT_COLUMN', sortOrder })
    }),
    filterGlobalActions: ({ type }) => false
  }),
  withHandlers({
    sortColumnAction: ({ sortOrder, sortColumn }) => (fieldId) => sortColumn(sortOrder === 'asc' ? 'desc' : 'asc')
  }),
  lifecycle({
    componentWillMount: function () {
      const { province, district, sortOrder, fetchRoads } = this.props;
      fetchRoads(province, district, 1, sortOrder);
    }
  })
)(RoadTable);


export default RoadTableContainer;
