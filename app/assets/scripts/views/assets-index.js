'use strict';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  compose,
  getContext
} from 'recompose';

import T from '../components/t';
import { StatsTableHeader, StatsTableRow, StatsTableExpandableTbody } from '../components/admin-stats-tables';
import AssetsCreate from '../components/assets-create';

import { environment } from '../config';
import { fetchAdminStats } from '../redux/modules/admin-stats';

export class AssetsIndex extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      expanded: []
    };
  }

  componentDidMount () {
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
    const nameVar = lang === 'en' ? 'name_en' : 'name_vn';

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
                  <table>
                    <StatsTableHeader type='province-district'/>
                    <tbody>
                      {districts.map(district => {
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
                </div>
              </StatsTableExpandableTbody>
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
      adminStats: state.adminStats.index
    }),
    dispatch => ({
      fetchAdminStats: (...args) => dispatch(fetchAdminStats(...args))
    })
  )
)(AssetsIndex);
