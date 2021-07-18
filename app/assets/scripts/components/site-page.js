'use strict';
import React from 'react';
import T from '../components/t';

const SitePage = ({ pageName, innerPage, noMargins }) => {
  var inpageClasses = "inpage";
  if (noMargins) { inpageClasses += " inpage--alt" }

  return (
    <section className={inpageClasses}>
      <header className='inpage__header'>
        <div className='inner'>
          <div className='inpage__headline'>
            <h1 className='inpage__title'><T>{pageName}</T></h1>
          </div>
        </div>
      </header>
      <div className='inpage__body'>
        <div className='inner'>
          {innerPage}
        </div>
      </div>
    </section>
  )};

export default SitePage;
