'use strict';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import c from 'classnames';
import {
  compose,
  getContext,
  lifecycle,
  withProps
} from 'recompose';
import {
  reduce
} from 'lodash';
import T, {translate} from '../components/t';
import {
  fetchProvinces
} from '../actions/action-creators';
import {
  fetchProvincesRoadCountEpic
} from '../redux/modules/roadCount';
import { fetchAdminStats } from '../redux/modules/admin-stats';
import ProvinceTable from '../containers/province-table-container';
import {
  ADMIN_MAP
} from '../constants';
import AssetsCreate from '../components/assets-create';

import { environment } from '../config';

export class AssetsIndex extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      expanded: []
    };
  }

  componentWillMount () {
    this.props.fetchAdminStats();
  }

  onExpandToggle (id, e) {
    e.preventDefault();
    const expIds = this.state.expanded;

    if (this.isExpanded(id)) {
      this.setState({expanded: expIds.filter(o => o !== id)});
    } else {
      this.setState({expanded: expIds.concat(id)});
    }
  }

  isExpanded (id) {
    return this.state.expanded.indexOf(id) !== -1;
  }

  renderTable () {
    const lang = this.props.language;
    const { fetching, fetched, data } = this.props.adminStats;

    if (!fetched || fetching) {
      return null;
    }

    return (
      <div className='table'>
        <table>
          <StatsTableHeader type='province'/>

          {data.provinces.map(province => {
            const pId = province.id;
            const { districts } = province;
            const provName = lang === 'en' ? province.name_en : province.name_vn;

            if (!pId) return null;

            return (
              <StatsTableExpandableRow
                key={pId}
                lang={lang}
                provinceId={pId}
                provName={provName}
                disctrictCount={districts.length}
                isExpanded={this.isExpanded(pId)}
                onExpandToggle={this.onExpandToggle.bind(this, pId)} >

                <div className='table-details-wrapper'>
                  <table>
                    <StatsTableHeader type='district'/>
                    {districts.map(district => {
                      const dId = district.id;
                      const disctrictName = lang === 'en' ? district.name_en : district.name_vn;

                      if (!dId) return null;

                      return (
                        <tbody key={dId}>
                          <tr>
                            <td>{provName}</td>
                            <td><Link to={`/${lang}/assets/${pId}/${dId}`} title={translate('View district page')}>{disctrictName}</Link></td>
                            <td>10</td>
                            <td>100</td>
                            <td>1000</td>
                            <td>10000</td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              </StatsTableExpandableRow>
            );
          })}
        </table>
      </div>
    );
  }

  render () {
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
        {this.renderTable()}
      </div>
    );
  }
}

if (environment !== 'production') {
  AssetsIndex.propTypes = {
    fetchAdminStats: PropTypes.func,
    adminStats: PropTypes.object,
    language: PropTypes.string
  };
}

export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      adminStats: state.adminStats
    }),
    dispatch => ({
      fetchAdminStats: (...args) => dispatch(fetchAdminStats(...args))
    })
  )
)(AssetsIndex);

//
// Components
//

const StatsTableHeader = ({type}) => (
  <thead>
    <tr>
      <th>{type === 'province' ? <T>Provinces</T> : <T>Province</T>}</th>
      <th>{type === 'province' ? <T>Districts</T> : <T>District</T>}</th>
      <th><T>Total</T></th>
      <th><T>Field</T></th>
      <th><T>Pending</T></th>
      <th><T>Done</T></th>
    </tr>
  </thead>
);

if (environment !== 'production') {
  StatsTableHeader.propTypes = {
    type: PropTypes.string
  };
}

const StatsTableExpandableRow = ({lang, provinceId, provName, disctrictCount, isExpanded, onExpandToggle, children}) => (
  <tbody>
    <tr>
      <td><Link to={`/${lang}/assets/${provinceId}`} title={translate('View province page')}>{provName}</Link></td>
      <td><a href='#' title={translate('Expand districts')} onClick={onExpandToggle}>{disctrictCount}</a></td>
      <td>10</td>
      <td>100</td>
      <td>1000</td>
      <td>10000</td>
    </tr>
    <tr className={c('table-details', {'table-details--expanded': isExpanded})}>
      <td colSpan={6}>
        {children}
      </td>
    </tr>
  </tbody>
);

if (environment !== 'production') {
  StatsTableExpandableRow.propTypes = {
    lang: PropTypes.string,
    provinceId: PropTypes.number,
    provName: PropTypes.string,
    disctrictCount: PropTypes.number,
    isExpanded: PropTypes.bool,
    onExpandToggle: PropTypes.func,
    children: PropTypes.node
  };
}

// const AssetsIndex = ({
//   provinces, provincesFetched, provincesRoadCount, totalRoadCount, osmRoadCount, provincesRoadCountStatus
// }) => {
//   return (
//     <div className='incontainer'>
//       <div className='incontainer__header'>
//         <div className='incontainer__headline'>
//           <h2 className='incontainer__title'><T>Overview</T></h2>
//         </div>

//         <div className='incontainer__hactions'>
//           <AssetsCreate />
//         </div>
//       </div>
//       {
//         provincesRoadCountStatus === 'complete' &&
//         <div className='a-main__status'>
//           <h2>
//             <strong>{(osmRoadCount / totalRoadCount).toFixed(2)}% </strong>
//             <T>of VPRoMMS Ids have field data collected</T> ({osmRoadCount} of {totalRoadCount})
//           </h2>
//           <div className='meter'>
//             <div className='meter__internal' style={{width: `${osmRoadCount / totalRoadCount}%`}}></div>
//           </div>
//         </div>
//       }
//       {
//         provincesFetched && provincesRoadCountStatus === 'complete' &&
//         <ProvinceTable
//           provinces={provinces.filter(province => ADMIN_MAP.province[province.id])}
//           provincesRoadCount={provincesRoadCount}
//         />
//       }
//     </div>
//   );
// };


// const fetchData = ({
//   provinces, provincesRoadCount, provincesRoadCountStatus, fetchProvinces, fetchRoadCount
// }) => {
//   if (!provinces) {
//     fetchProvinces();
//   }

//   if (!provincesRoadCount && provincesRoadCountStatus !== 'pending' && provincesRoadCountStatus !== 'error') {
//     fetchRoadCount();
//   }
// };


// export default compose(
//   getContext({ language: React.PropTypes.string }),
//   connect(
//     state => ({
//       provinces: state.provinces.data.province,
//       provincesFetched: state.provinces.fetched,
//       provincesRoadCount: state.roadCount.provinces.provinceCount,
//       provincesRoadCountStatus: state.roadCount.provinces.status
//     }),
//     dispatch => ({
//       fetchProvinces: () => dispatch(fetchProvinces()),
//       fetchRoadCount: () => dispatch(fetchProvincesRoadCountEpic())
//     })
//   ),
//   lifecycle({
//     componentWillMount: function () {
//       fetchData(this.props);
//     },
//     componentWillReceiveProps: function (nextProps) {
//       fetchData(nextProps);
//     }
//   }),
//   withProps(({ provincesRoadCount, provincesRoadCountStatus }) => {
//     if (provincesRoadCount) {
//       return {
//         totalRoadCount: reduce(provincesRoadCount, (total, { count }) => total + count, 0),
//         osmRoadCount: reduce(provincesRoadCount, (total, { osmCount }) => total + osmCount, 0)
//       };
//     }

//     return {};
//   })
// )(AssetsIndex);
