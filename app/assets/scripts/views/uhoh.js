'use strict';
import React from 'react';
import T from '../components/t';


var UhOh = React.createClass({
  displayName: 'UhOh',

  render: function () {
    return (
      <div className='inpage__body'>
        <div className='inner'>
          <h2><T>Page Not Found</T></h2>
        </div>
      </div>
    );
  }
});

module.exports = UhOh;
