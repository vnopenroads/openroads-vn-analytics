'use strict';
import React, {
  PropTypes
} from 'react';
import {
  getContext
} from 'recompose';
import { Link } from 'react-router';
import T from '../components/t';


const Home = ({ language }) => (
  <section>
    <header className='page__header--landing'>
      <div className='page__headline--landing'>
        <h1 className='page__title--landing'><img src='assets/graphics/layout/openroads-vn-logo-hor-neg.svg' width='736' height='96' alt='OpenRoads Vietnam logo' /><span>OpenRoads</span> <strong>Vietnam</strong></h1>
        <p className='page__description--landing'>
          <T>Tracking and visualizing road assets in Vietnam for inclusive growth.</T>
        </p>
      </div>
    </header>

    <div className='page__body--landing'>
      <div className='inner'>
        <h2><T>Access and improve Road Networks</T></h2>
        <p className='description'><T>Work with the OpenRoads project to close this critical information gap and create a comprehensive road network of Vietnam</T></p>
        <div className='cta-block'>
          <Link to={`/${language}/assets`} className='button button--xlarge button--base-raised-light'><T>View assets</T></Link> <small>or</small> <Link to={`/${language}/explore`} className='button button--xlarge button--primary-raised-dark'><T>Explore on map</T></Link>
        </div>
      </div>
    </div>
  </section>
);

export default getContext({ language: PropTypes.string })(Home);
