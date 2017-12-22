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
    <div className='a-headline'>
      <h1>{adminName}</h1>
    </div>
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
      <div ref='a-admin-area' className='a-admin-area-show'>
        <section>
          <header className='a-header'>
            {
              children && renderAdminName(children, aaId, aaIdSub)
            }
            {
              !aaIdSub && aaId &&
                <div className='a-head-actions'>
                  <a
                    className='button button--secondary-raised-dark'
                    href={`${config.provinceDumpBaseUrl}${aaId}.csv`}
                    target="_blank"
                  >
                    <T>Download Roads</T>
                  </a>
                </div>
            }
          </header>
          {
            aaIdSub ?
              <div className="back-button">
                <i className="collecticon-chevron-left" />
                <Link
                  to={`/${this.props.language}/assets/${aaId}`}
                >
                  {ADMIN_MAP.province[aaId].name}
                </Link>
              </div> :
              <div className="back-button">
                <i className="collecticon-chevron-left" />
                <Link
                  to={`/${this.props.language}/assets`}
                >
                  <T>Provinces</T>
                </Link>
              </div>
          }
          <div>
            {
              !aaIdSub && adminInfoFetched &&
                <DistrictList
                  districts={children}
                  aaId={aaId}
                  language={language}
                />
            }

            <RoadTable />
          </div>
        </section>
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
