'use strict';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { t } from '../utils/i18n';
import { isDescendent } from '../utils/dom';
import {
  fetchVProMMsids,
  fetchVProMMsBbox,
  setFilteredVProMMs,
  fetchAdmins,
  fetchAdminBbox
} from '../actions/action-creators';

var Search = React.createClass({
  displayName: 'Search',

  propTypes: {
    admins: React.PropTypes.array,
    cleanSearchResults: React.PropTypes.func,
    onResultClick: React.PropTypes.func,
    results: React.PropTypes.array,
    searching: React.PropTypes.bool,
    isEditor: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    fetchSearchResults: React.PropTypes.func,
    searchType: React.PropTypes.string,
    vpromms: React.PropTypes.array,
    filteredVProMMs: React.PropTypes.array,
    _setFilteredVProMMs: React.PropTypes.func,
    _fetchVProMMsids: React.PropTypes.func,
    _fetchVProMMsBbox: React.PropTypes.func,
    _fetchAdmin: React.PropTypes.func,
    _fetchAdminBbox: React.PropTypes.func
  },

  onSearchQueryChange: function () {
    this.searchVal = _.trim(this.refs.searchBox.value);
    if (this.props.searchType === 'Admin') {
      if (this.searchVal.length >= 3) {
        this.props._fetchAdmin(this.searchVal);
      } else {
        this.props.cleanSearchResults();
      }
    } else {
      if (this.searchVal.length >= 2) {
        this.filterVProMMs(this.searchVal);
      } else {
        this.props._setFilteredVProMMs([]);
      }
    }
  },

  filterVProMMs: function (searchVal) {
    const matches = this.props.vpromms.filter((vpromm) => {
      return vpromm.slice(0, searchVal.length) === searchVal.toUpperCase();
    });
    this.props._setFilteredVProMMs(matches.slice(0, 10));
  },

  searchVProMMsID: function (VProMMsID) {
    this.props._fetchVProMMsBbox(VProMMsID);
  },

  searchAdminArea: function (adminAreaID) {
    this.props._fetchAdminBbox(adminAreaID);
  },

  searchClick: function (e) {
    e.preventDefault();
    if (!this.props.fetching) {
      this.searchVal = _.trim(this.refs.searchBox.value);
      if (this.searchVal.length) {
        if (this.props.searchType === 'Admin') {
          this.props.fetchSearchResults(this.searchVal);
        } else {
          this.searchVProMMsID(this.props.filteredVProMMs[0]);
        }
      }
    }
  },

  onDocumentClick: function (e) {
    // Clicks within the search box do not clear the results.
    if (!isDescendent(e.target, this.refs.searchForm)) {
      if (this.props.searching) {
        this.resetSearchResults();
      }
    }
  },

  onKeyup: function (e) {
    // Esc key
    if (e.keyCode === 27) {
      if (this.props.searching) {
        this.refs.searchBox.blur();
        this.resetSearchResults();
      }
    }
  },

  _handleKeyPress: function (e) {
    if (e.key === 'Enter') {
      this.props._fetchVProMMsBbox(this.props.filteredVProMMs[0]);
    }
  },

  onResultClick: function (e) {
    this.resetSearchResults();
    if (this.props.onResultClick) {
      this.props.onResultClick(e);
    }
  },

  resetSearchResults: function () {
    this.refs.searchBox.value = '';
    this.props.cleanSearchResults();
  },

  componentDidMount: function () {
    // searchVal is used throughout the component methods, so setting it to the `this` obj to make it available throughout
    this.searchVal = '';
    document.addEventListener('click', this.onDocumentClick, false);
    document.addEventListener('keyup', this.onKeyup, false);
    // this.props._fetchVProMMsids('search');
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this.onDocumentClick, false);
    document.removeEventListener('keyup', this.onKeyup, false);
  },

  renderResults: function () {
    if (this.props.fetching) {
      return (<p className='info'>Loading...</p>);
    }
    // Group by type.
    var g = this.props.searchType === 'Admin' ? this.props.admins : this.props.filteredVProMMs;
    var results = [];
    if (this.props.searchType === 'Admin') {
      if (!g.length) {
        return (<p className='info'>No results available. Please refine your search.</p>);
      }
      results.push(
        <dt key={`aa-type-0`} className='drop-menu-sectitle'>
          <strong>{g[0].level}</strong>;
        </dt>
      );
      _.forEach(g, (o, k) => {
        results.push(
          <dd key={`aa-type-0-${k}`} className='drop-menu-result'
            onClick={(e) => {
              const adminArea = g.find(o => o.name_en === e.target.textContent).id;
              this.searchAdminArea(adminArea);
            }}
            >
            <small>{o.name_en}</small>
          </dd>
        );
      });
    } else {
      _.forEach(g, (o, k) => {
        results.push(
        <dt key={`aa-type-${k}`} className='drop-menu-sectitle'
          onClick={(e) => {
            const vprommsId = e.target.textContent;
            this.searchVProMMsID(vprommsId);
          }}>
          <strong>{o}</strong>
        </dt>);
      });
    }
    return (
      <dl className='drop-menu'>
        {results}
      </dl>
    );
  },

  searchBar: function () {
    const searchPlaceHolder = this.props.searchType === 'Admin' ? 'Search by administrative area' : 'Search by VProMMs ID';
    return (
      <div className='input-group'>
        <input type='search' className='form-control input-search'
          placeholder={searchPlaceHolder} ref='searchBox'
          onChange={_.debounce(this.onSearchQueryChange, 300)}
          onKeyPress={this._handleKeyPress} />
        <span className='input-group-bttn'>
          <a href='#' className='bttn-search'
            onClick={this.searchClick}>
            <span>{t('Search')}</span>
          </a>
        </span>
      </div>
    );
  },

  render: function () {
    const resultsExist = this.props.admins[0] || this.props.filteredVProMMs.length > 0;
    const searchResultsClasses = classNames({
      'drop-content': true,
      'search-results': true,
      'search-results-show': resultsExist
    });
    return (
      <form className='form-search' ref='searchForm'>
        <div className={classNames('drop dropdown center', {open: this.props.searching})}>
          {this.searchBar()}
          <div className={searchResultsClasses}>
            {this.renderResults()}
          </div>
        </div>
      </form>
    );
  }
});

function selector (state) {
  return {
    admins: state.admins.units,
    vpromms: state.VProMMSids.data,
    filteredVProMMs: state.setFilteredVProMMs.filteredVProMMs
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMsids: (use) => dispatch(fetchVProMMsids(use)),
    _fetchVProMMsBbox: (vprommsId) => dispatch(fetchVProMMsBbox(vprommsId)),
    _setFilteredVProMMs: (filteredVProMMs) => dispatch(setFilteredVProMMs(filteredVProMMs)),
    _fetchAdmin: (id) => dispatch(fetchAdmins(id)),
    _fetchAdminBbox: (id) => dispatch(fetchAdminBbox(id))
  };
}

module.exports = connect(selector, dispatcher)(Search);
