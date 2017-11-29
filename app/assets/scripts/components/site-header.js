'use strict';
import React from 'react';
import {
  compose,
  getContext,
  mapProps,
  withState,
  withHandlers
} from 'recompose';
import {
  Link,
  withRouter
} from 'react-router';
import { t } from '../utils/i18n';


const SiteHeader = ({ shouldShowLangaugeDropdown, language, pathname, toggleLanguageBlock }) => (
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
        <div className={`site__nav-block site__nav-block--language ${shouldShowLangaugeDropdown ? 'site__nav-block--reveal' : ''}`}>
          <h2 className='site__menu-toggle'>
            <button
              onClick={toggleLanguageBlock}
              title={t('Change language')}
            />
          </h2>
          <div className='site__menu-block'>
            <ul className='site__menu'>
            <li>
              <Link
                to={pathname.replace(/^\/[a-z]+/, '/en')}
                className={`site__menu-item ${language === 'en' ? 'site__menu-item--active' : ''}`}
                onClick={toggleLanguageBlock}
              >
                English
              </Link>
              <Link
                to={pathname.replace(/^\/[a-z]+/, '/vi')}
                className={`site__menu-item ${language === 'vi' ? 'site__menu-item--active' : ''}`}
                onClick={toggleLanguageBlock}
              >
                Vietnamese
              </Link>
            </li>
            </ul>
          </div>
        </div>
          <div className={c('site__nav-block site__nav-block--global', {'site__nav-block--reveal': this.state.menu.actions})}>
            <h2 className='site__menu-toggle'><a href='#menu-block-global' onClick={this.toggleMenuHandler.bind(null, 'actions')} data-hook='menu-block-trigger'><span>{t('Menu')}</span></a></h2>
            <div className='site__menu-block' id='menu-block-global'>
              <ul className='site__menu'>
                <li><Link to={`/${language}/assets`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>{t('Assets')}</Link></li>
                <li>
                  <Link to={`/${language}/explore`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                    <span>{t('Explore')}</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/${language}/editor`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                    <span>{t('Editor')}</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/${language}/tasks`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                    <span>{t('Tasks')}</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/${language}/upload`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                    <span>{t('Upload')}</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/${language}/faq`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                    <span>{t('FAQ')}</span>
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
  pathname: React.PropTypes.string.isRequired,
  shouldShowLangaugeDropdown: React.PropTypes.bool.isRequired,
  toggleLanguageBlock: React.PropTypes.func.isRequired
};


module.exports = compose(
  getContext({ language: React.PropTypes.string }),
  withRouter,
  mapProps(({ language, router: { location: { pathname } } }) => ({
    language,
    pathname
  })),
  withState('shouldShowLangaugeDropdown', 'showLangaugeDropdown', false),
  withHandlers({
    toggleLanguageBlock: ({ shouldShowLangaugeDropdown, showLangaugeDropdown }) => () =>
      showLangaugeDropdown(!shouldShowLangaugeDropdown)
  })
)(SiteHeader);
