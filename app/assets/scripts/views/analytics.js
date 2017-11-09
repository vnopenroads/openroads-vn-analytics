'use strict';
import React from 'react';
import { t } from '../utils/i18n';

var Analytics = React.createClass({
  displayName: 'Analytics',

  propTypes: {
    _setCrossWalk: React.PropTypes.func,
    fieldVProMMsids: React.PropTypes.array,
    children: React.PropTypes.object,
    crosswalk: React.PropTypes.object,
    params: React.PropTypes.object,
    VProMMSids: React.PropTypes.object
  },

  render: function () {
    return (
      <section className='inpage inpage--alt'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{t('Analytics')}</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <div className='aa-main'>
              {this.props.children}
            </div>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Analytics;
