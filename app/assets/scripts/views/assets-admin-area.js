'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  getContext
} from 'recompose';
import T from '../components/t';
import { makeIdTest, getAdminId, getAdminName } from '../utils/admin-level';
import { Link } from 'react-router';
import c from 'classnames';
import RoadTable from '../containers/road-table-container';
import {
  fetchAdminInfo,
  fetchFieldRoads,
  fetchAdminVProMMsProps,
  removeAdminVProMMsProps,
  removeFieldRoads,
  removeAdminInfo,
  removeCrosswalk,
  setCrossWalk,
  setPreviousLocation,
  setSubAdminName
} from '../actions/action-creators';
import config from '../config';


var AssetsAA = React.createClass({
  displayName: 'AssetsAA',

  propTypes: {
    _fetchAdminVProMMsProps: React.PropTypes.func,
    _fetchFieldRoads: React.PropTypes.func,
    _fetchAdminInfo: React.PropTypes.func,
    _removeAdminInfo: React.PropTypes.func,
    _removeAdminVProMMsProps: React.PropTypes.func,
    _removeFieldRoads: React.PropTypes.func,
    _removeCrosswalk: React.PropTypes.func,
    _setCrossWalk: React.PropTypes.func,
    _setPreviousLocation: React.PropTypes.func,
    _setSubAdminName: React.PropTypes.func,
    crosswalk: React.PropTypes.object,
    crosswalkSet: React.PropTypes.bool,
    params: React.PropTypes.object,
    fieldRoads: React.PropTypes.array,
    fieldFetched: React.PropTypes.bool,
    language: React.PropTypes.string,
    adminInfo: React.PropTypes.object,
    adminInfoFetched: React.PropTypes.bool,
    location: React.PropTypes.object,
    history: React.PropTypes.object,
    previousLocation: React.PropTypes.string
  },

  // before mount, get the admin info needed to make the list of child elements
  // as well as build the correct api queries in getAdminData
  componentWillMount: function () {
    this.props._setCrossWalk();
  },

  // on each unmount, drain properties and admin info objects so to
  // make the component to be the same each time
  componentWillUnmount: function () {
    this.clearAdminData();
    this.props._removeCrosswalk();
    this.props._setPreviousLocation(this.props.location.pathname);
  },

  // use the aaId to get the initial field data
  componentWillReceiveProps: function (nextProps) {
    if (!this.props.crosswalkSet && nextProps.crosswalkSet) { this.getAdminData(nextProps); }
    if (this.props.location.pathname !== nextProps.location.pathname) {
      const sameLanguage = (this.props.params.lang === nextProps.params.lang);
      const level = !this.props.params.aaIdSub ? 'province' : 'district';
      const sameAdmin = level === 'province' ? (this.props.params.aaId === nextProps.params.aaId) : (this.props.params.aaIdSub === nextProps.params.aaIdSub);
      // if back button is pressed right after the language was updated,
      // go back to the parent admin, not the same admin w/different language per the default.
      if (nextProps.location.action === 'POP') {
        if (sameAdmin && !sameLanguage) {
          const path = (level === 'district') ? `/${nextProps.language}/assets/${this.props.params.aaId}` : `/${nextProps.language}/assets/`;
          this.props.history.push(path);
        }
      }
      if (this.props.language !== nextProps.language) { return; }
      if (nextProps.location.action === 'POP') { this.clearAdminData(); }
      this.getAdminData(nextProps);
    }
  },

  clearAdminData: function () {
    this.props._removeAdminVProMMsProps();
    this.props._removeFieldRoads();
  },

  getAdminData: function (props) {
    const level = !props.params.aaIdSub ? 'province' : 'district';
    const ids = {aaId: props.params.aaId};
    if (level === 'district') { ids['aaIdSub'] = props.params.aaIdSub; }
    const idTest = makeIdTest(props.crosswalk, ids, level);
    const index = 0;
    this.props._fetchFieldRoads(idTest, level);
    this.props._fetchAdminVProMMsProps(idTest, level, 20, index);
    this.props._fetchAdminInfo(props.params.aaId);
    this.props._removeAdminInfo();
  },

  makeAdminName: function () {
    const level = !this.props.params.aaIdSub ? 'province' : 'district';
    const idFinder = (level === 'province') ? { aaId: this.props.params.aaId } : { aaIdSub: this.props.params.aaIdSub };
    return getAdminName(this.props.crosswalk, idFinder, level, this.props.adminInfo);
  },

  renderAdminChildren: function (children) {
    if (this.props.params.aaIdSub) {
      return (
        <div/>
      );
    }

    if (this.props.adminInfoFetched) {
      const aaId = this.props.params.aaId;
      // ignore any children not in the crosswalk.
      children = children.filter(child => this.props.crosswalk['district'][child.id] !== undefined);
      // disable child buttons if crosswalk value !== vpromms district id.
      const childClasses = children.map(child => c({'disabled': this.props.crosswalk['district'][child.id] === ''}));
      return (
        <nav className='a-subnav'>
        <h2><T>Districts</T></h2>
        <ul className='a-children'>
          {children.map((child, i) => {
            var childKey = `${child}-${i}`;
            return (
              <li key={childKey} ><Link className={childClasses[i]} onClick={(e) => { this.clearAdminData(); this.props._setCrossWalk(); this.props._setSubAdminName(child.name_en); }}to={`/${this.props.language}/assets/${aaId}/${child.id}`}>{child.name_en}</Link>
            </li>
            );
          })}
        </ul>
        </nav>
      );
    } else {
      return (<div className='a-subnav'><h2 className='a-loading'>Loading Child Admins</h2></div>);
    }
  },

  renderAssetsAdmin: function () {
    // There's no reason for this to be repeated from above,
    // but the admin-crosswalking logic is convoluted  so it was expedient.
    // This should be refactored out.
    const level = !this.props.params.aaIdSub ? 'province' : 'district';
    const idFinder = (level === 'province') ? { aaId: this.props.params.aaId } : { aaIdSub: this.props.params.aaIdSub };
    const id = getAdminId(this.props.crosswalk, idFinder, level);

    return (
      <section>
        <header className='a-header'>
          <div className='a-headline'>
            <h1>{this.props.adminInfoFetched && this.makeAdminName()}</h1>
          </div>
          {/* completion suggests data exists, in whcih case there is data available for download */}
          <div className='a-head-actions'>
            <a
              className='button button--secondary-raised-dark'
              href={`${config.provinceDumpBaseUrl}${id}.csv`}
            >
              <T>Download Roads</T>
            </a>
          </div>
        </header>
        <div>
          {
            this.renderAdminChildren(this.props.adminInfo.children)
          }
          
          <RoadTable fieldRoads={this.props.fieldRoads} />
        </div>
      </section>
    );
  },

  render: function () {
    const roadsFetched = this.props.fieldFetched;

    return (
      <div ref='a-admin-area' className='a-admin-area-show'>
        {roadsFetched ? this.renderAssetsAdmin() : (<div/>)}
      </div>
    );
  }
});


