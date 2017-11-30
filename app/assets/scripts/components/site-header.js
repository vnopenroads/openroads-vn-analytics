'use strict';
import React from 'react';
import c from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  setSearchType,
  showSearch,
  setLanguage
} from '../actions/action-creators';
import { t, getAvailableLanguages, getLanguage } from '../utils/i18n';

var SiteHeader = React.createClass({
  displayName: 'SiteHeader',

  propTypes: {
    _showSearch: React.PropTypes.func,
    _setSearchType: React.PropTypes.func,
    _setLanguage: React.PropTypes.func,
    fetchSearchResults: React.PropTypes.func,
    cleanSearchResults: React.PropTypes.func,
    routes: React.PropTypes.array,
    search: React.PropTypes.object,
    pathname: React.PropTypes.string,
    searchType: React.PropTypes.string,
    displaySearch: React.PropTypes.bool
  },

  getInitialState: function () {
    return {
      menu: {
        lang: false,
        actions: false
      }
    };
  },

  toggleMenuHandler: function (what, e) {
    e.preventDefault();
    let menu = this.getInitialState().menu;
    menu[what] = !this.state.menu[what];

    this.setState({menu});
  },

  onBodyClick: function (e) {
    let attr = e.target.getAttribute('data-hook');
    if (attr !== 'menu-block-trigger') {
      this.setState({menu: this.getInitialState().menu});
    }
  },

  componentDidMount: function () {
    document.addEventListener('click', this.onBodyClick);
  },

  componentWillUmount: function () {
    window.removeEventListener('click', this.onBodyClick);
  },

  render: function () {
    return (
      <header className='site__header' ref={(header) => this.header = header }>
        <div className='inner'>
          <div className='site__headline'>
            <h1 className='site__title'><Link to={`/${getLanguage()}`}><img src='assets/graphics/layout/openroads-vn-logo-hor-neg.svg' width='736' height='96' alt='OpenRoads Vietnam logo' /><span>OpenRoads</span> <strong>Vietnam</strong></Link></h1>
          </div>
          <nav className='site__nav' role='navigation'>

            <div className={c('site__nav-block site__nav-block--language', {'site__nav-block--reveal': this.state.menu.lang})}>
              <h2 className='site__menu-toggle'><a href='#menu-block-language' onClick={this.toggleMenuHandler.bind(null, 'lang')} data-hook='menu-block-trigger'><span>{t('Language')}</span></a></h2>
              <div className='site__menu-block' id='menu-block-language'>
                <ul className='site__menu'>
                  { getAvailableLanguages().map(l => {
                    let cl = c('site__menu-item', {
                      'site__menu-item--active': l.key === getLanguage()
                    });
                    let url = this.props.pathname.replace(`/${getLanguage()}`, `/${l.key}`);
                    return <li key={l.key}><Link to={url} className={cl} title={t('Change language')} onClick={(e) => { this.props._setLanguage(l.key); }}>{l.name}</Link></li>;
                  }) }
                </ul>
              </div>
            </div>

            <div className={c('site__nav-block site__nav-block--global', {'site__nav-block--reveal': this.state.menu.actions})}>
              <h2 className='site__menu-toggle'><a href='#menu-block-global' onClick={this.toggleMenuHandler.bind(null, 'actions')} data-hook='menu-block-trigger'><span>{t('Menu')}</span></a></h2>
              <div className='site__menu-block' id='menu-block-global'>
                <ul className='site__menu'>
                  <li><Link to={`/${getLanguage()}/assets`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>{t('Assets')}</Link></li>
                  <li>
                    <Link to={`/${getLanguage()}/explore`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                      <span>{t('Explore')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${getLanguage()}/editor`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                      <span>{t('Editor')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${getLanguage()}/tasks`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                      <span>{t('Tasks')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${getLanguage()}/upload`} className='site__menu-item' activeClassName='site__menu-item--active' title={t('Visit')}>
                      <span>{t('Upload')}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>
    );
  }
});

function selector (state) {
  return {
    displaySearch: state.searchDisplay.show,
    searchType: state.setSearchType.searchType
  };
}

function dispatcher (dispatch) {
  return {
    _showSearch: (bool) => dispatch(showSearch(bool)),
    _setSearchType: (searchType) => dispatch(setSearchType(searchType)),
    _setLanguage: (lang) => dispatch(setLanguage(lang))
  };
}

module.exports = connect(selector, dispatcher)(SiteHeader);
