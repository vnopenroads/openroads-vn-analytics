'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { local } from 'redux-fractal';
import { createStore } from 'redux';
import ReactPaginate from 'react-paginate';
import {
  compose,
  getContext
} from 'recompose';
import { Link } from 'react-router';
import _ from 'lodash';
import c from 'classnames';

import AssetsCreate from '../components/assets-create';
import T, { translate } from '../components/t';
import { StatsTableHeader, StatsTableRow, StatsBlock } from '../components/admin-stats-tables';

import { fetchAdminStatsAA } from '../redux/modules/admin-stats';
import { getRoadPageKey, fetchRoadsEpic } from '../redux/modules/roads';
import { getRoadCountKey, fetchAARoadCountEpic, mergeAA } from '../redux/modules/road-count';
import { round } from '../utils/format';
import config from '../config';

const getAACodes = (data) => {
  let province = null;
  let district = null;
  if (data.type === 'province') {
    province = _.get(data, 'code', null);
  } else {
    province = _.get(data, 'province.code', null);
    district = _.get(data, 'code', null);
  }
  return { province, district };
};

class AssetsAA extends React.Component {
  constructor (props) {
    super(props);

    this.onCreateAssetClick = this.onCreateAssetClick.bind(this);
    this.handleRoadsPageChange = this.handleRoadsPageChange.bind(this);

    this.state = {
      createModalOpen: false,
      activeTab: 'assets'
    };
  }

