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
import AssetsCreate from '../components/assets-create';


const renderAdminName = (children, aaId, aaIdSub) => {
  const adminName = aaIdSub ?
    children.find(child => child.id === Number(aaIdSub)).name_en :
    ADMIN_MAP.province[aaId].name;

  return (
    <h2 className='incontainer__title'>{adminName}</h2>
  );
};

class AssetsAA extends React.Component {
  constructor (props) {
    super(props);

    this.onCreateAssetClick = this.onCreateAssetClick.bind(this);

    this.state = {
      createModalOpen: false
    };
  }

  componentWillMount () {
    this.props._fetchAdminInfo(this.props.params.aaId);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.aaId !== nextProps.params.aaId) {
      this.props._fetchAdminInfo(nextProps.params.aaId);
    }
  }

  onModalClose (data = {}) {
    this.setState({ createModalOpen: false });
  }

  onCreateAssetClick (e) {
    e.preventDefault();
    this.setState({ createModalOpen: true });
  }

  render () {
    const { adminInfoFetched, language, adminInfo: { children }, params: { aaId, aaIdSub } } = this.props;

    return (
      <div className='incontainer'>
        <div className='incontainer__header'>
          <div className='incontainer__headline'>
            {children && renderAdminName(children, aaId, aaIdSub)}

            <ol className='incontainer__breadcrumb'>
              <li><Link title='View' to={`${language}/assets`}>Overview</Link></li>
              {aaIdSub && <li><Link title='View' to={`${language}/assets/${aaId}`}>{ADMIN_MAP.province[aaId].name}</Link></li>}
            </ol>
          </div>

          <div className='incontainer__hactions'>
            {!aaIdSub && aaId && <a href={`${config.provinceDumpBaseUrl}${aaId}.csv`} className='ica-download'><T>Download</T></a>}
            <AssetsCreate />
          </div>

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
}

if (config.environment !== 'production') {
  AssetsAA.propTypes = {
    _fetchAdminInfo: React.PropTypes.func,
    params: React.PropTypes.object,
    language: React.PropTypes.string,
    adminInfo: React.PropTypes.object,
    adminInfoFetched: React.PropTypes.bool
  };
}

//
//
//

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
