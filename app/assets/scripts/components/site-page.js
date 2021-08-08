'use strict';
import React from 'react';
import { Link } from 'react-router';
import T from '../components/t';

const SitePage = ({ pageName, innerPage, noMargins, language, subPageNav }) => {
  var inpageClasses = "inpage";
  if (noMargins) { inpageClasses += " inpage--alt" }

  var subPageNav = subPageNav.map((subPageName) => {
    return (
      <li key={subPageName}>
        <Link to={`/${language}/${pageName}/${subPageName}`} className='inpage__menu-link' activeClassName='inpage__menu-link--active' title={subPageName}>
          <span><T>{subPageName}</T></span>
        </Link>
      </li>);
  });

  return (
    <section className={inpageClasses}>
      <header className='inpage__header'>
        <div className='inner'>
          <div className='inpage__headline'>
            <h1 className='inpage__title'><T>{pageName}</T></h1>
          </div>
          <nav className='inpage__nav'>
            <ul className='inpage__menu'>
              {subPageNav}
            </ul>
          </nav>
          <div className='inpage__actions'>
          </div>
        </div>
      </header>
      <div className='inpage__body'>
        <div className='inner'>
          {innerPage}
        </div>
      </div>
    </section>
  )
};

export default SitePage;
