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
  getRoadCountKey,
  fetchRoadsEpic,
  fetchRoadCountEpic
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
  } else if (action.type === 'SET_PAGE') {
    return Object.assign({}, state, {
      page: action.page
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
      sortColumn: (sortOrder) => dispatch({ type: 'SORT_COLUMN', sortOrder }),
      setPage: (page) => dispatch({ type: 'SET_PAGE', page })
    }),
    filterGlobalActions: ({ type }) => false
  }),
  connect(
    (state, { sortOrder, page, router: { params: { aaId, aaIdSub } } }) => {
      const province = state.crosswalk.province[aaId] && state.crosswalk.province[aaId].id;
      const district = state.crosswalk.district[aaIdSub] && state.crosswalk.district[aaIdSub];
      
      const roadPageKey = getRoadPageKey(province, district, page, sortOrder);
      const roadsPage = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].roads;
      const roadsPageStatus = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].status;
      
      const roadCountKey = getRoadCountKey(province, district);
      const roadPageCount = state.roads.roadCount[roadCountKey] && state.roads.roadCount[roadCountKey].pageCount;
      const roadCountStatus = state.roads.roadCount[roadCountKey] && state.roads.roadCount[roadCountKey].status;

      return {
        adminRoadProperties: state.VProMMsAdminProperties.data,
        province,
        district,
        roadsPage,
        roadsPageStatus,
        roadPageCount,
        roadCountStatus
      };
    },
    (dispatch) => ({
      fetchRoads: (province, district, page, sortOrder) => dispatch(fetchRoadsEpic(province, district, page, sortOrder)),
      fetchRoadCount: (province, district) => dispatch(fetchRoadCountEpic(province, district))
    })
  ),
  withHandlers({
    sortColumnAction: ({ sortOrder, sortColumn }) => (fieldId) => sortColumn(sortOrder === 'asc' ? 'desc' : 'asc')
  }),
  lifecycle({
    componentWillMount: function () {
      const {
        roadsPage, roadsPageStatus, roadPageCount, roadCountStatus,
        province, district, page, sortOrder, fetchRoads, fetchRoadCount
      } = this.props;

      if (!roadsPage && roadsPageStatus !== 'pending') {
        fetchRoads(province, district, page, sortOrder);
      }

      if (!roadPageCount && roadCountStatus !== 'pending') {
        fetchRoadCount(province, district);
      }
    },
    componentWillReceiveProps: function (nextProps) {
      const {
        roadsPage, roadsPageStatus, roadPageCount, roadCountStatus,
        province, district, page, sortOrder, fetchRoads, fetchRoadCount
      } = nextProps;

      if (!roadsPage && roadsPageStatus !== 'pending') {
        fetchRoads(province, district, page, sortOrder);
      }

      if (!roadPageCount && roadCountStatus !== 'pending') {
        fetchRoadCount(province, district);
      }
    }
  })
)(RoadTable);


export default RoadTableContainer;
