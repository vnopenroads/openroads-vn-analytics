'use strict';
import React from 'react';
import { Link } from 'react-router';

var Home = React.createClass({
  displayName: 'Home',

  render: function () {
    return (
      <section>
        <header className='page__header--landing'>
          <div className='page__headline--landing'>
            <h1 className='page__title--landing'><img src='assets/graphics/layout/or-logo.png' width='500' height='63' alt='Open Roads logo' /><span>Welcome</span></h1>
            <p className='page__description--landing'>Mapping, tracking and visualizing road projects in the Philippines for inclusive growth</p>
          </div>
        </header>

        <div className='page__body--landing'>
          <div className='inner'>
            <h2>Access and improve Road Networks</h2>
            <p className='description'>The Philippines has over 215 000 kilometers of road. 32 526 of these are national roads that are generally well mapped. The local road network is estimated to be well over 180 000 kilometers, but these estimates are rough since much of it remains unmapped.</p>
            <p className='description'>Work with the OpenRoads project to close this critical information gap and create a comprehensive road network map of the Philippines.</p>
            <Link to='/analytics' className='bttn-explore'>Explore more</Link>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Home;
