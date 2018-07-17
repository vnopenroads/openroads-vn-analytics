'use strict';
import React from 'react';
import config from '../config';
import T from '../components/t';


var Playground = React.createClass({
  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>Playground</T></h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>

            <p>Hello world!</p>

          </div>
        </div>
      </section>
    );
  }
});

module.exports = Playground;
