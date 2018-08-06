'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  getContext
} from 'recompose';
import T from '../components/t';
import { Link } from 'react-router';
import RoadTable from '../containers/road-table-container';
import DistrictList from '../components/district-list';
import {
  fetchAdminInfo
} from '../actions/action-creators';
import config from '../config';
import {
  ADMIN_MAP
} from '../constants';


const renderAdminName = (children, aaId, aaIdSub) => {
  const adminName = aaIdSub ?
    children.find(child => child.id === Number(aaIdSub)).name_en :
    ADMIN_MAP.province[aaId].name;

  return (
    <h2 className='incontainer__title'>{adminName}</h2>
  );
};


var AssetsAA = React.createClass({
  displayName: 'AssetsAA',

  propTypes: {
    _fetchAdminInfo: React.PropTypes.func,
    params: React.PropTypes.object,
    language: React.PropTypes.string,
    adminInfo: React.PropTypes.object,
    adminInfoFetched: React.PropTypes.bool
  },

  componentWillMount: function () {
    this.props._fetchAdminInfo(this.props.params.aaId);
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.params.aaId !== nextProps.params.aaId) {
      this.props._fetchAdminInfo(nextProps.params.aaId);
    }
  },

  render: function () {
    const { adminInfoFetched, language, adminInfo: { children }, params: { aaId, aaIdSub } } = this.props;

    return (
      <div className='incontainer'>
        <div className='incontainer__header'>
          <div className='incontainer__headline'>
            {children && renderAdminName(children, aaId, aaIdSub)}

            <ol className='incontainer__breadcrumb'>
              <li><a title='View' href='#'>Overview</a></li>
              <li><a title='View' href='#'>Province name</a></li>
            </ol>
          </div>
          {!aaIdSub && aaId &&
          <div className='incontainer__hactions'>
            <a href={`${config.provinceDumpBaseUrl}${aaId}.csv`} className='ica-download'><T>Download</T></a>
            <a href='#' className='ica-plus ica-main'><T>Add assets</T></a>
          </div>
          }
        </div>

        <div>
          {
            !aaIdSub && adminInfoFetched &&
              <DistrictList
                districts={children}
                aaId={aaId}
                language={language}
              />
          }
        </div>

        <RoadTable />

      </div>
    );
  }
});

export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      adminInfo: state.adminInfo.data,
      adminInfoFetched: state.adminInfo.fetched
    }),
    dispatch => ({
      _fetchAdminInfo: (id, level) => dispatch(fetchAdminInfo(id, level))
    })
  )
)(AssetsAA);
