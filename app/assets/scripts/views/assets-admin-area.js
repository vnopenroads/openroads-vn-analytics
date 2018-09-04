'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
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
import { getRoadPageKey, fetchRoadsEpic } from '../redux/modules/roads';
import { getRoadCountKey, fetchAARoadCountEpic, mergeAA } from '../redux/modules/road-count';
import { round } from '../utils/format';
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
    const {page, sortField, sortOrder, params: {aaId, aaIdSub}} = props;

    (aaIdSub ? props.fetchAdminStatsAA('district', aaId, aaIdSub) : props.fetchAdminStatsAA('province', aaId))
      .then(res => {
        const adminArea = this.props.aa.data;
        let provCode;
        let districtCode;
        if (adminArea.type === 'province') {
          provCode = adminArea.code;
        } else {
          provCode = adminArea.province.code;
          districtCode = adminArea.code;
        }
        return Promise.all([
          props.fetchRoadsEpic(provCode, districtCode, page, sortField, sortOrder),
          props.fetchAARoadCountEpic(provCode, districtCode)
        ]);
      })
      .catch(e => console.log('e', e));
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
    const {roadsPageStatus, roadsPage, language} = this.props;

    if (roadsPageStatus !== 'complete') return null;

    const renderRound = (r, accessor) => {
      const val = _.get(r, accessor, null);
      if (val === null) return 'n/a';
      return round(val);
    };

    const columns = [
      {
        accessor: 'id',
        label: 'Vpromm Id',
        render: (r) => <Link to={`/${language}/assets/road/${r.id}`} title={translate(language, 'View asset page')}>{r.id}</Link>
      },
      {accessor: 'status', label: 'Review Status'},
      {accessor: 'properties.iri_mean', label: 'IRI', render: renderRound},
      {accessor: 'properties.Road Type', label: 'Type'},
      {accessor: 'properties.width', label: 'Width'},
      {accessor: 'properties.length', label: 'Length', render: renderRound},
      {accessor: 'properties.grade', label: 'Grade'}
    ];

    return (
      <div className='table'>
        <table>
          <thead>
            <tr>
              {columns.map(({accessor, label}) => <th key={accessor}>{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {roadsPage.map(r => (
              <tr key={r.id}>
                {columns.map(({accessor, render}) => <td key={accessor}>{render ? render(r, accessor) : (_.get(r, accessor) || 'n/a')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
    const { params: { aaId, aaIdSub }, aa: { fetched, fetching } } = this.props;

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
    aa: React.PropTypes.object,
    roadsPageStatus: React.PropTypes.string,
    roadsPage: React.PropTypes.array
  };
}

//
//
//

const localState = { sortOrder: 'asc', sortField: 'id', page: 1 };

const reducer = (state = localState, action) => {
  if (action.type === 'SORT_COLUMN') {
    return Object.assign({}, state, {
      sortOrder: action.sortOrder,
      sortField: action.sortField
    });
  } else if (action.type === 'SET_PAGE') {
    return Object.assign({}, state, {
      page: action.page
    });
  }

  return state;
};


export default compose(
  getContext({ language: React.PropTypes.string }),
  local({
    key: ({ router: { params: { aaId = '', aaIdSub = '' } } }) => `road-table-${aaId}-${aaIdSub}`,
    createStore: () => createStore(reducer),
    mapDispatchToProps: (dispatch) => ({
      sortColumn: (sortField, sortOrder) => dispatch({ type: 'SORT_COLUMN', sortField, sortOrder }),
      setPage: (page) => dispatch({ type: 'SET_PAGE', page })
    }),
    filterGlobalActions: () => false
  }),
  connect(
    (state, props) => {
      const {page, sortField, sortOrder, params: {aaId, aaIdSub}} = props;
      // Admin area id to get from state.
      const id = aaIdSub ? `${aaId}-${aaIdSub}` : aaId;
      const aa = _.get(state.adminStats.aa, id, {fetched: false, fetching: false, data: {}});
      const aaData = aa.data;
      // Get the district and province code for the RoadPageKey.
      // Depending on whether it is a district or province the keys differ.
      const aaType = _.get(aaData, 'type', null);
      let provCode;
      let districtCode;
      if (aaType === 'province') {
        provCode = _.get(aaData, 'code', null);
      } else if (aaType === 'district') {
        provCode = _.get(aaData, 'province.code', null);
        districtCode = _.get(aaData, 'code', null);
      }

      // Get the road data by computing the road page key.
      // The road data uses the province and district code instead of the id.
      const roadPageKey = getRoadPageKey(provCode, districtCode, page, sortField, sortOrder);
      const roadsPage = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].roads;
      const roadsPageStatus = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].status;

      // Get the road count key, which uses the province and district code.
      const roadCountKey = getRoadCountKey(provCode, districtCode);

      let aaWithCounts;
      if (roadCountKey === null) {
        // There are quite some provinces without a code.
        // Just return without the fields.
        aaWithCounts = aaData;
      } else {
        // Add the road count to the admin area data by merging the data.
        const roadCountStatus = _.get(state.roadCount.aa, [roadCountKey, 'status'], null);
        const roadCount = _.get(state.roadCount.aa, [roadCountKey, 'province'], null);
        if (aa.fetched && !aa.error && roadCountStatus === 'complete') {
          if (aaType === 'province') {
            const districts = aaData.districts.map(district => mergeAA(district, roadCount, [aaData.code, 'district', district.code]));
            aaWithCounts = mergeAA(aaData, roadCount, [aaData.code], {districts});
          } else {
            aaWithCounts = mergeAA(aaData, roadCount, [aaData.province.code, 'district', aaData.code]);
          }
        } else {
          aaWithCounts = aaData;
        }
      }

      return {
        roadsPage,
        roadsPageStatus,
        aa: {
          ...aa,
          data: aaWithCounts
        }
      };
    },
    dispatch => ({
      fetchAdminStatsAA: (...args) => dispatch(fetchAdminStatsAA(...args)),
      fetchRoadsEpic: (...args) => dispatch(fetchRoadsEpic(...args)),
      fetchAARoadCountEpic: (...args) => dispatch(fetchAARoadCountEpic(...args))
    })
  )
)(AssetsAA);
