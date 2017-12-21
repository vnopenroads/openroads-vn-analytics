'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  getContext,
  lifecycle
} from 'recompose';
import T from '../components/t';
import {
  fetchProvinces,
  fetchVProMMsIdsCount,
  fetchFieldVProMsIdsCount
} from '../actions/action-creators';
import ProvinceTable from '../containers/province-table-container';
import {
  ADMIN_MAP
} from '../constants';


const AssetsIndex = ({ provinces, fieldIdCount, VProMMsCount, provincesFetched, VProMMsCountFetched, fieldCountsFetched }) => {
  const total = VProMMsCount.reduce((accum, { total_roads }) => accum + Number(total_roads), 0);
  const field = fieldIdCount.reduce((accum, { total_roads }) => accum + Number(total_roads), 0);
  const completion = field / total;

  return (
    <div>
      <div className='a-header'>
        <div className='a-headline'>
          <h1><T>VPRoMMS Assets By Province</T></h1>
        </div>
      </div>

      <div className='a-main__status'>
        <h2>
          <strong>{completion.toFixed(2)}% </strong>
          <T>of VPRoMMS Ids have field data collected</T> ({field} of {total})
        </h2>
        <div className='meter'>
          <div className='meter__internal' style={{width: `${completion}%`}}></div>
        </div>
      </div>
      <div>
        {provincesFetched && VProMMsCountFetched && fieldCountsFetched ?
          <ProvinceTable
            provinces={provinces.filter(province => ADMIN_MAP.province[province.id])}
            fieldIdCount={fieldIdCount}
            VProMMsCount={VProMMsCount}
          /> :
          <div className='a-subnav'><h2><T>Loading</T></h2></div>
        }
      </div>
    </div>
  );
};


export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      provinces: state.provinces.data.province,
      provincesFetched: state.provinces.fetched,
      fieldIdCount: state.fieldIdCount.counts,
      fieldCountsFetched: state.fieldIdCount.fetched,
      VProMMsCount: state.roadIdCount.counts,
      VProMMsCountFetched: state.roadIdCount.fetched
    }),
    dispatch => ({
      _fetchProvinces: () => dispatch(fetchProvinces()),
      _fetchVProMMsIdsCount: (level) => dispatch(fetchVProMMsIdsCount(level)),
      _fetchFieldVProMsIdsCount: (level) => dispatch(fetchFieldVProMsIdsCount(level))
    })
  ),
  lifecycle({
    componentWillMount: function () {
      this.props._fetchProvinces();
      this.props._fetchVProMMsIdsCount('province');
      this.props._fetchFieldVProMsIdsCount('province');
    }
  })
)(AssetsIndex);
