import React from 'react';
import { t } from '../utils/i18n';

export default () => (
  <section className='inpage'>
    <header className='inpage__header'>
      <div className='inner'>
        <div className='inpage__headline'>
          <h1 className='inpage__title'>{t('Frequently Asked Questions')}</h1>
        </div>
      </div>
    </header>
    <div className='inpage__body' />
  </section>
);
