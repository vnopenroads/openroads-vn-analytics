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
    <div className='inpage__body'>
      <div className='inner'>
        <section className="question">
          <h1 className='inpage__title'>First Question Title</h1>
          <p>lorem ipsum dolores sed...</p>
        </section>

        <section className="question">
          <h1 className='inpage__title'>Second Question Title</h1>
          <p>lorem ipsum dolores sed...</p>
        </section>

        <section>
          <form action="mailto:dphan2@worldbank.org" method="GET">
            <p>
              If you have any remaining questions
              <button className="button button--base-raised-light">email us</button>
            </p>
          </form>
        </section>
      </div>
    </div>
  </section>
);
