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
  getRoadCountKey,
  fetchRoadsEpic,
  fetchRoadCountEpic
} from '../redux/modules/roads';
import {
  ADMIN_MAP
} from '../constants';



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
    key: ({ router: { params: { aaId = '', aaIdSub = '' } } }) => `road-table-${aaId}-${aaIdSub}`,
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch, { sortOrder }) => ({
      sortColumn: (sortOrder) => dispatch({ type: 'SORT_COLUMN', sortOrder }),
      setPage: (page) => dispatch({ type: 'SET_PAGE', page })
    }),
    filterGlobalActions: ({ type }) => false
  }),
  withProps(({ router: { params: { aaId, aaIdSub } } }) => ({
    province: ADMIN_MAP.province[aaId] && ADMIN_MAP.province[aaId].id,
    district: ADMIN_MAP.district[aaIdSub]
  })),
  connect(
    (state, { sortOrder, page, province, district }) => {
      const roadPageKey = getRoadPageKey(province, district, page, sortOrder);
      const roadsPage = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].roads;
      const roadsPageStatus = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].status;

      const roadCountKey = getRoadCountKey(province, district);
      const roadCount = state.roads.roadCount[roadCountKey] && state.roads.roadCount[roadCountKey].count;
      const roadPageCount = state.roads.roadCount[roadCountKey] && state.roads.roadCount[roadCountKey].pageCount;
      const roadOsmCount = state.roads.roadCount[roadCountKey] && state.roads.roadCount[roadCountKey].osmCount;
      const roadCountStatus = state.roads.roadCount[roadCountKey] && state.roads.roadCount[roadCountKey].status;

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

      if (!roadsPage && roadsPageStatus !== 'complete') {
        fetchRoads(province, district, page, sortOrder);
      }

      if (!roadPageCount && roadCountStatus !== 'complete') {
        fetchRoadCount(province, district);
      }
    },
    componentWillReceiveProps: function (nextProps) {
      const {
        roadsPage, roadsPageStatus, roadPageCount, roadCountStatus,
        province, district, page, sortOrder, fetchRoads, fetchRoadCount
      } = nextProps;

      if (!roadsPage && roadsPageStatus !== 'complete') {
        fetchRoads(province, district, page, sortOrder);
      }

      if (!roadPageCount && roadCountStatus !== 'complete') {
        fetchRoadCount(province, district);
      }
    }
  })
)(RoadTable);


export default RoadTableContainer;
