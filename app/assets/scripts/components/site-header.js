'use strict';
import React from 'react';

var SiteHeader = React.createClass({
  render: function () {
    return (
      <header className='site-header'>
        <div className='inner'>
          <div className='site__headline'>
            <h1 className='site__title'><img src='assets/graphics/layout/or-logo.png' width='500' height='63' alt='Open Roads logo' /><span>Open Roads Analytics</span></h1>
          </div>
          <div className='site__search'>
            <form className='form-search'>
              <div className='drop open dropdown center'>
                <div className='input-group'>
                  <input type='search' className='form-control input-search' placeholder='Search administrative area' />
                  <span className='input-group-bttn'>
                    <a href='search.html' className='bttn-search'><span>Search</span></a>
                  </span>
                </div>
              </div>
            </form>
          </div>
          <div className='site__nav'>
            <nav>
              <ul>
                <li><a href='#'>Home</a></li>
                <li><a href='#'>About</a></li>
                <li><a href='#'>Map</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    );
  }
});

module.exports = SiteHeader;
