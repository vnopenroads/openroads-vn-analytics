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
            <p className='description'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam molestiae
            deserunt temporibus voluptate ullam doloribus quam quisquam modi recusandae
            debitis neque hic nam, quibusdam dolore rerum aut, eaque deleniti tenetur!</p>
            <Link to='/analytics' className='bttn-explore'>Explore more</Link>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Home;
