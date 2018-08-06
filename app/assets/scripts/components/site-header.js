'use strict';
import React from 'react';
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

const classForLanguage = (current, lang) => c('drop__menu-item', {'drop__menu-item--active': current === lang});

const SiteHeader = ({language, pathname}) => (
  <header className='site__header'>
    <div className='inner'>
      <div className='site__headline'>
        <h1 className='site__title'>
          <Link to={`/${language}`}>
            <img src='assets/graphics/layout/openroads-vn-logo-hor-neg.svg' width='736' height='96' alt='OpenRoads Vietnam logo' /><span>OpenRoads</span> <strong>Vietnam</strong>
          </Link>
        </h1>
      </div>

      <nav className='site__nav' role='navigation'>
        <Dropdown
          className='menu-language'
          triggerClassName='button-language'
          triggerActiveClassName='button--active'
          triggerText={language}
          triggerTitle={translate(language, 'Change Language')}
          direction='down'
          alignment='center' >
          <ul className='drop__menu drop__menu--select'>
            <li><Link to={pathname.replace(/^\/[a-z]+/, '/en')} className={classForLanguage(language, 'en')}>English</Link></li>
            <li><Link to={pathname.replace(/^\/[a-z]+/, '/vi')} className={classForLanguage(language, 'vi')}>Tiếng Việt</Link></li>
          </ul>
        </Dropdown>

        <div className={`site__nav-block site__nav-block--global`}>
          <h2 className='site__menu-toggle'><T>Menu</T></h2>
          <div className='site__menu-block' id='menu-block-global'>
            <ul className='site__menu'>
              <li>
                <Link
                  to={`/${language}/assets`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'>
                  <T>Assets</T>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/explore`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'>
                  <T>Explore</T>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/editor`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'>
                  <T>Editor</T>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/tasks`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'>
                  <T>Tasks</T>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/upload`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'>
                  <T>Upload</T>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/faq`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'>
                  <T>FAQ</T>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
);


SiteHeader.propTypes = {
  language: React.PropTypes.string.isRequired,
  pathname: React.PropTypes.string.isRequired
};


module.exports = compose(
  getContext({ language: React.PropTypes.string }),
  withRouter,
  mapProps(({ language, router: { location: { pathname } } }) => ({
    language,
    pathname
  }))
)(SiteHeader);
