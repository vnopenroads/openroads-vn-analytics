'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  getContext
} from 'recompose';
import { connect } from 'react-redux';

import {
  setSearchType,
  fetchAllVProMMsIds,
  setFilteredVProMMs,
  fetchAdmins,
  clearAdmins,
  fetchAdminBbox
} from '../actions/action-creators';
import {
  fetchRoadBboxEpic,
  fetchRoadPropertyEpic
} from '../redux/modules/roads';
import { withRouter } from 'react-router';
import {
  push
} from 'react-router-redux';

import BaseSearch from './base-search';


export default compose(
  getContext({ language: PropTypes.string }),
  withRouter,
  // withProps(({ location: { query: { activeRoad } } }) => ({
  //   activeRoad
  // })),
  connect(
    state => ({
      searchType: state.setSearchType.searchType,
      admins: state.admins.units,
      vpromms: state.fieldVProMMsids.ids,
      filteredVProMMs: state.setFilteredVProMMs,
      fetching: state.admins.fetching
    }),
    (dispatch, { location }) => ({
      _fetchFieldVProMMsIds: (...args) => dispatch(fetchAllVProMMsIds(...args)),
      _setSearchType: (...args) => dispatch(setSearchType(...args)),
      _setFilteredVProMMs: (filteredVProMMs) => dispatch(setFilteredVProMMs(filteredVProMMs)),
      _clearAdmins: () => dispatch(clearAdmins()),
      _fetchAdmins: (id) => dispatch(fetchAdmins(id)),
      _fetchAdminBbox: (id) => dispatch(fetchAdminBbox(id)),
      fetchRoadBbox: (vprommsId) => {
        dispatch(push(Object.assign({}, location, {
          query: Object.assign({}, location.query, {
            activeRoad: vprommsId
          })
        })));
        dispatch(fetchRoadBboxEpic(vprommsId));
      },
      fetchRoadProperty: (vprommsId) => {
        dispatch(fetchRoadPropertyEpic(vprommsId));
      }
    })
  )
)(BaseSearch);