export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      adminInfo: state.adminInfo.data,
      adminInfoFetched: state.adminInfo.fetched,
      crosswalk: state.crosswalk,
      crosswalkSet: state.crosswalk.set,
      fieldRoads: state.fieldRoads.ids,
      fieldFetched: state.fieldRoads.fetched,
      previousLocation: state.previousLocation.path
    }),
    dispatch => ({
      _fetchAdminVProMMsProps: (ids, level, limit, offset) => dispatch(fetchAdminVProMMsProps(ids, level, limit, offset)),
      _fetchFieldRoads: (idTest, level) => dispatch(fetchFieldRoads(idTest, level)),
      _fetchAdminInfo: (id, level) => dispatch(fetchAdminInfo(id, level)),
      _removeAdminInfo: () => dispatch(removeAdminInfo()),
      _removeFieldRoads: () => dispatch(removeFieldRoads()),
      _removeCrosswalk: () => dispatch(removeCrosswalk()),
      _removeAdminVProMMsProps: () => dispatch(removeAdminVProMMsProps()),
      _setCrossWalk: () => dispatch(setCrossWalk()),
      _setPreviousLocation: (location) => dispatch(setPreviousLocation(location)),
      _setSubAdminName: (name) => dispatch(setSubAdminName(name))
    })
  )
)(AssetsAA);
