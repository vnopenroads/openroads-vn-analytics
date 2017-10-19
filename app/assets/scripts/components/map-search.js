'use strict';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { t, getLanguage } from '../utils/i18n';
import { isDescendent } from '../utils/dom';
import {
  fetchVProMMsids,
  fetchVProMMsBbox,
  setFilteredVProMMs,
  fetchAdmins,
  clearAdmins,
  fetchAdminBbox
} from '../actions/action-creators';

var MapSearch = React.createClass({
  displayName: 'MapSearch',

  render: function () {
    return (
      <div className='panel search-panel'>
        <form className='form'>
          <div className='form__group search'>
            <label className='form__label' htmlFor='search-field'>Search</label>
            <div className='form__input-group form__input-group--medium'>
              <select className='form__control'>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
                <option>Option 4</option>
                <option>Option 5</option>
              </select>
              <input type='text' id='search-field' name='search-field' className='form__control' placeholder='Search' />
              <button type='button' className='search__button' title='Submit'><span>Search</span></button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

function selector (state) {
  return {
    admins: state.admins.units,
    vpromms: state.VProMMSids.data,
    filteredVProMMs: state.setFilteredVProMMs,
    searchResultsDisplay: state.searchResultsDisplay.show
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsids: (use) => dispatch(fetchVProMMsids(use)),
    _fetchVProMMsBbox: (vprommsId) => dispatch(fetchVProMMsBbox(vprommsId)),
    _setFilteredVProMMs: (filteredVProMMs) => dispatch(setFilteredVProMMs(filteredVProMMs)),
    _clearAdmins: () => dispatch(clearAdmins()),
    _fetchAdmins: (id) => dispatch(fetchAdmins(id)),
    _fetchAdminBbox: (id) => dispatch(fetchAdminBbox(id))
  };
}

module.exports = connect(selector, dispatcher)(MapSearch);
