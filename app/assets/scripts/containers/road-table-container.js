import React from 'react';
import {
  withRouter
} from 'react-router';
import {
  compose,
  getContext,
  withProps,
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
import {
  getRoadCountKey,
  fetchRoadCountEpic
} from '../redux/modules/roadCount';
import {
  ADMIN_MAP
} from '../constants';



const reducer = (
  state = {
    sortOrder: 'asc',
    sortField: 'id',
    page: 1
  },
  action
) => {
  if (action.type === 'SORT_COLUMN') {
    return Object.assign({}, state, {
      sortOrder: action.sortOrder,
      sortField: action.sortField
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
    key: ({ router: { params: { aaId = '', aaIdSub = '' } } }) => `road-table-${aaId}-${aaIdSub}`,
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch, { sortOrder }) => ({
      sortColumn: (sortField, sortOrder) => dispatch({ type: 'SORT_COLUMN', sortField, sortOrder }),
      setPage: (page) => dispatch({ type: 'SET_PAGE', page })
    }),
    filterGlobalActions: ({ type }) => false
  }),
  withProps(({ router: { params: { aaId, aaIdSub } } }) => ({
    province: ADMIN_MAP.province[aaId] && ADMIN_MAP.province[aaId].id,
    district: ADMIN_MAP.district[aaIdSub]
  })),
  connect(
    (state, { province, district, page, sortField, sortOrder }) => {
      const roadPageKey = getRoadPageKey(province, district, page, sortField, sortOrder);
      const roadsPage = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].roads;
      const roadsPageStatus = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].status;

      const roadCountKey = getRoadCountKey(province, district);
      const roadCount = state.roadCount[roadCountKey] && state.roadCount[roadCountKey].count;
      const roadPageCount = state.roadCount[roadCountKey] && state.roadCount[roadCountKey].pageCount;
      const roadOsmCount = state.roadCount[roadCountKey] && state.roadCount[roadCountKey].osmCount;
      const roadCountStatus = state.roadCount[roadCountKey] && state.roadCount[roadCountKey].status;

      return {
        roadsPage,
        roadsPageStatus,
        roadCount,
        roadPageCount,
        roadOsmCount,
        roadCountStatus
      };
    },
    (dispatch) => ({
      fetchRoads: (province, district, page, sortField, sortOrder) => dispatch(fetchRoadsEpic(province, district, page, sortField, sortOrder)),
      fetchRoadCount: (province, district) => dispatch(fetchRoadCountEpic(province, district))
    })
  ),
  withHandlers({
    sortColumnAction: ({ sortField, sortOrder, sortColumn }) => (fieldId) => {
      if (sortField === fieldId) {
        sortColumn(fieldId, sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        sortColumn(fieldId, 'asc');
      }
    }
  }),
  lifecycle({
    componentWillMount: function () {
      const {
        roadsPage, roadsPageStatus, roadPageCount, roadCountStatus,
        province, district, page, sortField, sortOrder, fetchRoads, fetchRoadCount
      } = this.props;

      if (!roadsPage && roadsPageStatus !== 'pending' && roadsPageStatus !== 'error') {
        fetchRoads(province, district, page, sortField, sortOrder);
      }

      if (!roadPageCount && roadCountStatus !== 'pending' && roadCountStatus !== 'error') {
        fetchRoadCount(province, district);
      }
    },
    componentWillReceiveProps: function (nextProps) {
      const {
        roadsPage, roadsPageStatus, roadPageCount, roadCountStatus,
        province, district, page, sortField, sortOrder, fetchRoads, fetchRoadCount
      } = nextProps;

      if (!roadsPage && roadsPageStatus !== 'pending' && roadsPageStatus !== 'error') {
        fetchRoads(province, district, page, sortField, sortOrder);
      }

      if (!roadPageCount && roadCountStatus !== 'pending' && roadCountStatus !== 'error') {
        fetchRoadCount(province, district);
      }
    }
  })
)(RoadTable);


export default RoadTableContainer;
