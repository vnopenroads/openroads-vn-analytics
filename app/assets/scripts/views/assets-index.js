'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  compose,
  getContext
} from 'recompose';
import _ from 'lodash';

import T, { translate } from '../components/t';
import { StatsTableHeader, StatsTableRow, StatsTableExpandableTbody, StatsBlock } from '../components/admin-stats-tables';
import AssetsCreate from '../components/assets-create';

import { environment } from '../config';
import { fetchAdminStats } from '../redux/modules/admin-stats';
import { fetchRoadCountEpic, mergeAA } from '../redux/modules/road-count';
import { round } from '../utils/format';

export class AssetsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: []
    };
  }

  componentDidMount() {
    this.props.fetchAdminStats();
    this.props.fetchRoadCountEpic();
  }

  onExpandToggle(id, e) {
    e.preventDefault();
    const expIds = this.state.expanded;

    if (this.isExpanded(id)) {
      this.setState({ expanded: expIds.filter(o => o !== id) });
    } else {
      this.setState({ expanded: expIds.concat(id) });
    }
  }

  isExpanded(id) {
    return this.state.expanded.indexOf(id) !== -1;
  }

  renderStats() {
    const lang = this.props.language;
    const { fetching, fetched, data } = this.props.adminStats;

    if (!fetched || fetching) {
      return null;
    }

    const statData = data.provinces.reduce((acc, province) => {
      return {
        totalLength: acc.totalLength + _.get(province, 'total', 0),
        totalVprommLength: acc.totalVprommLength + _.get(province, 'vpromm', 0),
        totalRoads: acc.totalRoads + _.get(province, 'totalRoads', 0),
        totalOSMRoads: acc.totalOSMRoads + _.get(province, 'osmRoads', 0),
        statusPending: acc.statusPending + _.get(province, 'status.pending', 0),
        statusReviewed: acc.statusReviewed + _.get(province, 'status.reviewed', 0)
      };
    }, {
      totalLength: 0,
      totalVprommLength: 0,
      totalRoads: 0,
      totalOSMRoads: 0,
      statusPending: 0,
      statusReviewed: 0
    });

    const progressPercent = round(statData.totalOSMRoads / statData.totalRoads * 100) || 0;
    const progressIndicators = [
      { label: translate(lang, 'Total'), value: statData.totalRoads },
      { label: translate(lang, 'Field data'), value: `${statData.totalOSMRoads} (${progressPercent}%)` }
    ];

    const statusIndicators = [
      { label: translate(lang, 'Pending'), value: statData.statusPending },
      { label: translate(lang, 'Reviewed'), value: statData.statusReviewed }
    ];

    const lengthPercent = round(Math.min(statData.totalVprommLength / statData.totalLength * 100, 100) || 0);
    const lengthIndicators = [
      { label: translate(lang, 'WoN'), value: `${round(statData.totalLength)}Km` },
      { label: translate(lang, 'GProMMS'), value: `${round(statData.totalVprommLength)}Km (${lengthPercent}%)` }
    ];

    return (
      <div className='stats-container'>
        <StatsBlock
          title={translate(lang, 'Progress')}
          total={statData.totalRoads}
          completed={statData.totalOSMRoads}
          list={progressIndicators} />
        <StatsBlock
          title={translate(lang, 'Status')}
          total={statData.statusReviewed + statData.statusPending}
          completed={statData.statusReviewed}
          list={statusIndicators} />
        <StatsBlock
          title={translate(lang, 'Road length')}
          total={statData.totalLength}
          completed={statData.totalVprommLength}
          list={lengthIndicators} />
      </div>
    );
  }

  renderTable() {
    const lang = this.props.language;
    const { fetching, fetched, data } = this.props.adminStats;
    const nameVar = lang === 'en' ? 'name_en' : 'name_vn';

    if (!fetched || fetching) {
      return <p>Data is loading...</p>;
    }

    return (
      <table className='table table--aa'>
        <StatsTableHeader type='province' />

        {_.sortBy(data.provinces, nameVar).map(province => {
          const pId = province.id;
          const { districts } = province;
          if (!pId) return null;

          return (
            <StatsTableExpandableTbody
              key={pId}
              lang={lang}
              provinceId={pId}
              provName={province[nameVar]}
              data={province}
              disctrictCount={districts.length}
              isExpanded={this.isExpanded(pId)}
              onExpandToggle={this.onExpandToggle.bind(this, pId)} >

              <div className='table-details-wrapper'>
                {districts.length ? (
                  <table className='table table--aa'>
                    <StatsTableHeader type='province-district' />
                    <tbody>
                      {_.sortBy(districts, nameVar).map(district => {
                        const dId = district.id;
                        if (!dId) return null;
                        return (
                          <StatsTableRow
                            key={dId}
                            type='province-district'
                            data={district}
                            lang={lang}
                            provinceId={pId}
                            provinceName={province[nameVar]}
                            districtId={dId}
                            districtName={district[nameVar]} />
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className='empty'><T>There are no districts for this province</T></p>
                )}
              </div>
            </StatsTableExpandableTbody>
          );
        })}
      </table>
    );
  }

  render() {
    const { fetched, error } = this.props.adminStats;

    if (fetched && error) {
      return (
        <div className='incontainer'>
          <div className='incontainer__header'>
            <div className='incontainer__headline'>
              <h2 className='incontainer__title'><T>Error</T></h2>
            </div>
          </div>

          <p>Something went wrong with the request. Please try again later.</p>
        </div>
      );
    }

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
        {this.renderStats()}

        <h3><T>Admin</T></h3>
        {this.renderTable()}
      </div>
    );
  }
}

if (environment !== 'production') {
  AssetsIndex.propTypes = {
    fetchAdminStats: PropTypes.func,
    fetchRoadCountEpic: PropTypes.func,
    adminStats: PropTypes.object,
    language: PropTypes.string
  };
}

export default compose(
  getContext({ language: PropTypes.string }),
  connect(
    state => {
      if (state.adminStats.index.fetched && !state.adminStats.index.error && state.roadCount.index.status === 'complete') {
        const countData = state.roadCount.index.province;

        return {
          adminStats: {
            ...state.adminStats.index,
            data: {
              provinces: state.adminStats.index.data.provinces.map(prov => {
                const districts = prov.districts.map(district => mergeAA(district, countData, [prov.code, 'district', district.code]));
                return mergeAA(prov, countData, [prov.code], { districts });
              })
            }
          }
        };
      }
      return {
        adminStats: state.adminStats.index
      };
    },
    dispatch => ({
      fetchAdminStats: (...args) => dispatch(fetchAdminStats(...args)),
      fetchRoadCountEpic: (...args) => dispatch(fetchRoadCountEpic(...args))
    })
  )
)(AssetsIndex);
