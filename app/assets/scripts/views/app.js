'use strict';
import React from 'react';
import SiteHeader from '../components/site-header';

var App = React.createClass({
  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div>
        <SiteHeader/>
        <main className='site-body'>
          {this.props.children}
        </main>
      </div>
    );
  }
});

module.exports = App;
