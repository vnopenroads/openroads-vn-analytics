'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  getContext
} from 'recompose';
import { Link } from 'react-router';
import _ from 'lodash';
import c from 'classnames';

import AssetsCreate from '../components/assets-create';
import T, { translate } from '../components/t';
import { StatsTableHeader, StatsTableRow } from '../components/admin-stats-tables';

import { fetchAdminStatsAA } from '../redux/modules/admin-stats';
import config from '../config';

class AssetsAA extends React.Component {
  constructor (props) {
    super(props);

    this.onCreateAssetClick = this.onCreateAssetClick.bind(this);

    this.state = {
      createModalOpen: false,
      activeTab: 'assets'
    };
  }

  fetchData (props) {
    const {aaId, aaIdSub} = props.params;

    if (aaIdSub) {
      props.fetchAdminStatsAA('district', aaId, aaIdSub);
    } else {
      props.fetchAdminStatsAA('province', aaId);
    }
  }

  componentDidMount () {
    this.fetchData(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.aaId !== nextProps.params.aaId || this.props.params.aaIdSub !== nextProps.params.aaIdSub) {
      // Reset tab.
      this.setState({activeTab: 'assets'});
      this.fetchData(nextProps);
    }
  }

  onModalClose (data = {}) {
    this.setState({ createModalOpen: false });
  }

  onCreateAssetClick (e) {
    e.preventDefault();
    this.setState({ createModalOpen: true });
  }

  onTabClick (tab, e) {
    e.preventDefault();
    this.setState({ activeTab: tab });
  }

  renderHeadline () {
    const {language, params: { aaId, aaIdSub }, aa: { data }} = this.props;
    const type = aaIdSub ? translate(language, 'District') : translate(language, 'Province');
    const nameVar = language === 'en' ? 'name_en' : 'name_vn';

    return (
      <div className='incontainer__headline'>
        <ol className='incontainer__breadcrumb'>
          <li><Link title='View' to={`${language}/assets`}>Overview</Link></li>
          {aaIdSub && <li><Link title='View' to={`${language}/assets/${aaId}`}>{data.province[nameVar]}</Link></li>}
        </ol>
        <h2 className='incontainer__title'>{type}: {data[nameVar]}</h2>
      </div>

    );
  }

  renderTabs () {
    // If it is a district there's no need to have tabs.
    if (this.props.params.aaIdSub) return null;

    const tabs = [
      {key: 'assets', label: 'Assets'},
      {key: 'districts', label: 'Districts'}
    ];

    return (
      <ul>
        {tabs.map(t => (
          <li key={t.key}>
            <a href='#' className={c({'tab--active': this.state.activeTab === t.key})} title={translate(this.props.language, 'Switch tab')} onClick={this.onTabClick.bind(this, t.key)}><T>{t.label}</T></a>
          </li>
        ))}
      </ul>
    );
  }

  renderAssetsTable () {
    return null;
  }

  renderDistrictsTable () {
    const { language, aa: { data } } = this.props;
    const nameVar = language === 'en' ? 'name_en' : 'name_vn';

    return (
      <div className='table'>
        <table>
          <StatsTableHeader type='district'/>
          <tbody>
            {data.districts.map(d => (
              <StatsTableRow
                key={d.id}
                type='district'
                data={d}
                lang={language}
                provinceId={data.id}
                districtId={d.id}
                districtName={d[nameVar]} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  render () {
    const { language, params: { aaId, aaIdSub }, aa: { fetched, fetching, data } } = this.props;
    const isDistrict = !!aaIdSub;

    if (!fetched || fetching) return null;

    return (
      <div className='incontainer'>
        <div className='incontainer__header'>
          {this.renderHeadline()}

          <div className='incontainer__hactions'>
            {!aaIdSub && aaId && <a href={`${config.provinceDumpBaseUrl}${aaId}.csv`} className='ica-download'><T>Download</T></a>}
            <AssetsCreate />
          </div>
        </div>

        <div>
          {this.renderTabs()}
          {this.state.activeTab === 'assets' && this.renderAssetsTable()}
          {this.state.activeTab === 'districts' && this.renderDistrictsTable()}
        </div>
      </div>
    );
  }
}

if (config.environment !== 'production') {
  AssetsAA.propTypes = {
    fetchAdminStatsAA: React.PropTypes.func,
    params: React.PropTypes.object,
    language: React.PropTypes.string,
    aa: React.PropTypes.object
  };
}

//
//
//

export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    (state, props) => {
      const {aaId, aaIdSub} = props.params;
      const id = aaIdSub ? `${aaId}-${aaIdSub}` : aaId;
      return {
        aa: _.get(state.adminStats.aa, id, {fetched: false, fetching: false, data: {}})
      };
    },
    dispatch => ({
      fetchAdminStatsAA: (...args) => dispatch(fetchAdminStatsAA(...args))
    })
  )
)(AssetsAA);
