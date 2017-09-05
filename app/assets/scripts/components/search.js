'use strict';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ID from '../utils/id';
import { t } from '../utils/i18n';
import { isDescendent } from '../utils/dom';
import { fetchVProMMSids, setFilteredVProMMs } from '../actions/action-creators';

var Search = React.createClass({
  displayName: 'Search',

  propTypes: {
    _fetchAdminSearchResults: React.PropTypes.func,
    cleanSearchResults: React.PropTypes.func,
    onResultClick: React.PropTypes.func,
    results: React.PropTypes.array,
    searching: React.PropTypes.bool,
    isEditor: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    fetchSearchResults: React.PropTypes.func,
    searchType: React.PropTypes.string,
    vpromms: React.PropTypes.array,
    _setFilteredVProMMs: React.PropTypes.func,
    filteredVProMMs: React.PropTypes.array,
    _fetchVProMMSids: React.PropTypes.func
  },

  onSearchQueryChange: function () {
    var searchVal = _.trim(this.refs.searchBox.value);
    if (this.props.searchType === 'Admin') {
      if (searchVal.length >= 3) {
        this.props.fetchSearchResults(searchVal);
      } else {
        this.props.cleanSearchResults();
      }
    } else {
      if (searchVal.length >= 2) {
        this.filterVProMMs(searchVal);
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

  },

  searchClick: function (e) {
    e.preventDefault();
    if (!this.props.fetching) {
      var searchVal = _.trim(this.refs.searchBox.value);
      if (searchVal.length) {
        if (this.props.searchType === 'Admin') {
          this.props.fetchSearchResults(searchVal);
        } else {
          this.searchVProMMsID(searchVal);
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
    document.addEventListener('click', this.onDocumentClick, false);
    document.addEventListener('keyup', this.onKeyup, false);
    this.props._fetchVProMMSids('search');
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this.onDocumentClick, false);
    document.removeEventListener('keyup', this.onKeyup, false);
  },

  renderResults: function () {
    if (this.props.fetching) {
      return (<p className='info'>Loading...</p>);
    }
    if (this.props.searchType === 'Admin' && this.props.results.length === 0) {
      return (<p className='info'>No results available. Please refine your search.</p>);
    }

    if (this.props.searchType === 'VProMMs' && this.props.filteredVProMMs.length === 0) {
      return (<p className='info'>No results available. Please refine your search.</p>);
    }

    // Group by type.
    var g = this.props.searchType === 'Admin' ? _.groupBy(this.props.results, 'type') : this.props.filteredVProMMs;
    var results = [];
    if (this.props.searchType === 'Admin') {
      _.forEach(g, (o, k) => {
        // Admin type title.
        results.push(<dt key={`aa-type-${k}`} className='drop-menu-sectitle'><strong>{ID.getDisplayType(k, true)}</strong> <small className='badge'>{o.length}</small></dt>);
        // Admin areas.
        _.forEach(o, (d, i) => {
          let lPath = this.props.isEditor ? `/editor/bbox=${d.bbox.join('/')}` : `/analytics/${d.id}`;
          results.push(
            <dd key={`aa-type-${k}-${i}`} className='drop-menu-result'>
              <Link to={lPath} onClick={this.onResultClick} title={`${d.name} in ${d.parent.name}`}><strong>{d.name}</strong><small> <i>in</i> {d.parent.name}</small></Link>
            </dd>
          );
        });
      });
    } else {
      _.forEach(g, (o, k) => {
        results.push(<dt key={`aa-type-${k}`} className='drop-menu-sectitle' onClick={(e) => { console.log('df'); }}><strong>{o}</strong></dt>);
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
        <input type='search' className='form-control input-search' placeholder={searchPlaceHolder} ref='searchBox' onChange={_.debounce(this.onSearchQueryChange, 300)} />
        <span className='input-group-bttn'>
          <a href='#' className='bttn-search' onClick={this.searchClick}><span>{t('Search')}</span></a>
        </span>
      </div>
    );
  },

  render: function () {
    const resultsExist = this.props.results.length > 0 || this.props.filteredVProMMs.length > 0;
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
    vpromms: state.VProMMSids.ids,
    filteredVProMMs: state.setFilteredVProMMs.filteredVProMMs
  };
}

function dispatcher (dispatch) {
  return {
    _fetchVProMMSids: (use) => dispatch(fetchVProMMSids(use)),
    _setFilteredVProMMs: (filteredVProMMs) => dispatch(setFilteredVProMMs(filteredVProMMs))
  };
}

module.exports = connect(selector, dispatcher)(Search);
