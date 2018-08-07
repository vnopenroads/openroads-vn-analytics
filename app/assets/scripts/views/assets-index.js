'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  getContext,
  lifecycle,
  withProps
} from 'recompose';
import {
  reduce
} from 'lodash';
import T from '../components/t';
import {
  fetchProvinces
} from '../actions/action-creators';
import {
  fetchProvincesRoadCountEpic
} from '../redux/modules/roadCount';
import ProvinceTable from '../containers/province-table-container';
import {
  ADMIN_MAP
} from '../constants';
import AssetsCreate from '../components/assets-create';


const AssetsIndex = ({
  provinces, provincesFetched, provincesRoadCount, totalRoadCount, osmRoadCount, provincesRoadCountStatus
}) => {
  return (
    <div className='incontainer'>
      <div className='incontainer__header'>
        <div className='incontainer__headline'>
          <h2 className='incontainer__title'><T>Overview</T></h2>
        </div>

        <div className='incontainer__hactions'>
          <AssetsCreate />
        </div>
      </div>
      {
        provincesRoadCountStatus === 'complete' &&
        <div className='a-main__status'>
          <h2>
            <strong>{(osmRoadCount / totalRoadCount).toFixed(2)}% </strong>
            <T>of VPRoMMS Ids have field data collected</T> ({osmRoadCount} of {totalRoadCount})
          </h2>
          <div className='meter'>
            <div className='meter__internal' style={{width: `${osmRoadCount / totalRoadCount}%`}}></div>
          </div>
        </div>
      }
      {
        provincesFetched && provincesRoadCountStatus === 'complete' &&
        <ProvinceTable
          provinces={provinces.filter(province => ADMIN_MAP.province[province.id])}
          provincesRoadCount={provincesRoadCount}
        />
      }
    </div>
  );
};


const fetchData = ({
  provinces, provincesRoadCount, provincesRoadCountStatus, fetchProvinces, fetchRoadCount
}) => {
  if (!provinces) {
    fetchProvinces();
  }

  if (!provincesRoadCount && provincesRoadCountStatus !== 'pending' && provincesRoadCountStatus !== 'error') {
    fetchRoadCount();
  }
};


export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      provinces: state.provinces.data.province,
      provincesFetched: state.provinces.fetched,
      provincesRoadCount: state.roadCount.provinces.provinceCount,
      provincesRoadCountStatus: state.roadCount.provinces.status
    }),
    dispatch => ({
      fetchProvinces: () => dispatch(fetchProvinces()),
      fetchRoadCount: () => dispatch(fetchProvincesRoadCountEpic())
    })
  ),
  lifecycle({
    componentWillMount: function () {
      fetchData(this.props);
    },
    componentWillReceiveProps: function (nextProps) {
      fetchData(nextProps);
    }
  }),
  withProps(({ provincesRoadCount, provincesRoadCountStatus }) => {
    if (provincesRoadCount) {
      return {
        totalRoadCount: reduce(provincesRoadCount, (total, { count }) => total + count, 0),
        osmRoadCount: reduce(provincesRoadCount, (total, { osmCount }) => total + osmCount, 0)
      };
    }

    return {};
  })
)(AssetsIndex);
