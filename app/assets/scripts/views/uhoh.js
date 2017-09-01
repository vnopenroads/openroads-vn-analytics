'use strict';
import React from 'react';
import { t } from '../utils/i18n';

var UhOh = React.createClass({
  displayName: 'UhOh',

  render: function () {
    return (
      <div>
        <h2>404 Not found</h2>
        <p>{t('UhOh that is a bummer.')}</p>
      </div>
    );
  }
});

module.exports = UhOh;
