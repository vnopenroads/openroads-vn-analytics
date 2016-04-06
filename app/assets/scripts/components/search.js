'use strict';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router';
import ID from '../utils/id';
import { isDescendent } from '../utils/dom';

var Search = React.createClass({
  displayName: 'Search',

  propTypes: {
    fetchSearchResults: React.PropTypes.func,
    cleanSearchResults: React.PropTypes.func,
    onResultClick: React.PropTypes.func,
    results: React.PropTypes.array,
    searching: React.PropTypes.bool,
    isEditor: React.PropTypes.bool,
    fetching: React.PropTypes.bool
  },

  onSearchQueryChange: function () {
    var searchVal = _.trim(this.refs.searchBox.value);
    if (searchVal.length >= 3) {
      this.props.fetchSearchResults(searchVal);
    } else {
      this.props.cleanSearchResults();
    }
  },

  searchClick: function (e) {
    e.preventDefault();
    if (!this.props.fetching) {
      var searchVal = _.trim(this.refs.searchBox.value);
      if (searchVal.length) {
        this.props.fetchSearchResults(searchVal);
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
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this.onDocumentClick, false);
    document.removeEventListener('keyup', this.onKeyup, false);
  },

  renderResults: function () {
    if (this.props.fetching) {
      return (<p className='info'>Loading...</p>);
    }
    if (this.props.results.length === 0) {
      return (<p className='info'>No results available. Please refine your search.</p>);
    }

    // Group by type.
    var g = _.groupBy(this.props.results, 'type');

    var results = [];
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

    return (
      <dl className='drop-menu'>
        {results}
      </dl>
    );
  },

  render: function () {
    return (
      <form className='form-search' ref='searchForm'>
        <div className={classNames('drop dropdown center', {open: this.props.searching})}>
          <div className='input-group'>
            <input type='search' className='form-control input-search' placeholder='Search administrative area' ref='searchBox' onChange={_.debounce(this.onSearchQueryChange, 300)} />
            <span className='input-group-bttn'>
              <a href='#' className='bttn-search' onClick={this.searchClick}><span>Search</span></a>
            </span>
          </div>
          <div className='drop-content search-results'>
            {this.renderResults()}
          </div>
        </div>
      </form>
    );
  }
});

module.exports = Search;
