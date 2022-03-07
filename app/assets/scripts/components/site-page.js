'use strict';
import React from 'react';
import { Link } from 'react-router';
import { getContext } from 'recompose';
import PropTypes from 'prop-types';
import T from '../components/t';

class SitePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    var { pageName, innerPage, noMargins, subPageNav, language, pageNameTag } = this.props;

    var inpageClasses = "inpage";
    if (noMargins) { inpageClasses += " inpage--alt" }
    var urlPrefix = `/${language.toLowerCase()}/${pageName.toLowerCase()}`;


    // If this is a page with sub-sections, create a nav pane for these
    if (subPageNav) {
      var subPageNav = subPageNav.map((subPageName) => {
        return (
          <li key={subPageName}>
            <Link to={`${urlPrefix}/${subPageName.toLowerCase()}`} className='inpage__menu-link' activeClassName='inpage__menu-link--active' title={subPageName}>
              <span><T>{subPageName}</T></span>
            </Link>
          </li>);
      });
      subPageNav = (
        <nav className='inpage__nav'>
          <ul className='inpage__menu'>
            {subPageNav}
          </ul>
        </nav>);

    }


    return (
      <section className={inpageClasses}>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>{pageName}</T></h1>
            </div>
            {pageNameTag}
            {subPageNav}
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
}

export default getContext({ language: PropTypes.string })(SitePage);
