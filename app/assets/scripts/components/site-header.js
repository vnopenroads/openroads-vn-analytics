'use strict';
import React from 'react';
import {
  compose,
  getContext,
  mapProps,
  withStateHandlers
} from 'recompose';
import {
  Link,
  withRouter
} from 'react-router';
import { t } from '../utils/i18n';


const SiteHeader = ({
  shouldShowLangaugeDropdown, shouldShowMenuDropdown, language, pathname,
  toggleLanguageBlock, toggleMenuDropDown
}) => (
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
        <div className={`site__nav-block site__nav-block--global ${shouldShowMenuDropdown ? 'site__nav-block--reveal' : ''}`}>
          <h2 className='site__menu-toggle'>
            <button
              onClick={toggleMenuDropDown}
              title={t('Change language')}
            >
              {t('Menu')}
            </button>
          </h2>
          <div className='site__menu-block' id='menu-block-global'>
            <ul className='site__menu'>
              <li>
                <Link
                  to={`/${language}/assets`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'
                  onClick={toggleMenuDropDown}
                  title={t('Visit')}
                >
                  {t('Assets')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/explore`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'
                  onClick={toggleMenuDropDown}
                  title={t('Visit')}
                >
                  <span>{t('Explore')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/editor`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'
                  onClick={toggleMenuDropDown}
                  title={t('Visit')}
                >
                  <span>{t('Editor')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/tasks`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'
                  onClick={toggleMenuDropDown}
                  title={t('Visit')}
                >
                  <span>{t('Tasks')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/upload`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'
                  onClick={toggleMenuDropDown}
                  title={t('Visit')}
                >
                  <span>{t('Upload')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/faq`}
                  className='site__menu-item'
                  activeClassName='site__menu-item--active'
                  onClick={toggleMenuDropDown}
                  title={t('Visit')}
                >
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
  withStateHandlers(
    { shouldShowLangaugeDropdown: false, shouldShowMenuDropdown: false },
    {
      toggleLanguageBlock: ({ shouldShowLangaugeDropdown }) => () => ({ shouldShowLangaugeDropdown: !shouldShowLangaugeDropdown }),
      toggleMenuDropDown: ({ shouldShowMenuDropdown }) => () => ({ shouldShowMenuDropdown: !shouldShowMenuDropdown })
    }
  )
)(SiteHeader);
