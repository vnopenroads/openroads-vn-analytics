'use strict';

import React from 'react';
import _ from 'lodash';
import T, {
  translate
} from './t';
import config from '../config';


var BaseSearch = React.createClass({
  displayName: 'MapSearch',

  propTypes: {
    searchType: React.PropTypes.string,
    page: React.PropTypes.string,
    fetching: React.PropTypes.bool,
    vpromms: React.PropTypes.array,
    admins: React.PropTypes.array,
    filteredVProMMs: React.PropTypes.array,
    language: React.PropTypes.string,
    _setSearchType: React.PropTypes.func,
    _fetchAdmins: React.PropTypes.func,
    _clearAdmins: React.PropTypes.func,
    _setFilteredVProMMs: React.PropTypes.func,
    fetchRoadBbox: React.PropTypes.func,
    _fetchFieldVProMMsIds: React.PropTypes.func,
    _fetchAdminBbox: React.PropTypes.func,
    fetchRoadProperty: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      searchVal: '',
      showResults: true
    };
  },

  componentDidMount: function () {
    this.props._fetchFieldVProMMsIds();
    this.search = _.debounce(this.search, 300);
  },

  componentWillUnmount: function () {
    this.props._clearAdmins();
    this.props._setFilteredVProMMs([]);
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.language !== nextProps.language) {
      this.setState({ searchVal: '', showResults: false });
      this.props._clearAdmins();
      this.props._setFilteredVProMMs([]);
    }
  },

  onClearSearch: function (e) {
    this.setState({ searchVal: '', showResults: false });
    this.props._clearAdmins();
    this.props._setFilteredVProMMs([]);
  },

  onSearchTypeChange: function (e) {
    this.props._setSearchType(e.target.value);
    this.setState({ searchVal: '', showResults: true });
    this.props._clearAdmins();
    this.props._setFilteredVProMMs([]);
  },

  onSearchQueryChange: function (e) {
    var searchVal = e.target.value;
    this.setState({ searchVal, showResults: true });
    // The search function is debounced.
    this.search(_.trim(searchVal));
  },

  onSearchSubmit: function (e) {
    e.preventDefault();
    this.setState({ showResults: true });
    const { page } = this.props;
    // On enter, use the first value. Feeling lucky!
    var searchVal = this.state.searchVal;
    if (searchVal.length) {
      if (this.props.searchType === 'Admin' && this.props.admins[0]) {
        const admin = this.props.admins[0];
        this.setState({ searchVal: this.props.admins[0].name_en });
        page === 'assets' ? this.navigateToAdmin(admin) : this.searchAdminArea(admin.id);
      } else if (this.props.filteredVProMMs[0]) {
        const vpromm = this.props.filteredVProMMs[0];
        this.setState({ searchVal: this.props.filteredVProMMs[0] });
        page === 'assets' ? this.navigateToVProMM(vpromm) : this.searchVProMMsID(vpromm);
      }
    }
  },

  navigateToAdmin: function (admin) {
    if (admin.level === 'province') {
      const url = `${this.props.language}/assets/${admin.id}`;
      this.props.router.push(url);
    } else if (admin.level === 'district') {
      const apiUrl = `${config.api}/admin/${admin.id}/info`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const parentId = data.parent.id;
          const url = `${this.props.language}/assets/${parentId}/${admin.id}`;
          this.props.router.push(url);
        });
    }
    this.onClearSearch();
  },

  navigateToVProMM: function (vpromm) {
    this.onClearSearch();
    const url = `${this.props.language}/assets/road/${vpromm}`;
    this.props.router.push(url);
  },

  search: function (searchVal) {
    if (this.props.searchType === 'Admin') {
      if (searchVal.length > 0) {
        this.props._fetchAdmins(searchVal);
      } else {
        this.props._clearAdmins();
      }
    } else {
      if (searchVal.length >= 2) {
        // Filter the available vpromms.
        const matches = this.props.vpromms.filter((vpromm) => {
          return vpromm.slice(0, searchVal.length) === searchVal.toUpperCase();
        });
        this.props._setFilteredVProMMs(matches.slice(0, 10));
      } else {
        this.props._setFilteredVProMMs([]);
      }
    }
  },

  searchVProMMsID: function (VProMMsID) {
    this.setState({ showResults: false }, () => {
      // Wait for the state to be set, otherwise the shouldComponentUpdate
      // of the parent will prevent the re-render.
      // This is an artifact.
      this.props.fetchRoadBbox(VProMMsID);
      this.props.fetchRoadProperty(VProMMsID);
    });
  },

  searchAdminArea: function (adminAreaID) {
    this.setState({ showResults: false }, () => {
      // Wait for the state to be set, otherwise the shouldComponentUpdate
      // of the parent will prevent the re-render.
      // This is an artifact.
      this.props._fetchAdminBbox(adminAreaID);
    });
  },

  onAAClick: function (aa, e) {
    const { page } = this.props;
    e.preventDefault();
    this.setState({ searchVal: this.props.language === 'en' ? aa.name_en : aa.name_vn });
    page === 'assets' ? this.navigateToAdmin(aa) : this.searchAdminArea(aa.id);
  },

  onVprommClick: function (id, e) {
    const { page } = this.props;
    e.preventDefault();
    this.setState({ searchVal: id });
    page === 'assets' ? this.navigateToVProMM(id) : this.searchVProMMsID(id);
  },

  renderResults: function () {
    if (!this.state.showResults) {
      return null;
    }
    if (this.props.fetching) {
      return (
        <div className='search-results'>
          <p className='info'><T>Loading</T>...</p>
        </div>
      );
    }

    // Data to work with depends n the search type.
    let data = this.props.searchType === 'Admin' ? this.props.admins : this.props.filteredVProMMs;
    let contents = null;

    if (this.props.searchType === 'Admin') {
      // on the assets page, we don't want to show communes in the admin results
      if (this.props.page === 'assets') {
        data = data.filter(o => o.level !== 'commune');
      }
      if (data.length) {
        contents = _(data)
          .groupBy(o => o.level)
          .reduce((acc, level, key) => {
            acc.push(<h4 key={`aa-type-admin-${key}`}><T>Admin Level</T> - <T>{key}</T></h4>);
            let adminAreas = level.reduce((_acc, o) => {
              return _acc.concat(<li key={o.id}><a href='#' onClick={this.onAAClick.bind(null, o)}>{this.props.language === 'en' ? o.name_en : o.name_vn}</a></li>);
            }, []);
            acc.push(<ul key={`aa-admins-${key}`}>{adminAreas}</ul>);
            return acc;
          }, []);
      } else {
        if (this.state.searchVal) {
          contents = <p className='info' key='no-results'><T>No results available. Please refine your search</T></p>;
        }
      }
    } else if (this.props.searchType === 'VProMMs' && this.state.searchVal.length >= 2) {
      if (!data.length) {
        contents = <p className='info' key='no-results'><T>No results available. Please refine your search</T></p>;
      } else {
        contents = [<h4 key={`vpromms-title`}>VProMMs</h4>];

        let vpromms = data.reduce((acc, o, key) => {
          return acc.concat(<li key={o}><a href='#' onClick={this.onVprommClick.bind(null, o)}>{o}</a></li>);
        }, []);

        contents.push(<ul key={`vpromms-list`}>{vpromms}</ul>);
      }
    }

    if (contents === null) {
      return null;
    }

    return (
      <div className='search-results'>
        <div className='inner'>
          {contents}
        </div>
      </div>
    );
  },

  render: function () {
    const { language, searchType } = this.props;

    return (
      <form className='form search' onSubmit={this.onSearchSubmit}>
        <div className='form__group'>
          <label className='form__label' htmlFor='search-field'><T>Search</T></label>
          <div className='form__input-group form__input-group--medium'>
            <select className='form__control' onChange={this.onSearchTypeChange} value={searchType}>
              <option value='Admin'>{translate(language, 'Admin')}</option>
              <option value='VProMMs'>VProMMs</option>
            </select>
            <input
              type='text'
              id='search-field'
              name='search-field'
              className='form__control'
              placeholder={translate(language, 'Search')}
              value={this.state.searchVal}
              onChange={this.onSearchQueryChange} />
            <button
              type='button'
              className='search__button'
              onClick={this.onSearchSubmit}
            >
              <span><T>Search</T></span>
            </button>
          </div>

          {this.state.searchVal !== '' &&
            <button
              type='button'
              className='search__clear'
              title={translate(language, 'Clear search')}
              onClick={this.onClearSearch}
            >
              <span><T>Clear search</T></span>
            </button>
          }

          {this.renderResults()}

        </div>
      </form>
    );
  }
});

export default BaseSearch;
