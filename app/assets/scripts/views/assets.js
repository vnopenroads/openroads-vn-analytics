'use strict';
import React from 'react';
import T from '../components/t';
import AssetsSearch from '../components/assets-search';

const Assets = ({ children }) => (
  <section className='inpage'>
    <header className='inpage__header'>
      <div className='inner'>
        <div className='inpage__headline'>
          <h1 className='inpage__title'><T>Assets</T></h1>
        </div>
        <div className='inpage__actions'>
          <AssetsSearch />
        </div>
      </div>
    </header>
    <div className='inpage__body'>
      <div className='inner'>
        {children}
      </div>
    </div>
  </section>
);

export default Assets;
