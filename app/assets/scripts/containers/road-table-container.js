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
  getRoadPageKey,
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
  local({
    key: 'road-table',
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch, { sortOrder }) => ({
      sortColumn: (sortOrder) => dispatch({ type: 'SORT_COLUMN', sortOrder })
    }),
    filterGlobalActions: ({ type }) => false
  }),
  connect(
    (state, { sortOrder, page, router: { params: { aaId, aaIdSub } } }) => {
      const province = state.crosswalk.province[aaId] && state.crosswalk.province[aaId].id;
      const district = state.crosswalk.district[aaIdSub] && state.crosswalk.district[aaIdSub];
      const pageKey = getRoadPageKey(province, district, page, sortOrder);
      const roadsPage = state.roads.roadsByPage[pageKey] && state.roads.roadsByPage[pageKey].roads;
      const roadsPageStatus = state.roads.roadsByPage[pageKey] && state.roads.roadsByPage[pageKey].status;

      return {
        adminRoads: state.adminRoads.ids,
        adminRoadProperties: state.VProMMsAdminProperties.data,
        province,
        district,
        roadsPage,
        roadsPageStatus
      };
    },
    (dispatch) => ({
      fetchRoads: (province, district, page, sortOrder) => dispatch(fetchRoadsEpic(province, district, page, sortOrder))
    })
  ),
  withHandlers({
    sortColumnAction: ({ sortOrder, sortColumn }) => (fieldId) => sortColumn(sortOrder === 'asc' ? 'desc' : 'asc')
  }),
  lifecycle({
    componentWillMount: function () {
      const { roadsPage, roadsPageStatus, province, district, page, sortOrder, fetchRoads } = this.props;

      if (!roadsPage && roadsPageStatus !== 'pending') {
        fetchRoads(province, district, page, sortOrder);
      }
    },
    componentWillReceiveProps: function (nextProps) {
      const { roadsPage, roadsPageStatus, province, district, page, sortOrder, fetchRoads } = nextProps;

      if (!roadsPage && roadsPageStatus !== 'pending') {
        fetchRoads(province, district, page, sortOrder);
      }
    }
  })
)(RoadTable);


export default RoadTableContainer;
