'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  getContext,
  mapProps
} from 'recompose';
import {
  Link,
  withRouter
} from 'react-router';
import c from 'classnames';
import T, {
  translate
} from './t';
import Dropdown from './dropdown';

const classForLanguage = (current, lang) => c('drop__menu-item', { 'drop__menu-item--active': current === lang });

const SiteHeader = ({ language, pathname }) => {
  var items = [];
  var navItems = [
    ["assets", "Assets"],
    ["explore", "Explore"],
    ["editor", "Editor"],
    ["tasks", "Tasks"],
    ["cba/config", "CBA"],
    ["upload", "Upload"],
    ["faq", "FAQ"]
  ];

  for (const [route, uxName] of navItems) {
    items.push(<li key={uxName}>
      <Link to={`/${language}/${route}`}
        className='site__menu-global-item'
        activeClassName='site__menu-global-item--active'>
        <T>{uxName}</T>
      </Link>
    </li>);
  }
  return (<header className='site__header'>
    <div className='inner'>
      <div className='site__headline'>
        <h1 className='site__title'>
          <Link to={`/${language}`}>
            <img src='assets/graphics/layout/openroads-vn-logo-hor-neg.svg' width='736' height='96' alt='OpenRoads Vietnam logo' /><span>OpenRoads</span> <strong>Vietnam v3.4.0</strong>
          </Link>
        </h1>
      </div>

      <nav className='site__nav' role='navigation'>
        <Dropdown
          className='site__menu-language'
          triggerClassName='button-language'
          triggerActiveClassName='button--active'
          triggerText={language === 'en' ? 'English' : 'Tiếng Việth'}
          triggerTitle={translate(language, 'Change Language')}
          direction='down'
          alignment='center' >
          <h3 className='drop__title'><T>Select language</T></h3>
          <ul className='drop__menu drop__menu--select'>
            <li><Link to={pathname.replace(/^\/[a-z]+/, '/en')} className={classForLanguage(language, 'en')}>English</Link></li>
            <li><Link to={pathname.replace(/^\/[a-z]+/, '/vi')} className={classForLanguage(language, 'vi')}>Tiếng Việt</Link></li>
          </ul>
        </Dropdown>
        <ul className='site__menu-global'>{items}</ul>
      </nav>
    </div>
  </header>
  )
};


SiteHeader.propTypes = {
  language: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired
};


module.exports = compose(
  getContext({ language: PropTypes.string }),
  withRouter,
  mapProps(({ language, router: { location: { pathname } } }) => ({
    language,
    pathname
  }))
)(SiteHeader);
