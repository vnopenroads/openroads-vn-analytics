'use strict';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { t, getLanguage } from '../utils/i18n';
import { isDescendent } from '../utils/dom';
import {
  fetchFieldVProMMsIds,
  fetchVProMMsBbox,
  setFilteredVProMMs,
  fetchAdmins,
  clearAdmins,
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
    lang: React.PropTypes.string,
    searchType: React.PropTypes.string,
    searchResultsDisplay: React.PropTypes.bool,
    vpromms: React.PropTypes.array,
    query: React.PropTypes.string,
    filteredVProMMs: React.PropTypes.array,
    _setFilteredVProMMs: React.PropTypes.func,
    _fetchFieldVProMMsIds: React.PropTypes.func,
    _fetchVProMMsBbox: React.PropTypes.func,
    _fetchAdmins: React.PropTypes.func,
    _clearAdmins: React.PropTypes.func,
    _fetchAdminBbox: React.PropTypes.func
  },

  onSearchQueryChange: function () {
    var searchVal = _.trim(this.refs.searchBox.value);
    if (this.props.searchType === 'Admin') {
      if (searchVal.length > 0) {
        this.props._fetchAdmins(searchVal);
        this.refs.results.classList.add('search-results-show');
      } else {
        this.props._clearAdmins();
        this.refs.results.classList.remove('search-results-show');
      }
    } else {
      if (searchVal.length >= 2) {
        this.filterVProMMs(searchVal);
        this.refs.results.classList.add('search-results-show');
      } else {
        this.props._setFilteredVProMMs([]);
        this.refs.results.classList.remove('search-results-show');
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
    this.fireSearch();
  },

  fireSearch: function () {
    if (!this.props.fetching) {
      var searchVal = _.trim(this.refs.searchBox.value);
      if (searchVal.length) {
        if (this.props.searchType === 'Admin') {
          this.searchAdminArea(this.props.admins[0].id);
          this.refs.searchBox.value = this.props.admins[0].name_en;
        } else {
          this.searchVProMMsID(this.props.filteredVProMMs[0]);
        }
        this.refs.results.classList.remove('search-results-show');
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
      this.fireSearch();
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
    this.props._fetchFieldVProMMsIds();
    document.addEventListener('click', this.onDocumentClick, false);
    document.addEventListener('keyup', this.onKeyup, false);
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this.onDocumentClick, false);
    document.removeEventListener('keyup', this.onKeyup, false);
  },

  componentWillReceiveProps: function (nextProps) {
    const newSearchType = (this.props.searchType !== nextProps.searchType);
    const newLang = (this.props.lang !== nextProps.lang);
    if (newSearchType || newLang) {
      this.refs.searchBox.value = '';
      this.refs.results.classList.remove('search-results-show');
    }
  },

  renderPlaceHolder: function (results) {
    if (this.refs.searchBox) {
      results.push(<p className='info'>No results available. Please refine your search.</p>);
      return results;
    }
  },

  renderResults: function () {
    if (this.props.fetching) {
      return (<p className='info'>{t('Loading...')}</p>);
    }
    // Group by type.
    var g = this.props.searchType === 'Admin' ? this.props.admins : this.props.filteredVProMMs;
    var results = [];
    if (this.props.searchType === 'Admin') {
      // if no results are shown, prompt user with one of the two messages.
      if (!g.length) {
        this.renderPlaceHolder(results);
      } else {
        g = _.groupBy(g, (o) => o.level);
        _.forEach(g, (l, k) => {
          results.push(
            <dt key={`aa-type-admin-${l}-${k}`} className='drop-menu-sectitle'>
              <strong>{t('Admin Level')} - {k}</strong>
            </dt>
          );
          _.forEach(l, (o, i) => {
            results.push(
              <dd key={`aa-type-admin-${o}-${k}-${i}`} className='drop-menu-result'>
              <small><a onClick={(e) => {
                const name = (getLanguage() === 'en') ? 'name_en' : 'name_vn';
                const adminArea = this.props.admins.find(o => o[name] === e.target.textContent).id;
                this.refs.results.classList.remove('search-results-show');
                this.searchAdminArea(adminArea);
              }}>{getLanguage() === 'en' ? o.name_en : o.name_vn}</a></small>
            </dd>
            );
          });
        });
      }
    } else {
      if (!g.length) {
        this.renderPlaceHolder(results);
      } else {
        _.forEach(g, (o, k) => {
          results.push(
          <dt key={`aa-type-vpromms-${k}`} className='drop-menu-sectitle'>
            <a onClick={(e) => {
              const vprommsId = e.target.textContent;
              this.refs.results.classList.remove('search-results-show');
              this.searchVProMMsID(vprommsId);
            }}>
              <strong>{o}</strong>
            </a>
          </dt>);
        });
      }
    }
    return (
      <dl className='drop-menu'>
        {results}
      </dl>
    );
  },

  searchBar: function () {
    const searchPlaceHolder = this.props.searchType === 'Admin' ? t('Search by Admin Area') : t('Search by VProMMs ID');
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
    return (
      <form className='form-search' ref='searchForm'>
        <div className={classNames('drop dropdown center', {open: this.props.searching})}>
          {this.searchBar()}
          <div className='drop-content search-results' ref='results'>
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
    vpromms: state.fieldVProMMsids.ids,
    filteredVProMMs: state.setFilteredVProMMs,
    searchResultsDisplay: state.searchResultsDisplay.show,
    query: state.search.query,
    lang: state.language.current
  };
}

function dispatcher (dispatch) {
  return {
    _fetchFieldVProMMsIds: () => dispatch(fetchFieldVProMMsIds()),
    _fetchVProMMsBbox: (vprommsId) => dispatch(fetchVProMMsBbox(vprommsId)),
    _setFilteredVProMMs: (filteredVProMMs) => dispatch(setFilteredVProMMs(filteredVProMMs)),
    _clearAdmins: () => dispatch(clearAdmins()),
    _fetchAdmins: (id) => dispatch(fetchAdmins(id)),
    _fetchAdminBbox: (id) => dispatch(fetchAdminBbox(id))
  };
}

module.exports = connect(selector, dispatcher)(Search);
