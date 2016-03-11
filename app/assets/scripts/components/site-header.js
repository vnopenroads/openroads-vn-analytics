'use strict';
import React from 'react';
import Search from './search';

var SiteHeader = React.createClass({
  displayName: 'SiteHeader',

  propTypes: {
    fetchSearchResults: React.PropTypes.func,
    cleanSearchResults: React.PropTypes.func,
    search: React.PropTypes.object
  },

  render: function () {
    return (
      <header className='site-header'>
        <div className='inner'>
          <div className='site__headline'>
            <h1 className='site__title'><img src='assets/graphics/layout/or-logo.png' width='500' height='63' alt='Open Roads logo' /><span>Open Roads Analytics</span></h1>
            <div className='site__nav'>
              <nav>
                <ul>
                  <li><a href='#'>Analytics</a></li>
                  <li><a href='#'>Map</a></li>
                  <li><a href='#'>About</a></li>
                </ul>
              </nav>
            </div>
          </div>
          <div className='site__search'>
            <Search
              fetchSearchResults={this.props.fetchSearchResults}
              cleanSearchResults={this.props.cleanSearchResults}
              results={this.props.search.results}
              query={this.props.search.query}
              fetching={this.props.search.fetching}
              searching={this.props.search.searching} />
          </div>
        </div>
      </header>
    );
  }
});

module.exports = SiteHeader;
