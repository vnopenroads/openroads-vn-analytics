'use strict';
import React from 'react';
import T from '../components/t';

export default class UhOh extends React.Component {
  render() {
    return (
      <div className='inpage__body'>
        <div className='inner'>
          <h2><T>Page Not Found</T></h2>
        </div>
      </div>
    );
  };

};