  fetchData (props) {
    const {page, sortField, sortOrder, params: {aaId, aaIdSub}} = props;

    (aaIdSub ? props.fetchAdminStatsAA('district', aaId, aaIdSub) : props.fetchAdminStatsAA('province', aaId))
      .then(res => {
        const codes = getAACodes(this.props.aa.data);
        return Promise.all([
          props.fetchRoadsEpic(codes.province, codes.district, page, sortField, sortOrder),
          props.fetchAARoadCountEpic(codes.province, codes.district)
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

  handleRoadsPageChange ({selected}) {
    const {sortField, sortOrder, aa} = this.props;
    const codes = getAACodes(aa.data);
    const newPage = selected + 1;
    this.props.setPage(newPage);
    this.props.fetchRoadsEpic(codes.province, codes.district, newPage, sortField, sortOrder);
  }

  handleRoadsSortChange (field, e) {
    e.preventDefault();
    const {sortField, sortOrder, aa} = this.props;
    const codes = getAACodes(aa.data);

    const newOrder = field !== sortField ? 'asc' : sortOrder === 'asc' ? 'desc' : 'asc';
    this.props.sortColumn(field, newOrder);
    // Changing the sort resets the page.
    const newPage = 1;
    this.props.setPage(newPage);

    this.props.fetchRoadsEpic(codes.province, codes.district, newPage, field, newOrder);
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
      <ul className='nav-tabs'>
        {tabs.map(t => (
          <li key={t.key}>
            <a href='#' className={c({'tab--active': this.state.activeTab === t.key})} title={translate(this.props.language, 'Switch tab')} onClick={this.onTabClick.bind(this, t.key)}><T>{t.label}</T></a>
          </li>
        ))}
      </ul>
    );
  }

  renderAssetsTable () {
    const {
      roadsPageStatus,
      roadsPage,
      language,
      aa: {data: aaData},
      page,
      sortField,
      sortOrder
    } = this.props;

    if (roadsPageStatus !== 'complete') return null;

    // Pagination variables.
    const perPage = 20;
    const totalItems = aaData.totalRoads;

    const renderRound = (r, accessor) => {
      const val = _.get(r, accessor, null);
      if (val === null) return 'n/a';
      return round(val);
    };
    const columns = [
      {
        accessor: 'id',
        label: 'Vpromm Id',
        sortable: true,
        render: (r) => <Link to={`/${language}/assets/road/${r.id}`} title={translate(language, 'View asset page')}>{r.id}</Link>
      },
      {
        accessor: 'status',
        label: translate(language, 'Review Status'),
        render: (r) => translate(language, r.status) || translate(language, 'pending')
      },
      {accessor: 'properties.iri_mean', label: translate(language, 'IRI'), render: renderRound},
      {accessor: 'properties.Road Type', label: translate(language, 'Road Type')},
      {accessor: 'properties.width', label: translate(language, 'Width')},
      {accessor: 'properties.length', label: translate(language, 'Road Length (ORMA)'), render: renderRound},
      {accessor: 'properties.grade', label: translate(language, 'Grade')}
    ];

    return (
      <div>
        <table className='table'>
          <thead>
            <tr>
              {columns.map(({accessor, label, sortable}) => {
                const sortClasses = c('table__sort', {
                  'table__sort--none': sortField !== accessor,
                  'table__sort--asc': sortField === accessor && sortOrder === 'asc',
                  'table__sort--desc': sortField === accessor && sortOrder === 'desc'
                });
                return sortable
                  ? (
                    <th key={accessor}>
                      <a
                        href='#'
                        className={sortClasses}
                        title={translate(language, 'Sort by this field')}
                        onClick={this.handleRoadsSortChange.bind(this, accessor)}>{label}</a>
                    </th>
                  ) : <th key={accessor}>{label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {roadsPage.map(r => (
              <tr key={r.id}>
                {columns.map(({accessor, render}, i) => {
                  const El = i === 0 ? 'th' : 'td';
                  return <El key={accessor}>{render ? render(r, accessor) : (_.get(r, accessor) || 'n/a')}</El>;
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className='pagination-wrapper'>
          <ReactPaginate
            previousLabel={<span>{translate(language, 'previous')}</span>}
            nextLabel={<span>{translate(language, 'next')}</span>}
            breakLabel={<span className='pages__page'>...</span>}
            pageCount={Math.ceil(totalItems / perPage)}
            forcePage={page - 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handleRoadsPageChange}

            subContainerClassName={'pages'}
            pageClassName={'pages__wrapper'}
            pageLinkClassName={'pages__page'}
            activeClassName={'active'} />
        </div>
      </div>
    );
  }

  renderDistrictsTable () {
    const { language, aa: { data } } = this.props;
    const nameVar = language === 'en' ? 'name_en' : 'name_vn';

    if (!data.districts.length) return <p className='empty'><T>There are no districts for this province</T></p>;

    return (
      <table className='table table--aa'>
        <StatsTableHeader type='district'/>
        <tbody>
          {_.sortBy(data.districts, nameVar).map(d => (
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
    );
  }

  renderStats () {
    const lang = this.props.language;
    const { fetched, fetching, data } = this.props.aa;

    if (!fetched || fetching) {
      return null;
    }

    const totalLength = _.get(data, 'total', 0);
    const totalVprommLength = _.get(data, 'vpromm', 0);
    const totalRoads = _.get(data, 'totalRoads', 0);
    const totalOSMRoads = _.get(data, 'osmRoads', 0);
    const statusPending = _.get(data, 'status.pending', 0);
    const statusReviewed = _.get(data, 'status.reviewed', 0);

    const progressPercent = round(totalOSMRoads / totalRoads * 100) || 0;
    const progressIndicators = [
      { label: translate(lang, 'Total'), value: totalRoads },
      { label: translate(lang, 'Field data'), value: `${totalOSMRoads} (${progressPercent}%)` }
    ];
    const statusIndicators = [
      { label: translate(lang, 'Pending'), value: statusPending },
      { label: translate(lang, 'Reviewed'), value: statusReviewed }
    ];
    const lengthPercent = round(Math.min(totalVprommLength / totalLength * 100, 100) || 0);
    const lengthIndicators = [
      { label: translate(lang, 'WoN'), value: `${round(totalLength)}Km` },
      { label: translate(lang, 'GProMMS'), value: `${round(totalVprommLength)}Km (${lengthPercent}%)` }
    ];

    return (
      <div className='stats-container'>
        <StatsBlock
          title={translate(lang, 'Progress')}
          total={totalRoads}
          completed={totalOSMRoads}
          list={progressIndicators} />
        <StatsBlock
          title={translate(lang, 'Status')}
          total={statusReviewed + statusPending}
          completed={statusReviewed}
          list={statusIndicators} />
        <StatsBlock
          title={translate(lang, 'Road length')}
          total={totalLength}
          completed={totalVprommLength}
          list={lengthIndicators} />
      </div>
    );
  }

  render () {
    const { params: { aaId, aaIdSub }, aa: { fetched, fetching, error } } = this.props;

    const Barebones = ({title, children}) => (
      <div className='incontainer'>
        <div className='incontainer__header'>
          <div className='incontainer__headline'>
            <h2 className='incontainer__title'><T>{title}</T></h2>
          </div>
        </div>
        {children}
      </div>
    );

    if (!fetched || fetching) {
      return (
        <Barebones title='Loading'>
          <p>Data is loading...</p>
        </Barebones>
      );
    }

    if (fetched && error) {
      return (
        <Barebones title='Error'>
          <p>Something went wrong with the request. { error }</p>
        </Barebones>
      );
    }

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
          {this.renderStats()}
          {this.renderTabs()}
          {this.props.params.aaIdSub && <h3>Assets</h3>}
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
    fetchRoadsEpic: React.PropTypes.func,
    fetchAARoadCountEpic: React.PropTypes.func,
    setPage: React.PropTypes.func,
    sortColumn: React.PropTypes.func,
    page: React.PropTypes.number,
    sortField: React.PropTypes.string,
    sortOrder: React.PropTypes.string,
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
      const codes = getAACodes(aaData);

      // Get the road data by computing the road page key.
      // The road data uses the province and district code instead of the id.
      const roadPageKey = getRoadPageKey(codes.province, codes.district, page, sortField, sortOrder);
      const roadsPage = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].roads;
      const roadsPageStatus = state.roads.roadsByPage[roadPageKey] && state.roads.roadsByPage[roadPageKey].status;

      // Get the road count key, which uses the province and district code.
      const roadCountKey = getRoadCountKey(codes.province, codes.district);

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
            const status = {
              pending: districts.reduce((acc, d) => acc + _.get(d, 'status.pending', 0), 0),
              reviewed: districts.reduce((acc, d) => acc + _.get(d, 'status.reviewed', 0), 0)
            };
            aaWithCounts = mergeAA(aaData, roadCount, [aaData.code], {districts, status});
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
